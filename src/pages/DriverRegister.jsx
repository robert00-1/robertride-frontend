
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../services/api"


function DriverRegister() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        license_number: "",
        stage_name: "",
        stage_latitude: "",
        stage_longitude: "",
         make: "",
         model: "",
         color: "",
         plate_number: "",

    })

    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [locationLoading, setLocationLoading] = useState(false)


    const handleChange = (e) => {

        const { name, value } = e.target

        setFormData((current) => ({
            ...current,
            [name]: value,
        }))
    }
    const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
        setMessage("Geolocation is not supported by this browser.")
        return
    }

    setLocationLoading(true)
    setMessage("")

    navigator.geolocation.getCurrentPosition(
        (position) => {
            setFormData((current) => ({
                ...current,
                stage_latitude: String(position.coords.latitude),
                stage_longitude: String(position.coords.longitude),
            }))

            setLocationLoading(false)
            setMessage("Location captured successfully.")
        },
        (error) => {
            console.error("Location error:", error)

            setMessage(
                error.code === 1
                    ? "Location permission denied. Allow location access in your browser."
                    : "Unable to get your location. Check GPS and try again."
            )

            setLocationLoading(false)
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0,
        }
    )
}


    const handleSubmit = async (e) => {

        e.preventDefault()

        setMessage("")
        setLoading(true)

        try {

            const response = await api.post(
                "/api/drivers/register",
                formData
            )

            console.log(
                "Driver registration:",
                response.data
            )

            setMessage(
                "Driver registration successful. You can now login."
            )

            setTimeout(() => {
                navigate("/login")
            }, 1500)

        } catch (error) {

            console.error(
                "Driver registration error:",
                error
            )

            setMessage(
                error.response?.data?.message ||
                "Driver registration failed."
            )

        } finally {

            setLoading(false)

        }
    }


    return (

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-2xl">

                {/* Brand */}

                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold text-blue-600">
                        RobertRide
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Become a RobertRide driver
                    </p>

                </div>


                {/* Registration Card */}

                <div className="bg-white rounded-2xl shadow-lg p-8">

                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Driver Registration
                    </h2>


                    {message && (

                        <div className="mb-5 rounded-lg px-4 py-3 bg-blue-100 text-blue-700">
                            {message}
                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* Name */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            />

                        </div>


                        {/* Email */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            />

                        </div>


                        {/* Phone */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="e.g. 0712345678"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            />

                        </div>


                        {/* Password */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            />

                        </div>


                        {/* License */}

                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Driving License Number
                            </label>

                            <input
                                type="text"
                                name="license_number"
                                value={formData.license_number}
                                onChange={handleChange}
                                placeholder="Enter license number"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            />

                        </div>

{/* Operating Location */}

<div className="border-t pt-5">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Operating Location
    </h3>

    <label className="block text-sm font-medium text-gray-700 mb-2">
        City or operating area
    </label>

    <select
        name="stage_name"
        value={formData.stage_name}
        onChange={handleChange}
        required
        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
    >
        <option value="">Select your operating city</option>
        <option value="Nairobi">Nairobi</option>
        <option value="Eldoret">Eldoret</option>
        <option value="Mombasa">Mombasa</option>
        <option value="Kisumu">Kisumu</option>
        <option value="Nakuru">Nakuru</option>
        <option value="Other">Other</option>
    </select>

    <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={locationLoading}
        className="mt-3 w-full rounded-lg border border-blue-600 py-3 font-semibold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
    >
        {locationLoading
            ? "Getting your location..."
            : "Use My Current Location"}
    </button>

    {formData.stage_latitude !== "" &&
        formData.stage_longitude !== "" && (
            <p className="mt-2 text-sm text-green-700">
                GPS coordinates captured:{" "}
                {Number(formData.stage_latitude).toFixed(5)},{" "}
                {Number(formData.stage_longitude).toFixed(5)}
            </p>
        )}

    <p className="mt-2 text-sm text-gray-500">
        Select the city where you intend to operate. Capture your
        location while you are physically in that area.
    </p>
</div>



                        {/* Vehicle section */}

                        <div className="border-t pt-5">

                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Vehicle Information
                            </h3>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <input
                                    type="text"
                                    name="make"
                                    value={formData.make}
                                    onChange={handleChange}
                                    placeholder="Vehicle make"
                                    required
                                    className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                />


                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    placeholder="Vehicle model"
                                    required
                                    className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                />


                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    placeholder="Vehicle color"
                                    required
                                    className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                />


                                <input
                                    type="text"
                                    name="plate_number"
                                    value={formData.plate_number}
                                    onChange={handleChange}
                                    placeholder="Number plate"
                                    required
                                    className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                />

                            </div>

                        </div>


                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-blue-400"
                        >

                            {loading
                                ? "Registering..."
                                : "Register as Driver"
                            }

                        </button>

                    </form>


                    <p className="text-center text-sm text-gray-500 mt-6">

                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="font-semibold text-blue-600"
                        >
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>

    )
}


export default DriverRegister

