import { useEffect, useState } from "react"

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    Tooltip,
    useMap,
} from "react-leaflet"

import L from "leaflet"
import "leaflet/dist/leaflet.css"


const liveLocationIcon = L.divIcon({
    className: "live-location-marker-container",
    html: `
        <div class="live-location-marker">
            <div class="live-location-pulse"></div>
            <div class="live-location-dot"></div>
        </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
})


function FollowDriver({ coordinates }) {
    const map = useMap()

    useEffect(() => {
        if (
            coordinates &&
            Number.isFinite(coordinates[0]) &&
            Number.isFinite(coordinates[1])
        ) {
            map.setView(coordinates, map.getZoom(), {
                animate: true,
            })
        }
    }, [coordinates, map])

    return null
}


function RideMap({
    pickupCoordinates,
    destinationCoordinates,
    driverCoordinates,
    rideStatus,
    driver,
    passenger,
}) {
    const [activeRoute, setActiveRoute] = useState([])

    const isRideCompleted = rideStatus === "completed"
    const isRideStarted = rideStatus === "started"

    const validCoordinates = (coordinates) =>
        Array.isArray(coordinates) &&
        coordinates.length >= 2 &&
        Number.isFinite(Number(coordinates[0])) &&
        Number.isFinite(Number(coordinates[1]))

    // Select the current destination for the driver's route.
    // Before the ride starts: Driver → Pickup.
    // After the ride starts: Driver → Final destination.
    useEffect(() => {
        const controller = new AbortController()

        const getActiveRoute = async () => {
            if (
                isRideCompleted ||
                !validCoordinates(driverCoordinates)
            ) {
                setActiveRoute([])
                return
            }

            const targetCoordinates = isRideStarted
                ? destinationCoordinates
                : pickupCoordinates

            if (!validCoordinates(targetCoordinates)) {
                setActiveRoute([])
                return
            }

            const [driverLat, driverLon] =
                driverCoordinates.map(Number)

            const [targetLat, targetLon] =
                targetCoordinates.map(Number)

            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${driverLon},${driverLat};${targetLon},${targetLat}?overview=full&geometries=geojson`,
                    { signal: controller.signal }
                )

                if (!response.ok) {
                    throw new Error("Unable to load the current ride route")
                }

                const data = await response.json()

                if (data.routes?.length > 0) {
                    const coordinates =
                        data.routes[0].geometry.coordinates.map(
                            ([longitude, latitude]) => [
                                latitude,
                                longitude,
                            ]
                        )

                    setActiveRoute(coordinates)
                } else {
                    setActiveRoute([])
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error(
                        "Unable to update the driver's route:",
                        error
                    )
                }
            }
        }

        getActiveRoute()

        return () => controller.abort()
    }, [
        driverCoordinates?.[0],
        driverCoordinates?.[1],
        pickupCoordinates?.[0],
        pickupCoordinates?.[1],
        destinationCoordinates?.[0],
        destinationCoordinates?.[1],
        isRideStarted,
        isRideCompleted,
    ])

    const hasDriverLocation =
        !isRideCompleted &&
        validCoordinates(driverCoordinates)

    return (
        <div className="relative h-96 w-full overflow-hidden rounded-xl">
            <MapContainer
                center={
                    validCoordinates(driverCoordinates)
                        ? driverCoordinates.map(Number)
                        : validCoordinates(pickupCoordinates)
                            ? pickupCoordinates.map(Number)
                            : [0.5198, 35.2715]
                }
                zoom={14}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {hasDriverLocation && (
                    <FollowDriver coordinates={driverCoordinates.map(Number)} />
                )}

                {/* Current driver route: blue before pickup, red after start */}
                {!isRideCompleted && activeRoute.length > 0 && (
                    <Polyline
                        positions={activeRoute}
                        pathOptions={{
                            color: isRideStarted ? "red" : "blue",
                            weight: 6,
                        }}
                    />
                )}

                {/* Driver marker uses real backend GPS coordinates */}
                {hasDriverLocation && (
                    <Marker
                        position={driverCoordinates.map(Number)}
                        icon={liveLocationIcon}
                    >
                        <Tooltip permanent direction="top">
                            🚗 {driver?.name || "Driver"} - Live location
                        </Tooltip>

                        <Popup>
                            <strong>{driver?.name || "Driver"}</strong>
                            <br />
                            Latest reported GPS location
                        </Popup>
                    </Marker>
                )}

                {/* Pickup marker remains visible during the active ride */}
                {!isRideCompleted &&
                    validCoordinates(pickupCoordinates) && (
                        <Marker position={pickupCoordinates.map(Number)}>
                            <Tooltip permanent direction="top">
                                👤 {passenger?.name || "Passenger"} - Pickup
                            </Tooltip>

                            <Popup>
                                <strong>
                                    {passenger?.name || "Passenger"}
                                </strong>
                                <br />
                                Pickup location
                            </Popup>
                        </Marker>
                    )}

                {/* Keep the destination visible after completion */}
                {validCoordinates(destinationCoordinates) && (
                    <Marker position={destinationCoordinates.map(Number)}>
                        <Popup>
                            {isRideCompleted
                                ? "Ride completed - Destination"
                                : "Destination"}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            <style>
                {`
                    .live-location-marker-container {
                        background: transparent;
                        border: none;
                    }

                    .live-location-marker {
                        position: relative;
                        width: 36px;
                        height: 36px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .live-location-pulse {
                        position: absolute;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: rgba(37, 99, 235, 0.35);
                        border: 2px solid rgba(37, 99, 235, 0.8);
                        animation: robertride-location-pulse 1.6s ease-out infinite;
                    }

                    .live-location-dot {
                        position: relative;
                        width: 12px;
                        height: 12px;
                        border-radius: 50%;
                        background: #2563eb;
                        border: 3px solid white;
                        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.45);
                    }

                    @keyframes robertride-location-pulse {
                        0% {
                            transform: scale(0.8);
                            opacity: 1;
                        }

                        100% {
                            transform: scale(2.5);
                            opacity: 0;
                        }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        .live-location-pulse {
                            animation: none;
                        }
                    }
                `}
            </style>
        </div>
    )
}

export default RideMap
