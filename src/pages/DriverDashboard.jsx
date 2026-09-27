import { useEffect, useState } from "react"
import api from "../services/api"

function DriverDashboard() {

  const [requests, setRequests] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [acceptingRide, setAcceptingRide] = useState(false)
  const [ activeRide, setActiveRide] = useState(null)
  const [updatingRide, setUpdatingRide] = useState(false)
  const [newRideNotification, setNewRideNotification] = useState(null)

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/api/auth/me")

      console.log("Current driver:", response.data)

      setCurrentUser(response.data.user)
    } catch (error) {
      console.error("Unable to get current driver:", error)
    }
  }
  const getActiveRide = async () => {

    try {

      const response = await api.get(
        "/api/drivers/active-ride"
      )

      console.log(
        "Active ride:",
        response.data
      )

      setActiveRide(
        response.data.ride
      )

    } catch (error) {
      if (error.response?.status === 404) {

        setActiveRide(null)
      } else {
        console.error(
          "Unable to restore active ride:",
          error
        )
      }
    }
  }
  const updateDriverLocation = () => {

    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.")
      return
    }

    navigator.geolocation.watchPosition(
      async (position) => {

        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        console.log(
          "Driver location:",
          latitude,
          longitude
        )

        try {
          const response = await api.patch(
            "/api/drivers/location",
            {
              latitude: latitude,
              longitude: longitude,
            }
          )

          console.log(
            "Location sent to backend:",
            response.data
          )
        } catch (error) {

          console.error(
            "Unable to update driver location:",
            error.response?.data
          )
        }

      
      },

      (error) => {

        console.error(
          "Unable to get driver location:",
          error
        )
      },

      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 30000,
      }
    )
  }
  useEffect(() => {

    updateDriverLocation()

    getActiveRide()
  }, [])

  const getRideRequests = async () => {

    try {

      setLoading(true)
      setError("")

      const response = await api.get(
        "/api/drivers/ride-requests"
      )

      console.log("Ride requests:", response.data)

      const newRequests = response.data.requests

      if (
        newRequests.length > requests.length &&
        newRequests.length > 0
      ) {
        setNewRideNotification(newRequests[0])
      }

      setRequests(newRequests)

      

    } catch (error) {

      console.error(error)

      setError(
        error.response?.data?.message ||
        "Unable to load ride requests."
      )

    } finally {

      setLoading(false)

    }
  }

  useEffect(() => {
    getCurrentUser()
    getRideRequests()

    const interval = setInterval(() => {
      getRideRequests()
    }, 5000)

    return () => {
      clearInterval(interval)
    }

  }, [])

  const acceptRide = async (requestId) => {

    try {

        setAcceptingRide(true)
        setError("")

        const response = await api.patch(
            `/api/drivers/ride-requests/${requestId}/accept`
        )

        console.log("Ride accepted:", response.data)

        setActiveRide(response.data.ride)

        localStorage.setItem(
          "driver_active_ride_id",
          response.data.ride.id
        )


        setRequests((currentRequests) => 
            currentRequests.filter(
                (request) => request.request_id != requestId
            )
        
        )
    } catch (error) {
        console.error(error)

        setError(
            error.response?.data?.message ||
            "Unable to accept the ride."
        )
    } finally {
        setAcceptingRide(false)
    }
  }
const updateRideStatus = async (rideId, status) => {

  try {
    setUpdatingRide(true)
    setError("")

    const response = await api.patch(
      `/api/drivers/rides/${rideId}/status`,
      {
        status: status
      }
    )

    console.log("Ride status updated:", response.data)

    setActiveRide((currentRide) => ({
      ...currentRide,
      ...response.data.ride,
    }))
  } catch (error) {
    console.error(error)

    setError(
      error.response?.data?.message ||
      "Unable to update ride status."
    )
  } finally {
    setUpdatingRide(false)
  }
}


  return (
    <div className="min-h-screen bg-gray-100">

      {newRideNotification && (
        <div className="mx-auto max-w-5xl px-6 pt-6">

          <div className="rounded-xl bg-blue-600 p-4 text-white shadow-lg">

            <div className="flex items-start justify-between">
              <div>

                <h3 className="text-lg font-bold">
                  🔔 New Ride Request
                </h3>
                <p className="mt-2">
                  Pickup: {newRideNotification.pickup_location}
                </p>
                <p>
                  Destination: {newRideNotification.destination}
                </p>
                <p>
                  Fare: KSH {newRideNotification.fare}
                </p>
              </div>

              <button
              type="button"
              onClick={() => setNewRideNotification(null)}
              className="ml-4 text-2xl font-bold text-white"
              >
                x
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="border-b bg-white">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white">
              R
            </div>

            <span className="text-2xl font-black text-gray-900">
              Robert<span className="text-blue-600">Ride</span>
            </span>

          </div>

          <div className="text-right">

            <p className="text-sm font-bold text-gray-900">
              {currentUser?.name || "Driver"}
            </p>

            <p className="text-xs text-gray-500">
              Driver
            </p>

          </div>

        </div>

      </nav>


      <main className="mx-auto max-w-5xl px-6 py-12">

        <div className="text-center">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Driver Dashboard
          </p>

          <h1 className="mt-3 text-4xl font-black text-gray-900">
            Ride Requests
          </h1>

          <p className="mt-3 text-gray-500">
            View ride requests from passengers.
          </p>

        </div>


        {error && (
          <div className="mx-auto mt-8 max-w-2xl rounded-xl bg-red-50 px-5 py-4 font-semibold text-red-600">
            {error}
          </div>
        )}


        {loading && (
          <div className="mt-10 text-center font-semibold text-gray-500">
            Loading ride requests...
          </div>
        )}


        {!loading && requests.length === 0 && !error && (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-white p-8 text-center shadow">

            <div className="text-4xl">
              🚗
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              No ride requests
            </h2>

            <p className="mt-2 text-gray-500">
              New passenger requests will appear here.
            </p>

          </div>
        )}
        {/* ACTIVE RIDE */}

        {activeRide && (

          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow">
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Active Ride
              </p>
              <h2 className="mt-2 text-2xl font-black text-gray-900">
                Ride #{activeRide.id}
              </h2>
            </div>
            
            <div className="mt-6 space-y-4">
              <div className="flex justify-between bordr-b border-blue-200 pb-3">
                <span className="font-semibold text-gray-600">
                  Pickup
                </span>

                <span className="font-bold text-gray-900">
                  {activeRide.pickup_location}
                </span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-3">
                <span className="font-semibold text-gray-600">
                  Destination
                </span>

                <span className="font-bold text-gray-900">
                  {activeRide.destination}
                </span>
              </div>
              <div className="flex justify-between border-b border-blue-200 pb-3">

                <span className="font-semibold text-gray-600">
                  Fare
                </span>
                <span className="font-bold text-blue-600">
                  KSh {activeRide.fare}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-gray-600">
                  Status
                </span>
                <span className="font-bold capitalize text-blue-600">
                  {activeRide.status}
                </span>
              </div>
              {activeRide.status === "accepted" && (
                <button 
                type="button"
                onClick={() => updateRideStatus(activeRide.id, "arriving")}
                disabled={updatingRide}
                className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700 disable:cusor-not-allowed disable:opacity-60"
                
               > 
               {updatingRide ?  "Updating..." : "Driver is Arriving"}
               </button>
              )}

              {activeRide.status === "arriving" && (
                <button
                type="button"
                onClick={() => updateRideStatus(activeRide.id, "started")}
                disabled={updatingRide}
                className="mt-6 w-full rounded-xl bg-green-600 px-6 py-4 font-bold text-white transition hover:bg-green-700 disable:cusor-not-allowed disable:opacity-60 " 
                
                >
                  {updatingRide ? "Updating..." : "Start Ride"}
                </button>
              )}
              {activeRide.status === "started" && (
                <button 
                type="button"
                onClick={() => updateRideStatus(activeRide.id, "completed")}
                disabled={updatingRide}
                className="mt-6 w-full rounded-xl bg-purple-600 px-6 py-4 font-bold text-white transition hover:bg-purple-700 disable:cursor-not-allowed disable:opacity "
                >
                  {updatingRide ? "Updating..." : "Complete Ride"}
                </button>
              )}
            </div>
          </div>
        )}


        {!loading && requests.length > 0 && (

          <div className="mt-10 space-y-5">

            {requests.map((request) => (

              <div
                key={request.request_id}
                className="rounded-2xl bg-white p-6 shadow"
              >

                <div className="flex items-center justify-between">

                  <h2 className="text-xl font-black text-gray-900">
                    Ride #{request.ride_id}
                  </h2>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                    {request.request_status}
                  </span>

                </div>


                <div className="mt-6 space-y-4">

                  <div className="flex justify-between border-b pb-3">

                    <span className="font-semibold text-gray-500">
                      Pickup
                    </span>

                    <span className="font-bold text-gray-900">
                      {request.pickup_location}
                    </span>

                  </div>


                  <div className="flex justify-between border-b pb-3">

                    <span className="font-semibold text-gray-500">
                      Destination
                    </span>

                    <span className="font-bold text-gray-900">
                      {request.destination}
                    </span>

                  </div>


                  <div className="flex justify-between border-b pb-3">

                    <span className="font-semibold text-gray-500">
                      Distance
                    </span>

                    <span className="font-bold text-gray-900">
                      {request.distance_km} km
                    </span>

                  </div>


                  <div className="flex justify-between">

                    <span className="font-semibold text-gray-500">
                      Fare
                    </span>

                    <span className="font-bold text-blue-600">
                      KSh {request.fare}
                    </span>

                  </div>

                  <button 
                  type="button"
                  onClick={() => acceptRide(request.request_id)}
                  disabled={acceptingRide}
                  className="mt-6 w-full rounded-xl bg-green-600 px-6 py-4 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {acceptingRide
                    ? "Accepting ride..."
                    : "Accept Ride"
                    
                    }
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  )
}

export default DriverDashboard