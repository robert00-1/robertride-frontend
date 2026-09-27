
import { useEffect, useState } from "react"

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    Tooltip,
} from "react-leaflet"


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


    // Passenger route:
    // Pickup → Destination

    useEffect(() => {

        const getRoute = async () => {

            if (
                !pickupCoordinates ||
                !destinationCoordinates
            ) {
                return
            }

            try {

                const pickupLat = pickupCoordinates[0]
                const pickupLon = pickupCoordinates[1]

                const destinationLat =
                    destinationCoordinates[0]

                const destinationLon =
                    destinationCoordinates[1]


                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${pickupLon},${pickupLat};${destinationLon},${destinationLat}?overview=full&geometries=geojson`
                )

                const data = await response.json()


                if (
                    data.routes &&
                    data.routes.length > 0
                ) {

                    const coordinates =
                        data.routes[0].geometry.coordinates


                    const routeCoordinates =
                        coordinates.map(
                            ([longitude, latitude]) => [
                                latitude,
                                longitude,
                            ]
                        )


                    setRoute(routeCoordinates)
                }

            } catch (error) {

                console.error(
                    "Unable to get passenger route:",
                    error
                )

            }

        }


        getRoute()

    }, [
        pickupCoordinates,
        destinationCoordinates
    ])



    // Driver route:
    // Driver current location → Pickup

    useEffect(() => {

        const getDriverRoute = async () => {

            // Do not show driver route
            // after ride has started.

            if (
                rideStatus === "started" ||
                rideStatus === "completed"
            ) {

                setDriverRoute([])
                return
            }


            if (
                !driverCoordinates ||
                !pickupCoordinates
            ) {

                setDriverRoute([])
                return
            }


            try {

                const driverLat =
                    driverCoordinates[0]

                const driverLon =
                    driverCoordinates[1]


                const pickupLat =
                    pickupCoordinates[0]

                const pickupLon =
                    pickupCoordinates[1]


                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${driverLon},${driverLat};${pickupLon},${pickupLat}?overview=full&geometries=geojson`
                )


                const data = await response.json()


                if (
                    data.routes &&
                    data.routes.length > 0
                ) {

                    const coordinates =
                        data.routes[0].geometry.coordinates


                    const routeCoordinates =
                        coordinates.map(
                            ([longitude, latitude]) => [
                                latitude,
                                longitude,
                            ]
                        )


                    setDriverRoute(routeCoordinates)
                }

            } catch (error) {

                console.error(
                    "Unable to get driver route:",
                    error
                )

            }

        }


        getDriverRoute()

    }, [
        driverCoordinates,
        pickupCoordinates,
        rideStatus
    ])



    return (

        <div className="h-96 w-full overflow-hidden rounded-xl">

            <MapContainer
                center={[0.5198, 35.2715]}
                zoom={13}
                className="h-full w-full"
            >

                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                {/* Driver → Passenger route */}

                {driverRoute.length > 0 && (
                    <Polyline
                        positions={driverRoute}
                        pathOptions={{
                            color: "blue",
                            weight: 6,
                        }}
                    />
                )}


                {/* Passenger → Destination route */}

                {route.length > 0 && (
                    <Polyline
                        positions={route}
                        pathOptions={{
                            color: "red",
                            weight: 5,
                        }}
                    />
                )}


                {/* Driver marker */}

                {driverCoordinates && (
                    <Marker position={driverCoordinates}>
                        <Tooltip permanent direction="top">
                           🚗 {driver?.name  || "Driver"} - Driver
                        </Tooltip>

                        <Popup>
                        <strong>
                            {driver?.name || "Driver"} - Driver
                        </strong>
                        <br />
                            Driver Location
                        </Popup>

                    </Marker>
                )}


                {/* Pickup marker */}

                {pickupCoordinates && (
                    <Marker position={pickupCoordinates}>

                        <Tooltip permanent direction="top">
                          👤 {passenger?.name || "Passenger"} - Passenger
                        </Tooltip>
                        <Popup>
                            <strong>
                                {passenger?.name || "Passenger"} - Passenger
                            </strong>
                            <br />
                             Pickup Location
                        </Popup>

                    </Marker>
                )}


                {/* Destination marker */}

                {destinationCoordinates && (
                    <Marker
                        position={destinationCoordinates}
                    >

                        <Popup>
                            Destination
                        </Popup>

                    </Marker>
                )}

            </MapContainer>

        </div>

    )
}


export default RideMap

