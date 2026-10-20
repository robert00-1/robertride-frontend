
import { useEffect, useState } from "react"

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    Tooltip,
} from "react-leaflet"

import L from "leaflet"
import "leaflet/dist/leaflet.css"


// Pulsing blue marker for live driver location
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


function RideMap({
    pickupCoordinates,
    destinationCoordinates,
    driverCoordinates,
    rideStatus,
    driver,
    passenger,
}) {
    const [route, setRoute] = useState([])
    const [driverRoute, setDriverRoute] = useState([])

    // Test-only driver movement
const [isSimulating, setIsSimulating] = useState(false)
const [simulatedIndex, setSimulatedIndex] = useState(0)

const displayedDriverCoordinates =
    isSimulating && route.length > 0
        ? route[simulatedIndex % route.length]
        : driverCoordinates

    const isRideCompleted = rideStatus === "completed"

    // Passenger route: Pickup → Destination
    useEffect(() => {
        const getRoute = async () => {
            if (
                !pickupCoordinates ||
                !destinationCoordinates ||
                isRideCompleted
            ) {
                setRoute([])
                return
            }

            try {
                const pickupLat = pickupCoordinates[0]
                const pickupLon = pickupCoordinates[1]
                const destinationLat = destinationCoordinates[0]
                const destinationLon = destinationCoordinates[1]

                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${pickupLon},${pickupLat};${destinationLon},${destinationLat}?overview=full&geometries=geojson`
                )

                if (!response.ok) {
                    throw new Error("Unable to load passenger route")
                }

                const data = await response.json()

                if (data.routes?.length > 0) {
                    const routeCoordinates =
                        data.routes[0].geometry.coordinates.map(
                            ([longitude, latitude]) => [
                                latitude,
                                longitude,
                            ]
                        )

                    setRoute(routeCoordinates)
                } else {
                    setRoute([])
                }
            } catch (error) {
                console.error(
                    "Unable to get passenger route:",
                    error
                )
                setRoute([])
            }
        }

        getRoute()
    }, [
        pickupCoordinates,
        destinationCoordinates,
        isRideCompleted,
    ])

    // Driver route: Current location → Pickup
    useEffect(() => {
        const getDriverRoute = async () => {
            if (
                rideStatus === "started" ||
                isRideCompleted ||
                !driverCoordinates ||
                !pickupCoordinates
            ) {
                setDriverRoute([])
                return
            }

            try {
                const [driverLat, driverLon] = driverCoordinates
                const [pickupLat, pickupLon] = pickupCoordinates

                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${driverLon},${driverLat};${pickupLon},${pickupLat}?overview=full&geometries=geojson`
                )

                if (!response.ok) {
                    throw new Error("Unable to load driver route")
                }

                const data = await response.json()

                if (data.routes?.length > 0) {
                    const routeCoordinates =
                        data.routes[0].geometry.coordinates.map(
                            ([longitude, latitude]) => [
                                latitude,
                                longitude,
                            ]
                        )

                    setDriverRoute(routeCoordinates)
                } else {
                    setDriverRoute([])
                }
            } catch (error) {
                console.error(
                    "Unable to get driver route:",
                    error
                )
                setDriverRoute([])
            }
        }

        getDriverRoute()
    }, [
        driverCoordinates,
        pickupCoordinates,
        rideStatus,
        isRideCompleted,
    ])
    // Move the test driver along the route
useEffect(() => {
    if (
        !isSimulating ||
        route.length < 2 ||
        isRideCompleted
    ) {
        return
    }

    const interval = setInterval(() => {
        setSimulatedIndex((previousIndex) =>
            (previousIndex + 1) % route.length
        )
    }, 700)

    return () => clearInterval(interval)
}, [isSimulating, route.length, isRideCompleted])

// Stop simulation when the ride is completed
useEffect(() => {
    if (isRideCompleted) {
        setIsSimulating(false)
    }
}, [isRideCompleted])

    return (
        <div className=" relative h-96 w-full overflow-hidden rounded-xl">
            <MapContainer
                center={[0.5198, 35.2715]}
                zoom={13}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Driver → Pickup route */}
                {!isRideCompleted && driverRoute.length > 0 && (
                    <Polyline
                        positions={driverRoute}
                        pathOptions={{
                            color: "blue",
                            weight: 6,
                        }}
                    />
                )}

                {/* Pickup → Destination route */}
                {!isRideCompleted && route.length > 0 && (
                    <Polyline
                        positions={route}
                        pathOptions={{
                            color: "red",
                            weight: 5,
                        }}
                    />
                )}

                {/* Live driver location */}
                {!isRideCompleted && displayedDriverCoordinates&& (
                    <Marker
                        position={displayedDriverCoordinates}
                        icon={liveLocationIcon}
                    >
                        <Tooltip permanent direction="top">
                            🚗 {driver?.name || "Driver"} - Live location
                        </Tooltip>

                        <Popup>
                            <strong>
                                {driver?.name || "Driver"}
                            </strong>
                            <br />
                            Live driver location
                        </Popup>
                    </Marker>
                )}

                {/* Passenger pickup marker */}
                {!isRideCompleted && pickupCoordinates && (
                    <Marker position={pickupCoordinates}>
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

                {/* Keep destination visible after completion */}
                {destinationCoordinates && (
                    <Marker position={destinationCoordinates}>
                        <Popup>
                            {isRideCompleted
                                ? "Ride completed - Destination"
                                : "Destination"}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            {/* Driver movement test controls */}
<div className="absolute left-3 top-3 z-[1000]">
    <button
        type="button"
        disabled={isRideCompleted || route.length < 2}
        onClick={() => {
            if (isSimulating) {
                setIsSimulating(false)
            } else {
                setSimulatedIndex(0)
                setIsSimulating(true)
            }
        }}
        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-md disabled:cursor-not-allowed disabled:opacity-50"
    >
        {isSimulating
            ? "Stop test movement"
            : "Start test movement"}
    </button>
</div>

            {/* Pulsing marker animation */}
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
