import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      console.log("Button Clicked");

      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      console.log(res);

      alert("Registration Successful 🎉");

      setName("");
      setEmail("");
      setPassword("");

      navigate("/login");
    } catch (error) {
      console.log(error);
      console.log(error.response);

      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-600 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-slate-700 rounded-3xl p-8 shadow-2xl">

        {/* Heading */}
        <div className="text-center">

          <h1 className="text-4xl font-bold text-white">
            MeetSphere
          </h1>

          <p className="text-slate-300 mt-3">
            Create Your Account 🚀
          </p>

          <p className="text-slate-400 mt-2 text-sm">
            Start collaborating in minutes.
          </p>

        </div>

        {/* Name */}
        <div className="mt-8">

          <label className="block text-slate-200 mb-2">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-600 border border-slate-500 text-white placeholder-slate-300 focus:outline-none focus:border-purple-500"
          />

        </div>

        {/* Email */}
        <div className="mt-5">

          <label className="block text-slate-200 mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-600 border border-slate-500 text-white placeholder-slate-300 focus:outline-none focus:border-purple-500"
          />

        </div>

        {/* Password */}
        <div className="mt-5">

          <label className="block text-slate-200 mb-2">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-600 border border-slate-500 text-white placeholder-slate-300 focus:outline-none focus:border-purple-500"
          />

        </div>

        {/* Register Button */}
        <button
          onClick={handleRegister}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-white font-semibold transition"
        >
          Create Account
        </button>

        {/* Footer */}
        <p className="text-center text-slate-300 mt-6">

          Already have an account?{" "}

          <Link
            to="/login"
            className="text-purple-300 hover:text-purple-200 font-medium"
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;