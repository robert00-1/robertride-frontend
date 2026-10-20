
import { useState } from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "Services", id: "services" },
    { label: "About", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR */}
      <nav className="absolute left-0 right-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <a href="#home" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-extrabold text-white shadow-lg">
                R
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Robert<span className="text-blue-400">Ride</span>
              </span>
            </a>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden items-center gap-9 md:flex">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="text-sm font-medium text-white transition hover:text-blue-400"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* DESKTOP AUTH BUTTONS */}
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/login"
                className="rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-gray-900"
              >
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
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-2xl text-white md:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>

          {/* MOBILE MENU */}
          {menuOpen && (
            <div className="rounded-2xl bg-gray-950/95 p-6 shadow-xl backdrop-blur-md md:hidden">
              <div className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    type="button"
                    onClick={() => scrollToSection(link.id)}
                    className="text-left text-white transition hover:text-blue-400"
                  >
                    {link.label}
                  </button>
                ))}

                <div className="flex gap-3 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex-1 rounded-xl border border-white/30 px-4 py-3 text-center text-white"
                  >
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

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-screen scroll-mt-20 overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/robertride-hero.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pb-20 pt-28 lg:px-8">
          <div className="grid w-full items-center gap-12 lg:grid-cols-2">
            {/* HERO TEXT */}
            <div className="max-w-3xl">
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 backdrop-blur-md">
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                <span className="text-sm font-medium text-white">
                  Your ride, across Eldoret
                </span>
              </div>

              <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Move freely.
                <br />
                <span className="text-blue-400">Ride smarter.</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-gray-200 sm:text-xl">
                Get where you need to go with RobertRide. Book a ride,
                follow your journey, and enjoy convenient transportation
                around Eldoret.
              </p>

              {/* BOOKING BUTTONS */}
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/register"
                  className="group rounded-xl bg-blue-600 px-8 py-4 text-center text-base font-bold text-white shadow-2xl transition duration-300 hover:-translate-y-1 hover:bg-blue-700"
                >
                  Book a Ride
                  <span className="ml-3 inline-block transition-all duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => scrollToSection("services")}
                  className="rounded-xl border border-white/30 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-md transition duration-300 hover:bg-white hover:text-gray-900"
                >
                  Explore RobertRide
                </button>
              </div>

              {/* TRUST FEATURES */}
              <div className="mt-12 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg text-white">
                    ✓
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Convenience</p>
                    <p className="text-xs text-gray-300">Easy ride requests</p>
                  </div>
                </div>

                <div className="hidden h-10 w-px bg-white/20 sm:block" />

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg">
                    📍
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Location</p>
                    <p className="text-xs text-gray-300">Plan your journey</p>
                  </div>
                </div>

                <div className="hidden h-10 w-px bg-white/20 sm:block" />

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg">
                    💳
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Payments</p>
                    <p className="text-xs text-gray-300">Convenient options</p>
                  </div>
                </div>
              </div>
            </div>

            {/* SAMPLE RIDE CARD */}
            <div className="hidden justify-end lg:flex">
              <div className="w-full max-w-sm rounded-3xl border border-white/30 bg-white/95 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                      Example journey
                    </p>
                    <h3 className="mt-2 text-xl font-bold text-gray-900">
                      Eldoret CBD → Kapsoya
                    </h3>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-xl">
                    🚗
                  </div>
                </div>

                <div className="my-5 h-px bg-gray-200" />

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                    RR
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">RobertRide</p>
                    <p className="text-xs text-gray-500">
                      Your local ride service
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-blue-600" />
                      <div className="h-7 w-px bg-gray-300" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pickup</p>
                      <p className="font-semibold text-gray-900">Eldoret CBD</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div>
                      <p className="text-xs text-gray-500">Destination</p>
                      <p className="font-semibold text-gray-900">Kapsoya</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-gray-100 p-4">
                  <p className="text-sm leading-6 text-gray-600">
                    Sign up to enter your pickup and destination and estimate
                    your own journey fare.
                  </p>
                </div>

                <Link
                  to="/register"
                  className="mt-4 block rounded-xl bg-blue-600 px-5 py-3 text-center font-bold text-white transition hover:bg-blue-700"
                >
                  Plan Your Journey →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => scrollToSection("services")}
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center md:flex"
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-white/70">
            Explore
          </span>
          <span className="mt-2 animate-bounce text-xl text-white">↓</span>
        </button>
      </section>

      {/* SERVICES */}
      <section id="services" className="scroll-mt-10 bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Why RobertRide
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
              A simpler way to travel around Eldoret
            </h2>
            <p className="mt-5 text-lg leading-8 text-gray-600">
              Convenient ride booking designed around your everyday journeys.
            </p>
          </div>

          <div className="mt-14 grid gap-7 md:grid-cols-3">
            {[
              {
                icon: "📍",
                title: "Easy Booking",
                description:
                  "Enter your pickup and destination, estimate your fare, and request a ride.",
                color: "bg-blue-100",
              },
              {
                icon: "🗺️",
                title: "Location Tracking",
                description:
                  "Use the ride map to view location information available in your journey.",
                color: "bg-green-100",
              },
              {
                icon: "💳",
                title: "Convenient Payments",
                description:
                  "Access the payment options supported by the RobertRide application.",
                color: "bg-purple-100",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="group rounded-3xl bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${service.color} text-2xl`}
                >
                  {service.icon}
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  {service.title}
                </h3>
                <p className="mt-3 leading-7 text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="scroll-mt-10 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                About RobertRide
              </p>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
                Moving Eldoret,
                <span className="text-blue-600"> one ride at a time.</span>
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                RobertRide aims to make transportation around Eldoret simple
                and convenient.
              </p>
              <p className="mt-4 leading-7 text-gray-600">
                From entering your pickup location to estimating a fare and
                requesting a ride, the application helps you plan your journey
                in one place.
              </p>

              <button
                type="button"
                onClick={() => scrollToSection("services")}
                className="mt-8 rounded-xl bg-gray-900 px-7 py-3.5 font-bold text-white transition hover:bg-gray-800"
              >
                Explore Our Services →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {[
                { value: "GPS", label: "Location-based journeys" },
                { value: "Easy", label: "Ride requests" },
                { value: "Map", label: "Journey overview" },
                { value: "Local", label: "Focused on Eldoret" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl bg-gray-50 p-7">
                  <p className="text-3xl font-black text-blue-600">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-semibold text-gray-900">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-black text-white sm:text-5xl">
            Ready to ride?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
            Sign up and plan your next journey around Eldoret with RobertRide.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-bold text-blue-600 shadow-xl transition hover:-translate-y-1 hover:bg-gray-100"
          >
            Book Your Ride →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="scroll-mt-10 bg-gray-950 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <a href="#home" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                  R
                </div>
                <p className="text-xl font-extrabold text-white">
                  Robert<span className="text-blue-400">Ride</span>
                </p>
              </a>
              <p className="mt-2 text-sm text-gray-500">
                Moving Eldoret, one ride at a time.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="transition hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} RobertRide
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
