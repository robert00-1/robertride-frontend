import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api"

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    // Check password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Basic password validation
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    try {
      setLoading(true)

      const response = await api.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      })

      console.log("Registration response:", response.data)

      setSuccess("Account created successfully!")

      // Give the user a moment to see the success message
      setTimeout(() => {
        navigate("/login")
      }, 1200)

    } catch (err) {
      console.error("Registration error:", err)

      if (err.response) {
        setError(
          err.response.data?.message ||
          "Registration failed. Please check your details."
        )
      } else {
        setError(
          "Unable to connect to the server. Make sure Flask is running."
        )
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* ================= LEFT SIDE ================= */}

        <div className="relative hidden overflow-hidden lg:block">

          {/* Background image */}

          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/robertride-hero.png')",
            }}
          />

          {/* Overlay */}

          <div className="absolute inset-0 bg-black/60" />

          {/* Content */}

          <div className="relative z-10 flex min-h-screen flex-col justify-between p-12">

            {/* Logo */}

            <Link
              to="/"
              className="flex items-center gap-3"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl font-black text-white shadow-lg">
                R
              </div>

              <span className="text-2xl font-black text-white">
                Robert<span className="text-blue-400">Ride</span>
              </span>

            </Link>

            {/* Text */}

            <div className="max-w-lg">

              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                Welcome to RobertRide
              </p>

              <h1 className="text-5xl font-black leading-tight text-white">
                Your journey
                <br />
                starts here.
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-200">
                Create your RobertRide account and enjoy
                safe, convenient rides around Nairobi.
              </p>

            </div>

            {/* Bottom */}

            <p className="text-sm text-gray-300">
              © 2026 RobertRide
            </p>

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="flex items-center justify-center bg-white px-6 py-12">

          <div className="w-full max-w-md">

            {/* Mobile logo */}

            <div className="mb-10 lg:hidden">

              <Link
                to="/"
                className="flex items-center gap-3"
              >

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white">
                  R
                </div>

                <span className="text-2xl font-black text-gray-900">
                  Robert<span className="text-blue-600">Ride</span>
                </span>

              </Link>

            </div>

            {/* Heading */}

            <div className="mb-8">

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Get started
              </p>

              <h2 className="mt-3 text-4xl font-black tracking-tight text-gray-900">
                Create your account
              </h2>

              <p className="mt-3 text-gray-500">
                Join RobertRide and start moving around Nairobi.
              </p>

            </div>

            {/* Error */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* Success */}

            {success && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {success}
              </div>
            )}

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Name */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

              </div>
              <div>
                <label>Email</label>
                <input type="text" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                 className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* Phone */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0712345678"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

              </div>

              {/* Password */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

              </div>

              {/* Confirm Password */}

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full rounded-xl border border-gray-300 px-4 py-3.5 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />

              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? "Creating account..." : "Create Account"}

              </button>

            </form>

            {/* Login */}

            <div className="mt-8 text-center text-sm text-gray-500">

              Already have an account?

              <Link
                to="/login"
                className="ml-2 font-bold text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>

            </div>

            {/* Back */}

            <div className="mt-5 text-center">

              <Link
                to="/"
                className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
              >
                ← Back to RobertRide
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Register