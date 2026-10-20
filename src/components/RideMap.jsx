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
        if (coordinates) {
            map.panTo(coordinates, { animate: true })
        }
    }, [coordinates?.[0], coordinates?.[1], map])

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
    const [passengerRoute, setPassengerRoute] = useState([])
    const [approachRoute, setApproachRoute] = useState([])

    const isCompleted = rideStatus === "completed"
    const isStarted = rideStatus === "started"
    const isArriving = rideStatus === "arriving"

    const validCoordinates = (coords) =>
        Array.isArray(coords) &&
        coords.length >= 2 &&
        Number.isFinite(Number(coords[0])) &&
        Number.isFinite(Number(coords[1]))

    // Route 1: Passenger pickup → destination.
    // This remains anchored at pickup even after Start Ride.
    useEffect(() => {
        const controller = new AbortController()

        async function loadPassengerRoute() {
            if (
                isCompleted ||
                !validCoordinates(pickupCoordinates) ||
                !validCoordinates(destinationCoordinates)
            ) {
                setPassengerRoute([])
                return
            }

            try {
                const [pickupLat, pickupLon] =
                    pickupCoordinates.map(Number)

                const [destinationLat, destinationLon] =
                    destinationCoordinates.map(Number)

                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${pickupLon},${pickupLat};${destinationLon},${destinationLat}?overview=full&geometries=geojson`,
                    { signal: controller.signal }
                )

                if (!response.ok) {
                    throw new Error("Unable to load passenger route")
                }

                const data = await response.json()

                if (data.routes?.length) {
                    setPassengerRoute(
                        data.routes[0].geometry.coordinates.map(
                            ([longitude, latitude]) => [
                                latitude,
                                longitude,
                            ]
                        )
                    )
                } else {
                    setPassengerRoute([])
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Passenger route error:", error)
                    setPassengerRoute([])
                }
            }
        }

        loadPassengerRoute()

        return () => controller.abort()
    }, [
        pickupCoordinates?.[0],
        pickupCoordinates?.[1],
        destinationCoordinates?.[0],
        destinationCoordinates?.[1],
        isCompleted,
    ])

    // Route 2: Driver's latest GPS position → pickup.
    // Show this blue route while the driver is arriving.
    useEffect(() => {
        const controller = new AbortController()

        async function loadApproachRoute() {
            if (
                !isArriving ||
                isCompleted ||
                !validCoordinates(driverCoordinates) ||
                !validCoordinates(pickupCoordinates)
            ) {
                setApproachRoute([])
                return
            }

            try {
                const [driverLat, driverLon] =
                    driverCoordinates.map(Number)

                const [pickupLat, pickupLon] =
                    pickupCoordinates.map(Number)

                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${driverLon},${driverLat};${pickupLon},${pickupLat}?overview=full&geometries=geojson`,
                    { signal: controller.signal }
                )

                if (!response.ok) {
                    throw new Error("Unable to load driver approach route")
                }

                const data = await response.json()

                if (data.routes?.length) {
                    setApproachRoute(
                        data.routes[0].geometry.coordinates.map(
                            ([longitude, latitude]) => [
                                latitude,
                                longitude,
                            ]
                        )
                    )
                } else {
                    setApproachRoute([])
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Driver approach route error:", error)
                }
            }
        }

        loadApproachRoute()

        return () => controller.abort()
    }, [
        driverCoordinates?.[0],
        driverCoordinates?.[1],
        pickupCoordinates?.[0],
        pickupCoordinates?.[1],
        isArriving,
        isCompleted,
    ])

    const hasDriverLocation =
        !isCompleted && validCoordinates(driverCoordinates)

    const mapCenter = hasDriverLocation
        ? driverCoordinates.map(Number)
        : validCoordinates(pickupCoordinates)
            ? pickupCoordinates.map(Number)
            : [0.5198, 35.2715]

    return (
        <div className="relative h-96 w-full overflow-hidden rounded-xl">
            <MapContainer
                center={mapCenter}
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

                {/* Blue: driver approaching pickup */}
                {!isCompleted &&
                    isArriving &&
                    approachRoute.length > 0 && (
                        <Polyline
                            positions={approachRoute}
                            pathOptions={{
                                color: "blue",
                                weight: 6,
                            }}
                        />
                    )}

                {/* Red: pickup → destination.
                    It starts at pickup after Start Ride. */}
                {!isCompleted &&
                    passengerRoute.length > 0 && (
                        <Polyline
                            positions={passengerRoute}
                            pathOptions={{
                                color: "red",
                                weight: 5,
                            }}
                        />
                    )}

                {/* Real driver GPS marker */}
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

                {/* Passenger pickup */}
                {!isCompleted && validCoordinates(pickupCoordinates) && (
                    <Marker position={pickupCoordinates.map(Number)}>
                        <Tooltip permanent direction="top">
                            👤 {passenger?.name || "Passenger"} - Pickup
                        </Tooltip>
                        <Popup>Passenger pickup location</Popup>
                    </Marker>
                )}

                {/* Destination remains visible after completion */}
                {validCoordinates(destinationCoordinates) && (
                    <Marker position={destinationCoordinates.map(Number)}>
                        <Popup>
                            {isCompleted
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
