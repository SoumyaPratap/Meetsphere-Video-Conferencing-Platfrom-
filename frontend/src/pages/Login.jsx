import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Login Button Clicked");

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("API RESPONSE =", res.data);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      console.log("LOGIN ERROR =", error);

      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-600 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-slate-700 rounded-3xl p-8 shadow-2xl">

        <div className="text-center">

          <h1 className="text-4xl font-bold text-white">
            MeetSphere
          </h1>

          <p className="text-slate-300 mt-3">
            Welcome back 👋
          </p>

          <p className="text-slate-400 mt-2 text-sm">
            Continue your meetings seamlessly.
          </p>

        </div>

        <div className="mt-8">

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

        <button
          onClick={handleLogin}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-white font-semibold transition"
        >
          Login
        </button>

        <p className="text-center text-slate-300 mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-purple-300 hover:text-purple-200 font-medium"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;