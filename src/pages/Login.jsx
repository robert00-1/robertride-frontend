
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"


function Login() {
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setMessage("")
        setLoading(true)

        try {
            const response = await api.post("/api/auth/login", {
                phone,
                password,
            })

            console.log("Login response:", response.data)

            const token = response.data.access_token

            // Save JWT token
            localStorage.setItem("access_token", token)

            if (response.data.user.role === "driver") {
                navigate("/driver-dashboard")
            } else {
                navigate("/dashboard")
            }

            

        } catch (error) {
            console.error("Login error:", error)

            if (error.response) {
                setMessage(
                    error.response.data.message ||
                    error.response.data.msg ||
                    "Login failed"
                )
            } else {
                setMessage("Unable to connect to the server")
            }

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Logo / Brand */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">
                        RobertRide
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Login to your account
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">

                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Welcome back
                    </h2>

                    {/* Message */}
                    {message && (
                        <div
                            className={`mb-5 rounded-lg px-4 py-3 text-sm ${
                                message === "Login successful!"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                            }`}
                        >
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Phone Number
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="e.g. 0798765432"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                    {/* Register */}
                    <p className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className="font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Create an account
                        </a>
                    </p>

                </div>

            </div>

        </div>
    )
}

export default Login;

