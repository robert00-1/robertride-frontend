
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
    const [tripRoute, setTripRoute] = useState([])

    const isCompleted = rideStatus === "completed"

    const isApproaching =
        rideStatus === "accepted" ||
        rideStatus === "arriving"

    const isRideStarted = rideStatus === "started"

    const validCoordinates = (coords) =>
        Array.isArray(coords) &&
        coords.length >= 2 &&
        coords[0] !== null &&
        coords[0] !== undefined &&
        coords[1] !== null &&
        coords[1] !== undefined &&
        Number.isFinite(Number(coords[0])) &&
        Number.isFinite(Number(coords[1])) &&
        Number(coords[0]) >= -90 &&
        Number(coords[0]) <= 90 &&
        Number(coords[1]) >= -180 &&
        Number(coords[1]) <= 180

    const hasDriverLocation =
        !isCompleted && validCoordinates(driverCoordinates)

    // Passenger route: pickup → destination.
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

    // Driver route: latest real GPS position → destination.
    useEffect(() => {
        const controller = new AbortController()

        async function loadTripRoute() {
            if (
                !isRideStarted ||
                isCompleted ||
                !hasDriverLocation ||
                !validCoordinates(destinationCoordinates)
            ) {
                setTripRoute([])
                return
            }

            try {
                const [driverLat, driverLon] =
                    driverCoordinates.map(Number)

                const [destinationLat, destinationLon] =
                    destinationCoordinates.map(Number)

                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${driverLon},${driverLat};${destinationLon},${destinationLat}?overview=full&geometries=geojson`,
                    { signal: controller.signal }
                )

                if (!response.ok) {
                    throw new Error("Unable to load destination route")
                }

                const data = await response.json()

                if (data.routes?.length) {
                    setTripRoute(
                        data.routes[0].geometry.coordinates.map(
                            ([longitude, latitude]) => [
                                latitude,
                                longitude,
                            ]
                        )
                    )
                } else {
                    setTripRoute([])
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Destination route error:", error)
                    setTripRoute([])
                }
            }
        }

        loadTripRoute()

        return () => controller.abort()
    }, [
        driverCoordinates?.[0],
        driverCoordinates?.[1],
        destinationCoordinates?.[0],
        destinationCoordinates?.[1],
        isRideStarted,
        isCompleted,
        hasDriverLocation,
    ])

    // Driver route: latest real GPS position → pickup.
    useEffect(() => {
        const controller = new AbortController()

        async function loadApproachRoute() {
            if (
                !isApproaching ||
                isCompleted ||
                !hasDriverLocation ||
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
                    setApproachRoute([])
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
        isApproaching,
        isCompleted,
        hasDriverLocation,
    ])

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
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {hasDriverLocation && (
                    <FollowDriver coordinates={driverCoordinates.map(Number)} />
                )}

                {/* Blue route: driver → pickup */}
                {!isCompleted &&
                    isApproaching &&
                    approachRoute.length > 0 && (
                        <Polyline
                            positions={approachRoute}
                            pathOptions={{ color: "blue", weight: 6 }}
                        />
                    )}

                {/* Green route: driver → destination */}
                {!isCompleted &&
                    isRideStarted &&
                    tripRoute.length > 0 && (
                        <Polyline
                            positions={tripRoute}
                            pathOptions={{ color: "green", weight: 6 }}
                        />
                    )}

                {/* Red route: pickup → destination */}
                {!isCompleted && passengerRoute.length > 0 && (
                    <Polyline
                        positions={passengerRoute}
                        pathOptions={{ color: "red", weight: 5 }}
                    />
                )}

                {/* Driver marker: actual coordinates only */}
                {hasDriverLocation && (
                    <Marker
                        position={driverCoordinates.map(Number)}
                        icon={liveLocationIcon}
                    >
                        <Tooltip permanent direction="top">
                            🚗 {driver?.name || "Driver"} - Live GPS
                        </Tooltip>

                        <Popup>
                            <strong>{driver?.name || "Driver"}</strong>
                            <br />
                            Latest GPS location received from the driver's device.
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

                {/* Destination */}
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
