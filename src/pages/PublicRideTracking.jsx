
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../services/api"
import RideMap from "../components/RideMap"

function PublicRideTracking() {
    const { token } = useParams()

    const [tracking, setTracking] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        let intervalId

        const fetchTracking = async () => {
            try {
                const response = await api.get(
                    `/api/rides/shared/${encodeURIComponent(token)}`
                )

                if (cancelled) return

                setTracking(response.data)
                setError("")

                if (response.data.ride?.status === "completed") {
                    clearInterval(intervalId)
                }
            } catch (err) {
                if (cancelled) return

                setError(
                    err.response?.data?.message ||
                    "Unable to load live ride tracking."
                )
                clearInterval(intervalId)
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchTracking()
        intervalId = setInterval(fetchTracking, 3000)

        return () => {
            cancelled = true
            clearInterval(intervalId)
        }
    }, [token])

    const ride = tracking?.ride
    const driver = tracking?.driver

    const pickupCoordinates =
        ride?.pickup?.latitude != null &&
        ride?.pickup?.longitude != null
            ? [
                Number(ride.pickup.latitude),
                Number(ride.pickup.longitude),
            ]
            : null

    const destinationCoordinates =
        ride?.destination?.latitude != null &&
        ride?.destination?.longitude != null
            ? [
                Number(ride.destination.latitude),
                Number(ride.destination.longitude),
            ]
            : null

    const driverCoordinates =
        driver?.location_available &&
        driver.latitude != null &&
        driver.longitude != null
            ? [Number(driver.latitude), Number(driver.longitude)]
            : null

    if (loading && !tracking) {
        return (
            <main className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
                    <p className="text-center text-gray-700">
                        Loading live ride tracking...
                    </p>
                </div>
            </main>
        )
    }

    if (error && !tracking) {
        return (
            <main className="min-h-screen bg-gray-50 p-6">
                <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Ride tracking unavailable
                    </h1>
                    <p className="mt-3 text-red-600">{error}</p>
                    <p className="mt-4 text-sm text-gray-500">
                        The link may be invalid or expired.
                    </p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <header className="rounded-2xl bg-white p-6 shadow">
                    <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                        RobertRide
                    </p>
                    <h1 className="mt-2 text-3xl font-black text-gray-900">
                        Live ride tracking
                    </h1>
                    <p className="mt-2 text-gray-600">
                        This page refreshes the driver's location automatically.
                    </p>
                </header>

                {error && (
                    <div className="rounded-xl bg-red-50 p-4 text-red-700">
                        {error}
                    </div>
                )}

                {ride && (
                    <>
                        <section className="rounded-2xl bg-white p-6 shadow">
                            <p className="text-sm text-gray-500">Ride status</p>
                            <p className="mt-1 text-2xl font-bold capitalize text-gray-900">
                                {ride.status}
                            </p>

                            {ride.status === "completed" && (
                                <p className="mt-3 font-medium text-green-700">
                                    This trip has ended.
                                </p>
                            )}

                            <div className="mt-5 space-y-3">
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">
                                        Pickup
                                    </p>
                                    <p className="text-gray-900">
                                        {ride.pickup?.location || "Not available"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">
                                        Destination
                                    </p>
                                    <p className="text-gray-900">
                                        {ride.destination?.location || "Not available"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">
                                        Driver location
                                    </p>
                                    <p className="text-gray-900">
                                        {ride.status === "completed"
                                            ? "Trip ended"
                                            : driverCoordinates
                                                ? "Location available"
                                                : "Waiting for driver GPS location"}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-2xl bg-white p-3 shadow">
                            <div className="h-[420px] overflow-hidden rounded-xl">
                                <RideMap
                                    pickupCoordinates={pickupCoordinates}
                                    destinationCoordinates={destinationCoordinates}
                                    driverCoordinates={
                                        ride.status === "completed"
                                            ? null
                                            : driverCoordinates
                                    }
                                    rideStatus={ride.status}
                                    driver={driver}
                                />
                            </div>
                        </section>
                    </>
                )}
            </div>
        </main>
    )
}

export default PublicRideTracking
