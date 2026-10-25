import { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

function AdminDashboard() {
    const navigate = useNavigate()

    const [drivers, setDrivers] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [actionMessage, setActionMessage] = useState("")
    const [busyDriver, setBusyDriver] = useState(null)

    const fetchDrivers = useCallback(async () => {
        setLoading(true)
        setError("")

        try {
            const response = await api.get("/api/admin/drivers")
            setDrivers(response.data.drivers || [])
        } catch (err) {
            console.error("Failed to load drivers:", err)

            if (err.response?.status === 401) {
                setError("Your session may have expired. Please log in again.")
            } else if (err.response?.status === 403) {
                setError("Admin access required. Please log in with an admin account.")
            } else {
                setError(
                    err.response?.data?.message ||
                    "Unable to load drivers. Check your backend connection."
                )
            }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDrivers()
    }, [fetchDrivers])

    const handleBlockToggle = async (driver) => {
        const action = driver.is_blocked ? "unblock" : "block"

        const confirmed = window.confirm(
            `Are you sure you want to ${action} ${driver.name}?`
        )

        if (!confirmed) return

        setBusyDriver(driver.driver_id)
        setActionMessage("")
        setError("")

        try {
            const response = await api.patch(
                `/api/admin/drivers/${driver.driver_id}/${action}`
            )

            setActionMessage(response.data.message)
            await fetchDrivers()
        } catch (err) {
            console.error("Failed to update driver:", err)

            setError(
                err.response?.data?.message ||
                `Unable to ${action} this driver.`
            )
        } finally {
            setBusyDriver(null)
        }
    }

    const filteredDrivers = useMemo(() => {
        const term = search.trim().toLowerCase()

        if (!term) return drivers

        return drivers.filter((driver) =>
            [
                driver.name,
                driver.phone,
                driver.email,
                driver.license_number,
                driver.vehicle?.plate_number,
                driver.vehicle?.make,
                driver.vehicle?.model,
            ].some((value) =>
                String(value || "").toLowerCase().includes(term)
            )
        )
    }, [drivers, search])

    const onlineCount = drivers.filter(
        (driver) => driver.status === "online" && !driver.is_blocked
    ).length

    const blockedCount = drivers.filter(
        (driver) => driver.is_blocked
    ).length

    const logout = () => {
        localStorage.removeItem("access_token")
        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-blue-700 text-white shadow">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
                    <div>
                        <h1 className="text-2xl font-bold">
                            RobertRide Admin
                        </h1>
                        <p className="mt-1 text-sm text-blue-100">
                            Driver management dashboard
                        </p>
                    </div>

                    <button
                        onClick={logout}
                        className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-700 hover:bg-blue-50"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Drivers
                    </h2>
                    <p className="mt-1 text-gray-500">
                        View driver details and manage account access.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Total drivers
                        </p>
                        <p className="mt-2 text-3xl font-bold text-gray-800">
                            {drivers.length}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Online and unblocked
                        </p>
                        <p className="mt-2 text-3xl font-bold text-green-600">
                            {onlineCount}
                        </p>
                    </div>

                    <div className="rounded-xl bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            Blocked drivers
                        </p>
                        <p className="mt-2 text-3xl font-bold text-red-600">
                            {blockedCount}
                        </p>
                    </div>
                </div>

                {actionMessage && (
                    <div className="rounded-lg bg-green-100 p-4 text-green-800">
                        {actionMessage}
                    </div>
                )}

                {error && (
                    <div className="rounded-lg bg-red-100 p-4 text-red-700">
                        {error}
                    </div>
                )}

                <section className="overflow-hidden rounded-xl bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search name, phone, plate number..."
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 sm:max-w-md"
                        />

                        <button
                            onClick={fetchDrivers}
                            disabled={loading}
                            className="rounded-lg border border-blue-600 px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Refresh drivers"}
                        </button>
                    </div>

                    {loading ? (
                        <p className="p-8 text-center text-gray-500">
                            Loading drivers...
                        </p>
                    ) : filteredDrivers.length === 0 ? (
                        <p className="p-8 text-center text-gray-500">
                            No drivers found.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-600">
                                    <tr>
                                        <th className="px-4 py-3">Driver</th>
                                        <th className="px-4 py-3">Vehicle</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Account</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-gray-100">
                                    {filteredDrivers.map((driver) => (
                                        <tr key={driver.driver_id}>
                                            <td className="px-4 py-4">
                                                <p className="font-semibold text-gray-800">
                                                    {driver.name}
                                                </p>
                                                <p className="mt-1 text-gray-500">
                                                    {driver.phone}
                                                </p>
                                                <p className="text-gray-500">
                                                    {driver.email || "No email"}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-400">
                                                    Driver ID: {driver.driver_id}
                                                </p>
                                            </td>

                                            <td className="px-4 py-4">
                                                {driver.vehicle ? (
                                                    <>
                                                        <p className="font-medium">
                                                            {driver.vehicle.make}{" "}
                                                            {driver.vehicle.model}
                                                        </p>
                                                        <p className="text-gray-500">
                                                            {driver.vehicle.plate_number}
                                                        </p>
                                                        <p className="text-gray-500">
                                                            {driver.vehicle.color}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        No vehicle
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        driver.status === "online"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {driver.status}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        driver.is_blocked
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}
                                                >
                                                    {driver.is_blocked
                                                        ? "Blocked"
                                                        : "Active"}
                                                </span>
                                            </td>

                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() =>
                                                        handleBlockToggle(driver)
                                                    }
                                                    disabled={
                                                        busyDriver === driver.driver_id
                                                    }
                                                    className={`rounded-lg px-3 py-2 font-semibold text-white disabled:opacity-50 ${
                                                        driver.is_blocked
                                                            ? "bg-green-600 hover:bg-green-700"
                                                            : "bg-red-600 hover:bg-red-700"
                                                    }`}
                                                >
                                                    {busyDriver === driver.driver_id
                                                        ? "Please wait..."
                                                        : driver.is_blocked
                                                            ? "Unblock"
                                                            : "Block"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="border-t px-4 py-3 text-sm text-gray-500">
                        Showing {filteredDrivers.length} of {drivers.length} drivers
                    </div>
                </section>
            </main>
        </div>
    )
}

export default AdminDashboard