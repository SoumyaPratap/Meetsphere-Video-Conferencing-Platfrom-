import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function JoinMeeting() {
  const navigate = useNavigate();

  const [meetingId, setMeetingId] = useState("");

  const joinMeeting = async () => {
    try {
      await API.get(`/meeting/join/${meetingId}`);

      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      console.log(error);

      alert("Meeting Not Found");
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
            Join an Existing Meeting 🔗
          </p>

          <p className="text-slate-400 mt-2 text-sm">
            Continue collaborating with your team.
          </p>

        </div>

        {/* Meeting ID */}
        <div className="mt-8">

          <label className="block text-slate-200 mb-2">
            Meeting ID
          </label>

          <input
            type="text"
            placeholder="Enter Meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-600 border border-slate-500 text-white placeholder-slate-300 focus:outline-none focus:border-purple-500"
          />

        </div>

        {/* Join Button */}
        <button
          onClick={joinMeeting}
          className="w-full mt-8 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl text-white font-semibold transition"
        >
          Join Meeting
        </button>

        {/* Footer */}
        <p className="text-center text-slate-300 mt-6">

          Need a new meeting?{" "}

          <Link
            to="/dashboard"
            className="text-purple-300 hover:text-purple-200 font-medium"
          >
            Go to Dashboard
          </Link>

        </p>

      </div>

    </div>
  );
}

export default JoinMeeting;