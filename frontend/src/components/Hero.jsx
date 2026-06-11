import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">

      <div className="grid md:grid-cols-2 gap-12 items-center">

        {/* Left */}
        <div>

          <div className="inline-block bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full mb-6">
            🚀 MeetSphere
          </div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Meet.
            <br />
            Collaborate.
            <br />
            Connect.
          </h1>

          <p className="mt-6 text-slate-300 text-lg leading-8">
            Professional video meetings with real-time chat,
            screen sharing and secure collaboration.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              to="/register"
              className="bg-purple-600 hover:bg-purple-700 px-7 py-4 rounded-xl font-semibold transition"
            >
              Start Meeting
            </Link>

            <Link
              to="/join"
              className="border border-slate-500 hover:border-purple-500 px-7 py-4 rounded-xl transition"
            >
              Join Meeting
            </Link>

          </div>

        </div>

        {/* Right */}
        <div className="bg-slate-700 rounded-3xl p-6 shadow-xl">

          <div className="grid grid-cols-2 gap-4">

            <div className="bg-slate-600 rounded-2xl h-32 flex items-center justify-center text-4xl">
              👨‍💻
            </div>

            <div className="bg-slate-600 rounded-2xl h-32 flex items-center justify-center text-4xl">
              👩‍💻
            </div>

            <div className="bg-slate-600 rounded-2xl h-32 flex items-center justify-center text-4xl">
              👨
            </div>

            <div className="bg-slate-600 rounded-2xl h-32 flex items-center justify-center text-4xl">
              👩
            </div>

          </div>

          <div className="mt-6 flex justify-between text-slate-300">

            <span>📹 HD Calls</span>

            <span>💬 Chat</span>

            <span>🖥️ Share</span>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;