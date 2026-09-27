
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
         make: "",
         model: "",
         color: "",
         plate_number: "",
    })

    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)


    const handleChange = (e) => {

        const { name, value } = e.target

        setFormData((current) => ({
            ...current,
            [name]: value,
        }))
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


                        {/* Vehicle section */}

                        <div className="border-t pt-5">

                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Vehicle Information
                            </h3>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <input
                                    type="text"
                                    name="make"
                                    value={formData.vehicle_make}
                                    onChange={handleChange}
                                    placeholder="Vehicle make"
                                    required
                                    className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                />


                                <input
                                    type="text"
                                    name="model"
                                    value={formData.vehicle_model}
                                    onChange={handleChange}
                                    placeholder="Vehicle model"
                                    required
                                    className="rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                />


                                <input
                                    type="text"
                                    name="color"
                                    value={formData.vehicle_color}
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

