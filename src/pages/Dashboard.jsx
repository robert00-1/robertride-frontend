import {  useEffect, useState } from "react"
import api from "../services/api"
import RideMap from "../components/RideMap"
function Dashboard() {

  const [pickup, setPickup] = useState("")
  const [destination, setDestination] = useState("")
  const [mapPosition, setMapPosition] = useState([
    0.5198,
    35.2715
  ])
  const [pickupCoordinates, setPickupCoordinate] = useState(null)
  const [destinationCoordinates, setDestinationCoordinates] = useState(null)
  const [driverCoordinates, setDriverCoordinates] = useState(null)
  const [fare, setFare] = useState(null)

  const [ride, setRide] = useState(null)

  const [loading, setLoading] = useState(false)

  const [requestingRide, setRequestingRide] = useState(false)

  const [error, setError] = useState("")

  const [success, setSuccess] = useState("")

  const [driver, setDriver] = useState(null)
  const [rideStatus, setRideStatus] = useState("")
  const [paying, setPaying] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState("")
  const [payment, setPayment] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const restoreRide = async () => {
      if (!currentUser?.id) {
        return
      }
      const savedRideId = localStorage.getItem(
        `current_ride_id_${currentUser.id}`
      )
      if (!savedRideId) {
        return
      }
      
const savedPickupCoordinates = localStorage.getItem(
    `current_ride_pickup_${currentUser.id}`
)

const savedDestinationCoordinates = localStorage.getItem(
    `current_ride_destination_${currentUser.id}`
)


if (savedPickupCoordinates) {
    setPickupCoordinate(
        JSON.parse(savedPickupCoordinates)
    )
}

if (savedDestinationCoordinates) {
    setDestinationCoordinates(
        JSON.parse(savedDestinationCoordinates)
    )
}


      try {
        const response = await api.get(
          `/api/rides/${savedRideId}/driver`
        )
        console.log("Restored ride:", response.data)

        setRide(response.data.ride)
        setRideStatus(response.data.ride.status)

        setDriver(response.data.driver)

        localStorage.setItem(
          `current_ride_driver_${currentUser.id}`,
          JSON.stringify(response.data.driver)
        )
        try {
          const paymentResponse = await api.get(
            `/api/payments/ride/${savedRideId}`
          )
          console.log("Restored payment:", paymentResponse.data)

          setPayment(paymentResponse.data.payment)
        } catch (paymentError) {
          if (paymentError.response?.status === 404) {
            console.log("No payment found for this ride yet.")
          } else {
            console.error("Unable to restore payment:", paymentError)
          }
        }
      } catch (error) {
        console.error("Unable to restore ride:", error)
      }
    }
    restoreRide()
  }, [currentUser])
    
  useEffect(() => {
    if (!ride?.id) {
      return

    }

    const getDriverLocation = async () => {

      try {

        const response = await api.get(
          `/api/rides/${ride.id}/tracking`
        )

        console.log(
          "Driver tracking:",
          response.data

        )

      const currentStatus = response.data.ride?.status

      setRideStatus(currentStatus)

      setRide((currentRide) => ({
        ...currentRide,
        status: currentStatus
      }))
      setDriver(response.data.driver)

      if (currentStatus === "completed") {
        
        const destination = response.data.ride?.destination

        console.log(
          "FINAL DESTINATION:",
          destination
        )

        if (
          destination?.latitude != null &&
          destination?.longitude != null
        ) {
          const finalCoordinates = [
            destination.latitude,
            destination.longitude
          ]
          setDriverCoordinates(finalCoordinates)

          localStorage.setItem(
            `current_ride_driver_coordinates_${currentUser.id}`,
            JSON.stringify(
              finalCoordinates
            )
          )
        }
        return
      }

      const coordinates = [
        response.data.driver.latitude,
        response.data.driver.longitude,
      
      ]

      setDriverCoordinates(coordinates)

      

      localStorage.setItem(
        `current_ride_driver_coordinates_${currentUser.id}`,
        JSON.stringify(coordinates)
      )

      localStorage.setItem(
        `current_ride_driver_${currentUser.id}`,
        JSON.stringify(response.data.driver)
      )
      } catch (error) {
        console.error(
          "Unable to get driver location:",
          error.response?.data
        )
        

      }
    }
    getDriverLocation()

    const interval = setInterval(
      getDriverLocation,
      3000
    )
    return () => {
      clearInterval(interval)
    }
  }, [ride,
    currentUser,
    destinationCoordinates
  ])
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await api.get("/api/auth/me")

        console.log("Current user:", response.data)
        setCurrentUser(response.data.user)
      } catch (error) {
        console.error("Unable to get current user:", error)
      }
    }
    getCurrentUser()
  }, [])


  const estimateFare = async () => {

    setError("")
    setSuccess("")
    setRide(null)
    setDriverCoordinates(null)
    setDriver(null)

    if (!pickup || !destination) {
      setError("Please enter your pickup location and destination.")
      return
    }

    try {

      setLoading(true)

      const pickupCoords  = await gecodeLocation(pickup)
      const destinationCoords = await gecodeLocation(destination)

      if (!pickupCoords || !destinationCoords) {
        setError("Unable to find one of the locations.")
        return
      }

      setPickupCoordinate(pickupCoords)
      setDestinationCoordinates(destinationCoords)

      const response = await api.post("/api/rides/estimate", {
        pickup_location: pickup,
        destination: destination,
        pickup_latitude: pickupCoords[0],
        pickup_longitude: pickupCoords[1],
        destination_latitude: destinationCoords[0],
        destination_longitude: destinationCoords[1],

      })

      console.log(response.data)

      setFare(response.data.fare)

    } catch (error) {

      console.error(error)

      setError(
        error.response?.data?.message ||
        "Unable to estimate the fare."
      )

    } finally {

      setLoading(false)

    }
  }
  const gecodeLocation = async (location) => {
    const response = await fetch(
       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    )
    const data = await response.json()

    if (data.length === 0) {
      return null
    }

    return [
      parseFloat(data[0].lat),
      parseFloat(data[0].lon),
    ]
  }
  const handleMapClick = (coordinates) => {
    setMapPosition(coordinates)

    console.log("Selected pickup coordinates:", coordinates)
  }


  const requestRide = async () => {

    setError("")
    setSuccess("")

    try{

      setRequestingRide(true)

      const pickupCoords = await gecodeLocation(pickup)
      const destinationCoords = await gecodeLocation(destination)

      if (!pickupCoords || !destinationCoords) {
        setError("Unable to find one of the locations.")
        return
      }

      setPickupCoordinate(pickupCoords)
      setDestinationCoordinates(destinationCoords)


      const rideResponse = await api.post("/api/rides/", {
        pickup_location: pickup,
        pickup_latitude: pickupCoords[0],
        pickup_longitude: pickupCoords[1],

        destination: destination,
        destination_latitude: destinationCoords[0],
        destination_longitude: destinationCoords[1],
      })

      const createdRide = rideResponse.data.ride

      console.log("Ride created:", createdRide)

      setRide(createdRide)
      setRideStatus(createdRide.status)

      localStorage.setItem(
        `current_ride_id_${currentUser.id}`,
        createdRide.id
      )
      localStorage.setItem(
        `current_ride_pickup_${currentUser.id}`,
        JSON.stringify(pickupCoords)
      )

      localStorage.setItem(
        `current_ride_destination_${currentUser.id}`,
        JSON.stringify(destinationCoords)
      )

      const driversResponse = await api.get(
        "/api/drivers/available"
      )

      const drivers = driversResponse.data.drivers

      console.log("Available drivers:", drivers)

      if (drivers.length === 0) {
        setRide(createdRide)

        setSuccess(
          "Ride created. We are currently looking for an available driver."
        )
        return
      }

      const driver = drivers[0]

      console.log("Selected driver:", driver)

      const requestResponse = await api.post(
        `/api/rides/${createdRide.id}/request`,
        {
          driver_id: driver.driver_id,
        }
      )

      console.log(
        "Ride request:",
        requestResponse.data
      )

      setRide(createdRide)

      setSuccess(
        `Ride request sent to ${driver.name}. Waiting for driver acceptance.`
      )

 
      
    } catch (error) {

      console.error(error)

      setError(
        error.response?.data?.message ||
        "Unable to request the ride."
      )
    } finally {
      setRequestingRide(false)
    }
  }

  const checkRideStatus = async () => {
    setError("")
    setSuccess("")

    if (!ride) {
      setError("You do not have an active  ride.")
      return
    }

    try {
      setLoading(true)

      const response = await api.get(
        `/api/rides/${ride.id}/driver`
      )
      console.log("Driver information:", response.data)
      console.log("Ride status:", response.data.ride)
      

      const currentStatus = response.data.ride.status

      console.log("Pickup coordinates:", pickupCoordinates)
      console.log("Destination coordinates:", destinationCoordinates)
      console.log("Driver coordinates:", driverCoordinates)

      setDriver(response.data.driver)
      setRideStatus(currentStatus)


      setRide((currentRide) => ({
        ...currentRide,
        ...response.data.ride,
      }))

      if (currentStatus === "accepted") {
        setSuccess("Your ride has been accepted by the driver.")
      } else if (currentStatus === "arriving") {
        setSuccess("Your driver is on the way to pick you up.")

      } else if (currentStatus === "started") {
        setSuccess("Your ride has started.") 
      } else if (currentStatus === "completed") {
        setSuccess("Your ride has been completed.")
      } else {
        setSuccess(`Ride status: ${currentStatus}`)
      }
    } catch (error) {
      console.error(
        "Check ride status error:",
        error.response?.data
      )
      

      if (error.response?.status === 404) {
        setRideStatus("requested")
        setError("Your ride is still waiting for a driver to accept it.")
      } else {
        setError(
          error.response?.data?.message ||
          "Unable to check ride status."
        )
      } 
        
      
    } finally {
      setLoading(false)
    }
  }


const handlePayment = async () => {
  setError("")
  setSuccess("")
  setPaymentMessage("")

  if (!ride) {
    setError("No active ride found.")
    return
  }

  try {
    setPaying(true)

    if (!currentUser?.phone) {
      setError("Passenger phone not available.")
      return
    }

    const phone = currentUser.phone.replace(
       /^0/,
       "254"
    )
     
    const response = await api.post(
      "/api/payments/initiate",
      {
        ride_id: ride.id,
        phone: phone
      }
    )

    console.log("Payment response:", response.data)

    setPayment(response.data.payment)

    setPaymentMessage(
      "Payment request sent. Please check your phone and enter your M-pesa PIN"
    )
  } catch (error) {
    console.error(error)

    setPaymentMessage(
      error.response?.data?.message ||
      "Unable to initiate payment."
    )
  } finally {
    setPaying(false)
  }
}
const checkPaymentStatus = async () => {
  if (!payment) {
    setError("No payment found .")
    return
  }

  try {
    setLoading(true)
    setError("")
    setPaymentMessage("Checking payment status...")

    const response = await api.get(
      `/api/payments/${payment.id}`
    )

    console.log("Payment status:", response.data)

    setPayment(response.data.payment)

    if (response.data.payment.status === "paid") {
      setPaymentMessage(
        `Payment successful. M-Pesa receipt: ${response.data.payment.mpesa_receipt}`
      )
      setRide((currentRide) => ({
        ...currentRide,
        payment_status: "paid",
      }))
    } else if (response.data.payment.status === "pending") {
      setPaymentMessage(
        "Payment is still pending. Please  complete the M-Pesa request on your phone."
      )
    } else  {
      setPaymentMessage(
        "Payment was not completed."
      )
    }
  } catch (error) {
    console.error(error)

    setPaymentMessage(
      error.response?.data?.message ||
      "Unable to check payment status."
    )
  } finally {
    setLoading(false)
  }
} 

    


  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}

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


          <div className="flex items-center gap-3">

            <button 
            type="button"
            onClick={checkRideStatus}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
            >
              Check Ride Status
            </button>

            <div className="hidden text-right sm:block">

              <p className="text-sm font-bold text-gray-900">
                {currentUser?.name || "Passenger"}
              </p>

              <p className="text-xs text-gray-500">
                Passenger
              </p>

            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
              RM
            </div>

          </div>

        </div>

      </nav>


      {/* MAIN */}

      <main className="mx-auto max-w-5xl px-6 py-12">

        {/* WELCOME */}

        <div className="text-center">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            RobertRide
          </p>

          <h1 className="mt-3 text-4xl font-black text-gray-900 sm:text-5xl">
            Welcome to RobertRide
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg leading-7 text-gray-500">
            Get where you need to go safely, quickly and conveniently.
          </p>

        </div>


        {/* REQUEST RIDE */}

        <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl sm:p-10">

          <div className="text-center">

            <h2 className="text-2xl font-black text-gray-900">
              Request a ride
            </h2>

            <p className="mt-2 text-gray-500">
              Enter your pickup location and destination.
            </p>

          </div>
          {/* MAP */}
          <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl sm:p-10">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-black text-gray-900">
                Ride Map
              </h2>
              <p className="mt-2 text-gray-500">
                View your ride location on the map
              </p>
            </div>
            <RideMap
             pickupCoordinates={pickupCoordinates}
             destinationCoordinates={destinationCoordinates}
             driverCoordinates={driverCoordinates}
             rideStatus={ride?.status}
             driver={driver}
             passenger={currentUser}
             
            
            />
          </div>


          <div className="mx-auto mt-8 max-w-2xl">

            {/* ERROR */}

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}


            {/* SUCCESS */}

            {success && (
              <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-600">
                {success}
              </div>
            )}


            {/* PICKUP */}

            <div>

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Pickup location
              </label>

              <input
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                placeholder="Enter your pickup location"
                className="w-full rounded-xl border border-gray-300 px-4 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />

            </div>


            {/* DESTINATION */}

            <div className="mt-5">

              <label className="mb-2 block text-sm font-bold text-gray-700">
                Destination
              </label>

              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where are you going?"
                className="w-full rounded-xl border border-gray-300 px-4 py-4 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              />

            </div>


            {/* ESTIMATE BUTTON */}

            <button
              type="button"
              onClick={estimateFare}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? "Calculating fare..." : "Estimate Fare"}

            </button>


            {/* FARE */}

            {fare !== null && (

              <div className="mt-6 rounded-2xl bg-blue-50 p-6 text-center">

                <p className="text-sm font-semibold text-gray-600">
                  Estimated fare
                </p>

                <p className="mt-2 text-4xl font-black text-blue-600">
                  KSh {fare}
                </p>

                <button
                  type="button"
                  onClick={requestRide}
                  disabled={requestingRide}
                  className="mt-5 w-full rounded-xl bg-gray-900 px-6 py-4 font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {requestingRide
                    ? "Requesting ride..."
                    : "Request This Ride"
                  }

                </button>

              </div>

            )}


            {/* CREATED RIDE */}

            {ride && (

              <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6">

                <div className="text-center">

                  <p className="text-sm font-bold uppercase tracking-wider text-green-600">
                    Ride requested
                  </p>

                  <h3 className="mt-2 text-2xl font-black text-gray-900">
                    Searching for a driver
                  </h3>
                {rideStatus === "completed"&& ride.payment_status !== "paid" && (
                  <div className="mt-6 border-t border-green-200 pt-6">

                    <p className="mb-4 text-center font-semibold text-gray-700">
                      Your ride is complete. Please pay for your ride.
                    </p>

                    <button
                    type="button"
                    onClick={handlePayment}
                    disabled={paying}
                    className="w-full rounded-xl bg-green-600 px-6 py-4 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {paying ? "Sending Payment Request..." : "Pay Now"}
                    </button>
                  </div>
                
                )}
                {payment &&  payment.status !== "paid" && (
                  <button
                  type="button"
                  onClick={checkPaymentStatus}
                  disabled={loading}
                  className="mt-4 w-full rounded-xl bg-blue-600 px-6 py-4 font-bold  text-white hover:bg-blue-700 disable:cursor-not-allowed disabled:opacity-60 "

                  >
                    {loading ?  "Checking Payment..." : "Check Payment Status"}
                  </button>
                )}
                {paymentMessage && (
                  <div className="mt-4 rounded-xl border border-green-200 bg-white p-4  text-center">
                    <p className="font-semibold text-gray-700">
                      {paymentMessage}
                    </p>
                  </div>
                )}
                {payment && payment.status === "paid" && (
                  <div className="mt-6 rounded-2xl border border-green-300 bg-green-50 p-5">

                    <div className="text-center">
                      <p className="text-sm font-bold uppercase tracking-wider text-green-600">
                        Payment Successful
                      </p>
                      <h3 className="mt-2 text-2xl font-black text-gray-900">
                        Payment Complete ✓
                      </h3>
                    </div>
                    <div className="mt-5 space-y-3">
                      <div className="flex justify-between border-b border-green-200 pb-3">
                        <span className="font-semibold text-gray-600">
                          Amount
                        </span>
                        <span className="font-bold text-gray-900">
                          KSh {payment.amount}
                        </span>
                      </div>

                      <div className="flex justify-between border-b border-green-200 pb-3">
                        <span className="font-semibold text-gray-600">
                          M-Pesa Receipt
                        </span>
                        <span className="font-bold text-gray-900">
                          {payment.mpesa_receipt}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">
                          Status
                        </span>
                        <span className="font-bold text-green-600">
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                </div>

                {/* DRIVER DETAILS */}
                {driver && rideStatus === "accepted" && (
                  <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-6">

                    <div className="text-center">
                      <p className="text-sm font-bold uppercase tracking-winder text-blue-600">
                        Driver assigned
                      </p>
                      <h3 className="mt-2 text-2xl font-black text-gray-900">
                        Your driver is on the way
                      </h3>

                      <div className="mt-6 space-y-4">
                        <div className="flex justify-between border-b border-blue-200 pb-3">
                          <span className="font-semibold text-gray-600">
                            Driver
                          </span>

                          <span className="font-bold text-gray-900">
                            {driver.name}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-b border-blue-200 pb-3">
                          <span className="font-semibold text-gray-600">
                            Phone
                          </span>

                          <span className="font-bold text-gray-900">
                            {driver.phone}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-blue-200 pb-3">
                          <span className="font-seibold text-gray-600">
                            Vehicle
                          </span>

                          <span className="font-bold text-gray-900">
                            {driver.vehicle.make} {driver.vehicle.model}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-blue-200 pb-3">
                          <span className="font-semibold text-gray-600">
                            Plate number
                          </span>

                          <span className="font-bold text-gray-900">
                            {driver.vehicle.plate_number}
                          </span>
                        </div>

                        <div className="flex justify-between border-b border-blue-200 pb-3">
                          <span className="font-semibold text-gray-600">
                            Vehicle color
                          </span>

                          <span className="font-bold text-gray-900">
                            {driver.vehicle.color}
                          </span>
                        </div>
                        
                      </div>

                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">
                          Driver status
                        </span>
                        <span className="font-bold capitalize text-green-600">
                          {driver.status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}


                <div className="mt-6 space-y-4">

                  <div className="flex justify-between border-b border-green-200 pb-3">
                    <span className="font-semibold text-gray-600">
                      Pickup
                    </span>

                    <span className="font-bold text-gray-900">
                      {ride.pickup_location}
                    </span>
                  </div>


                  <div className="flex justify-between border-b border-green-200 pb-3">
                    <span className="font-semibold text-gray-600">
                      Destination
                    </span>

                    <span className="font-bold text-gray-900">
                      {ride.destination}
                    </span>
                  </div>


                  <div className="flex justify-between border-b border-green-200 pb-3">
                    <span className="font-semibold text-gray-600">
                      Distance
                    </span>

                    <span className="font-bold text-gray-900">
                      {ride.distance_km} km
                    </span>
                  </div>


                  <div className="flex justify-between border-b border-green-200 pb-3">
                    <span className="font-semibold text-gray-600">
                      Fare
                    </span>

                    <span className="font-bold text-blue-600">
                      KSh {ride.fare}
                    </span>
                  </div>


                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-600">
                      Status
                    </span>

                    <span className="font-bold capitalize text-orange-600">
                      {ride.status}
                    </span>
                  </div>

                </div>

              </div>

            )}

          </div>

        </div>


        {/* INFORMATION */}

        <div className="mt-8 grid gap-5 sm:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">

            <div className="text-3xl">
              🚗
            </div>

            <h3 className="mt-3 font-bold text-gray-900">
              Reliable rides
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Request a ride whenever you need one.
            </p>

          </div>


          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">

            <div className="text-3xl">
              📍
            </div>

            <h3 className="mt-3 font-bold text-gray-900">
              Track your driver
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Follow your driver as they approach.
            </p>

          </div>


          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">

            <div className="text-3xl">
              💳
            </div>

            <h3 className="mt-3 font-bold text-gray-900">
              Easy payment
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Pay conveniently with M-PESA.
            </p>

          </div>

        </div>

      </main>

    </div>
  )
}

export default Dashboard