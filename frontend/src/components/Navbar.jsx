import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

      <div>
        <h1 className="text-3xl font-bold text-white">
          MeetSphere
        </h1>

        <p className="text-sm text-slate-300">
          Video meetings made simple
        </p>
      </div>

      <div className="flex items-center gap-6">

        <Link
          to="/login"
          className="text-slate-200 hover:text-white transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl text-white font-semibold transition"
        >
          Get Started
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;