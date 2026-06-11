import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchMeetings();
  }, []);

  // Fetch User Profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/auth/profile", {
        headers: {
          authorization: token,
        },
      });

      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Meetings
  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/meeting/my-meetings", {
        headers: {
          authorization: token,
        },
      });

      setMeetings(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Create Meeting
  const createMeeting = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/meeting/create",
        { title },
        {
          headers: {
            authorization: token,
          },
        }
      );

      alert("Meeting Created: " + res.data.meetingId);

      setTitle("");

      fetchMeetings();
    } catch (error) {
      console.log(error);
      alert("Meeting Creation Failed");
    }
  };

  // Delete Meeting
  const deleteMeeting = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/meeting/delete/${id}`, {
        headers: {
          authorization: token,
        },
      });

      alert("Meeting Deleted");

      fetchMeetings();
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-600 text-white px-6 py-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

          <div>
            <h1 className="text-4xl font-bold">
              Welcome, {user?.name} 👋
            </h1>

            <p className="text-slate-300 mt-2">
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-semibold transition"
          >
            Logout
          </button>

        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">

          {/* Create Meeting */}
          <div className="bg-slate-700 rounded-3xl p-6 shadow-xl">

            <h2 className="text-2xl font-bold">
              🎥 Create Meeting
            </h2>

            <p className="text-slate-300 mt-2">
              Start a new meeting instantly.
            </p>

            <input
              type="text"
              placeholder="Meeting Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-5 px-4 py-3 rounded-xl bg-slate-600 border border-slate-500 text-white placeholder-slate-300 focus:outline-none focus:border-purple-500"
            />

            <button
              onClick={createMeeting}
              className="w-full mt-5 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold transition"
            >
              Create Meeting
            </button>

          </div>

          {/* Join Meeting */}
          <div className="bg-slate-700 rounded-3xl p-6 shadow-xl flex flex-col justify-center">

            <h2 className="text-2xl font-bold">
              🔗 Join Meeting
            </h2>

            <p className="text-slate-300 mt-2">
              Enter an existing meeting instantly.
            </p>

            <button
              onClick={() => navigate("/join")}
              className="mt-6 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-semibold transition"
            >
              Join Meeting
            </button>

          </div>

        </div>

        {/* My Meetings */}
        <div className="mt-12">

          <h2 className="text-3xl font-bold">
            My Meetings
          </h2>

          {meetings.length === 0 ? (

            <div className="bg-slate-700 rounded-3xl p-8 mt-6 text-center text-slate-300">
              No meetings created yet.
            </div>

          ) : (

            <div className="grid md:grid-cols-2 gap-6 mt-6">

              {meetings.map((meeting) => (

                <div
                  key={meeting._id}
                  className="bg-slate-700 rounded-3xl p-6 shadow-lg"
                >

                  <h3 className="text-2xl font-semibold">
                    {meeting.title}
                  </h3>

                  <p className="text-slate-300 mt-3">
                    Meeting ID:
                  </p>

                  <p className="font-mono text-lg mt-1 break-all">
                    {meeting.meetingId}
                  </p>

                  <div className="flex gap-3 mt-6">

                    <button
                      onClick={() =>
                        navigate(
                          `/meeting/${meeting.meetingId}`
                        )
                      }
                      className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold transition"
                    >
                      Join
                    </button>

                    <button
                      onClick={() =>
                        deleteMeeting(meeting._id)
                      }
                      className="flex-1 bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;