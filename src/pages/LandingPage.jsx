import { useState } from "react"
import {Link} from "react-router-dom"

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">

      {/* ================= NAVBAR ================= */}

      <nav className="absolute left-0 right-0 top-0 z-50">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="flex h-20 items-center justify-between">

            {/* LOGO */}

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-extrabold text-white shadow-lg">
                R
              </div>

              <span className="text-2xl font-extrabold tracking-tight text-white">
                Robert<span className="text-blue-400">Ride</span>
              </span>

            </div>


            {/* DESKTOP NAVIGATION */}

            <div className="hidden items-center gap-9 md:flex">

              <a
                href="#home"
                className="text-sm font-medium text-white transition hover:text-blue-400"
              >
                Home
              </a>

              <a
                href="#services"
                className="text-sm font-medium text-white transition hover:text-blue-400"
              >
                Services
              </a>

              <a
                href="#about"
                className="text-sm font-medium text-white transition hover:text-blue-400"
              >
                About
              </a>

              <a
                href="#contact"
                className="text-sm font-medium text-white transition hover:text-blue-400"
              >
                Contact
              </a>

            </div>


            {/* DESKTOP BUTTONS */}

            <div className="hidden items-center gap-3 md:flex">

              <Link
              to="/login"
              className="rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-gray-900">
                Login
              </Link>
             <Link
             to="/register"
             className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
             >
              Sign Up
             </Link>
            </div>


            {/* MOBILE MENU BUTTON */}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl text-white md:hidden"
              aria-label="Open menu"
            >
              ☰
            </button>

          </div>


          {/* MOBILE MENU */}

          {menuOpen && (

            <div className="rounded-2xl bg-gray-950/95 p-6 shadow-xl backdrop-blur-md md:hidden">

              <div className="flex flex-col gap-5">

                <a
                  href="#home"
                  className="text-white transition hover:text-blue-400"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </a>

                <a
                  href="#services"
                  className="text-white transition hover:text-blue-400"
                  onClick={() => setMenuOpen(false)}
                >
                  Services
                </a>

                <a
                  href="#about"
                  className="text-white transition hover:text-blue-400"
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </a>

                <a
                  href="#contact"
                  className="text-white transition hover:text-blue-400"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </a>


                <div className="flex gap-3 pt-2">

                  <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-xl border border-white/30 px-4 py-3 text-white">
                    Login
                  </Link>
                <Link 
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white"
                >
                  Sign Up
                </Link>

                </div>

              </div>

            </div>

          )}

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section
        id="home"
        className="relative min-h-screen overflow-hidden"
      >

        {/* HERO BACKGROUND IMAGE */}

        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/robertride-hero.png')",
          }}
        />


        {/* DARK OVERLAY */}

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />


        {/* BOTTOM OVERLAY */}

        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />


        {/* HERO CONTENT */}

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-20 pt-28 lg:px-8">

          <div className="w-full">

            <div className="grid items-center gap-12 lg:grid-cols-2">


              {/* ================= LEFT CONTENT ================= */}

              <div className="max-w-3xl">


                {/* BADGE */}

                <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md">

                  <span className="h-2.5 w-2.5 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />

                  <span className="text-sm font-medium text-white">
                    Reliable rides across Nairobi
                  </span>

                </div>


                {/* HEADING */}

                <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">

                  Move freely.

                  <br />

                  <span className="text-blue-400">
                    Ride smarter.
                  </span>

                </h1>


                {/* DESCRIPTION */}

                <p className="mt-7 max-w-xl text-lg leading-8 text-gray-200 sm:text-xl">

                  Get where you need to go with RobertRide.
                  Book a ride, track your driver in real time,
                  and pay securely with M-PESA.

                </p>


                {/* BUTTONS */}

                <div className="mt-9 flex flex-col gap-4 sm:flex-row">

                  <button className="group rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-2xl shadow-blue-900/40 transition duration-300 hover:-translate-y-1 hover:bg-blue-700">

                    Book a Ride

                    <span className="ml-3 transition-all duration-300 group-hover:ml-5">
                      →
                    </span>

                  </button>


                  <button className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition duration-300 hover:bg-white hover:text-gray-900">

                    Explore RobertRide

                  </button>

                </div>


                {/* TRUST FEATURES */}

                <div className="mt-12 flex flex-wrap items-center gap-6">


                  {/* SAFE */}

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg backdrop-blur-md">
                      ✓
                    </div>

                    <div>

                      <p className="text-sm font-bold text-white">
                        Safe rides
                      </p>

                      <p className="text-xs text-gray-300">
                        Trusted drivers
                      </p>

                    </div>

                  </div>


                  <div className="hidden h-10 w-px bg-white/20 sm:block" />


                  {/* TRACKING */}

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg backdrop-blur-md">
                      📍
                    </div>

                    <div>

                      <p className="text-sm font-bold text-white">
                        Live tracking
                      </p>

                      <p className="text-xs text-gray-300">
                        Know where you are
                      </p>

                    </div>

                  </div>


                  <div className="hidden h-10 w-px bg-white/20 sm:block" />


                  {/* MPESA */}

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg backdrop-blur-md">
                      💳
                    </div>

                    <div>

                      <p className="text-sm font-bold text-white">
                        M-PESA
                      </p>

                      <p className="text-xs text-gray-300">
                        Easy payments
                      </p>

                    </div>

                  </div>

                </div>

              </div>


              {/* ================= RIDE CARD ================= */}

              <div className="hidden lg:flex lg:justify-end">

                <div className="w-full max-w-sm">

                  <div className="rounded-3xl border border-white/30 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">


                    {/* CARD HEADER */}

                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                          Available ride
                        </p>

                        <h3 className="mt-2 text-xl font-bold text-gray-900">
                          Nairobi CBD → Westlands
                        </h3>

                      </div>


                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
                        🚗
                      </div>

                    </div>


                    <div className="my-5 h-px bg-gray-200" />


                    {/* DRIVER */}

                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                        JM
                      </div>

                      <div className="flex-1">

                        <p className="font-bold text-gray-900">
                          John Mwangi
                        </p>

                        <p className="text-xs text-gray-500">
                          Toyota Fielder • KDA 123A
                        </p>

                      </div>

                      <div>

                        <p className="font-bold text-gray-900">
                          ★ 4.9
                        </p>

                      </div>

                    </div>


                    {/* LOCATION */}

                    <div className="mt-6 space-y-4">


                      <div className="flex items-start gap-4">

                        <div className="flex flex-col items-center">

                          <div className="h-3 w-3 rounded-full bg-blue-600" />

                          <div className="h-7 w-px bg-gray-300" />

                        </div>

                        <div>

                          <p className="text-xs text-gray-500">
                            Pickup
                          </p>

                          <p className="font-semibold text-gray-900">
                            Nairobi CBD
                          </p>

                        </div>

                      </div>


                      <div className="flex items-center gap-4">

                        <div className="h-3 w-3 rounded-full bg-red-500" />

                        <div>

                          <p className="text-xs text-gray-500">
                            Destination
                          </p>

                          <p className="font-semibold text-gray-900">
                            Westlands
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* FARE */}

                    <div className="mt-6 flex items-center justify-between rounded-2xl bg-gray-100 p-4">

                      <div>

                        <p className="text-xs text-gray-500">
                          Estimated fare
                        </p>

                        <p className="mt-1 text-2xl font-black text-gray-900">
                          KSh 450
                        </p>

                      </div>


                      <span className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
                        Available
                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* SCROLL INDICATOR */}

        <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center md:flex">

          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/70">
            Explore
          </span>

          <span className="mt-2 animate-bounce text-xl text-white">
            ↓
          </span>

        </div>

      </section>


      {/* ================= SERVICES ================= */}

      <section
        id="services"
        className="bg-gray-50 py-24"
      >

        <div className="mx-auto max-w-7xl px-6 lg:px-8">


          {/* SECTION HEADER */}

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Why RobertRide
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
              Everything you need for a better ride
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Simple technology designed to make getting around
              Nairobi easier, safer and more convenient.
            </p>

          </div>


          {/* SERVICE CARDS */}

          <div className="mt-14 grid gap-7 md:grid-cols-3">


            {/* BOOKING */}

            <div className="group rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl transition group-hover:bg-blue-600">
                📍
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900">
                Easy Booking
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Request a ride quickly and get connected
                with a nearby driver.
              </p>

            </div>


            {/* TRACKING */}

            <div className="group rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-2xl transition group-hover:bg-green-500">
                🗺️
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900">
                Live Tracking
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Follow your driver's location and know
                when they are arriving.
              </p>

            </div>


            {/* PAYMENT */}

            <div className="group rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-2xl transition group-hover:bg-purple-500">
                💳
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-900">
                M-PESA Payments
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Pay conveniently and securely using
                M-PESA after completing your ride.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}

      <section
        id="about"
        className="bg-white py-24"
      >

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid items-center gap-14 lg:grid-cols-2">


            <div>

              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                About RobertRide
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                Moving Nairobi,
                <span className="text-blue-600">
                  {" "}one ride at a time.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-gray-600">
                RobertRide is designed to make transportation
                around Nairobi simple and convenient.
              </p>

              <p className="mt-4 leading-7 text-gray-600">
                From requesting a ride to tracking your driver
                and making your payment, everything is designed
                around a smooth passenger experience.
              </p>


              <button className="mt-8 rounded-xl bg-gray-900 px-7 py-3.5 font-bold text-white transition hover:bg-gray-800">
                Learn More →
              </button>

            </div>


            {/* ABOUT STATS */}

            <div className="grid grid-cols-2 gap-5">

              <div className="rounded-3xl bg-gray-50 p-7">

                <p className="text-4xl font-black text-blue-600">
                  24/7
                </p>

                <p className="mt-2 font-semibold text-gray-900">
                  Ride availability
                </p>

              </div>


              <div className="rounded-3xl bg-gray-50 p-7">

                <p className="text-4xl font-black text-blue-600">
                  100%
                </p>

                <p className="mt-2 font-semibold text-gray-900">
                  Secure payments
                </p>

              </div>


              <div className="rounded-3xl bg-gray-50 p-7">

                <p className="text-4xl font-black text-blue-600">
                  GPS
                </p>

                <p className="mt-2 font-semibold text-gray-900">
                  Live tracking
                </p>

              </div>


              <div className="rounded-3xl bg-gray-50 p-7">

                <p className="text-4xl font-black text-blue-600">
                  M-PESA
                </p>

                <p className="mt-2 font-semibold text-gray-900">
                  Easy payments
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="bg-blue-600 py-20">

        <div className="mx-auto max-w-4xl px-6 text-center">

          <h2 className="text-4xl font-black text-white sm:text-5xl">
            Ready to ride?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Get where you need to go quickly, safely and
            conveniently with RobertRide.
          </p>

          <button className="mt-8 rounded-xl bg-white px-8 py-4 font-bold text-blue-600 shadow-xl transition hover:-translate-y-1 hover:bg-gray-100">
            Book Your Ride →
          </button>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer
        id="contact"
        className="bg-gray-950 py-12"
      >

        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">


            {/* LOGO */}

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                  R
                </div>

                <p className="text-xl font-extrabold text-white">
                  Robert<span className="text-blue-400">Ride</span>
                </p>

              </div>

              <p className="mt-2 text-sm text-gray-500">
                Moving Nairobi, one ride at a time.
              </p>

            </div>


            {/* LINKS */}

            <div className="flex gap-6 text-sm text-gray-400">

              <a
                href="#home"
                className="transition hover:text-white"
              >
                Home
              </a>

              <a
                href="#services"
                className="transition hover:text-white"
              >
                Services
              </a>

              <a
                href="#about"
                className="transition hover:text-white"
              >
                About
              </a>

              <a
                href="#contact"
                className="transition hover:text-white"
              >
                Contact
              </a>

            </div>


            {/* COPYRIGHT */}

            <p className="text-sm text-gray-500">
              © 2026 RobertRide
            </p>

          </div>

        </div>

      </footer>

    </div>
  )
}

export default LandingPage