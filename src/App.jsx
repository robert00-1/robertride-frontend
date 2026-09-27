import { Routes, Route } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import Register from "./pages/Register"
import Login from "./pages/Login"

import Dashboard from "./pages/Dashboard"
import DriverDashboard from "./pages/DriverDashboard"
function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<LandingPage />}
      />
      <Route
      path="/login" element={<Login />} />

      <Route
        path="/register"
        element={<Register />}
      />
      <Route
      path="/dashboard" element={<Dashboard />} />

     <Route
  path="/driver-dashboard"
  element={<DriverDashboard />}
/> 
     

    </Routes>
  )
}

export default App