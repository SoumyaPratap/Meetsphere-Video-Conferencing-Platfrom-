import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";

function MeetingRoomMulti() {
  const { meetingId } = useParams();
  const navigate = useNavigate();

  const joinedRef = useRef(false);

  const [participants, setParticipants] = useState(0);
  const [users, setUsers] = useState([]);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const streamRef = useRef(null);
  const peersRef = useRef({});
  const targetRef = useRef(null);

  useEffect(() => {
    console.log("MeetingRoom Mounted");

    socket.connect();
    console.log("socket.connect called");

    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);

      if (!joinedRef.current) {
        console.log("Emitting join-room");
        socket.emit("join-room", meetingId);
        joinedRef.current = true;
      }
    });

    socket.on("participants-count", (count) => {
      console.log("Participants:", count);
      setParticipants(count);
    });

    // socket.on("room-users", async (usersList) => {
    //   console.log("ROOM USERS:", usersList);

    //   setUsers(usersList);

    //   // Store latest target socket id
    //   targetRef.current = usersList.find(
    //     (id) => id !== socket.id
    //   );

    //   console.log(
    //     "TARGET REF:",
    //     targetRef.current
    //   );

    //   // Create peer only once
    //   if (!peerRef.current) {
    //     await createPeer();
    //   }

    //   // First user creates offer
    //   if (
    //     usersList.length === 2 &&
    //     socket.id === usersList[0]
    //   ) {
    //     await createOffer(usersList);
    //   }
    // });
    socket.on("room-users", async (usersList) => {
  console.log("ROOM USERS:", usersList);

  setUsers(usersList);

  const otherUsers =
    usersList.filter(
      (id) => id !== socket.id
    );

  console.log(
    "OTHER USERS:",
    otherUsers
  );

  for (const userId of otherUsers) {
    if (!peersRef.current[userId]) {
      await createPeer(userId);

if (socket.id < userId) {
  await createOffer(userId);
       }
    }
  }
});



    socket.on("user-joined", (msg) => {
      console.log(msg);

      setMessage(msg);

      setTimeout(() => {
        setMessage("");
      }, 3000);
    });

    socket.on("offer", async (data) => {
  console.log(
    "Offer Received From:",
    data.sender
  );

  if (
    !peersRef.current[data.sender]
  ) {
    await createPeer(
      data.sender
    );
  }

  const peer =
    peersRef.current[
      data.sender
    ];

  await peer.setRemoteDescription(
    new RTCSessionDescription(
      data.offer
    )
  );

  const answer =
    await peer.createAnswer();

  await peer.setLocalDescription(
    answer
  );

  socket.emit("answer", {
    target: data.sender,
    sender: socket.id,
    answer,
  });

  console.log(
    "Answer Sent To:",
    data.sender
  );
});

   socket.on("answer", async (data) => {
  console.log(
    "Answer Received From:",
    data.sender
  );

  const peer =
    peersRef.current[
      data.sender
    ];

  if (!peer) {
    console.log(
      "Peer not found:",
      data.sender
    );
    return;
  }

  await peer.setRemoteDescription(
    new RTCSessionDescription(
      data.answer
    )
  );

  console.log(
    "Answer Applied For:",
    data.sender
  );
}); 

    socket.on("ice-candidate", async (data) => {
  console.log(
    "ICE Received From:",
    data.sender
  );

  const peer =
    peersRef.current[
      data.sender
    ];

  if (!peer) {
    console.log(
      "Peer not found:",
      data.sender
    );
    return;
  }

  if (data.candidate) {
    try {
      await peer.addIceCandidate(
        new RTCIceCandidate(
          data.candidate
        )
      );

      console.log(
        "ICE Added For:",
        data.sender
      );
    } catch (err) {
      console.error(
        "ICE Error:",
        err
      );
    }
  }
});

    socket.on("chat-message", (data) => {
  console.log("Chat Received:", data);

  setMessages((prev) => [
    ...prev,
    data,
  ]);
});

    return () => {
      console.log("MeetingRoom Cleanup");

      socket.off("connect");
      socket.off("participants-count");
      socket.off("room-users");
      socket.off("user-joined");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");

      socket.disconnect();

      joinedRef.current = false;

      targetRef.current = null;

      // Stop media tracks
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      // Close PeerConnection
      Object.values(
  peersRef.current
).forEach((peer) => {
  peer.close();
});

peersRef.current = {};

      console.log("Cleanup Complete");
    };
  }, [meetingId]);


  const addRemoteStream = (
  socketId,
  stream
) => {
  setRemoteStreams((prev) => {
    const alreadyExists =
      prev.find(
        (item) =>
          item.socketId === socketId
      );

    if (alreadyExists) {
      return prev.map((item) =>
        item.socketId === socketId
          ? {
              ...item,
              stream,
            }
          : item
      );
    }

    return [
      ...prev,
      {
        socketId,
        stream,
      },
    ];
  });
};

  const createPeer = async (
  targetSocketId
) => {
    console.log("createPeer called");

    const stream =
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

    console.log(
      "STEP-1 Camera Access Granted"
    );

    console.log(stream);
    console.log(stream.getVideoTracks());

    streamRef.current = stream;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    console.log("Local Video Set");

    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

   peersRef.current[
  targetSocketId
] = peer;

    stream.getTracks().forEach((track) => {
      peer.addTrack(track, stream);
    });

    // peer.ontrack = (event) => {
    //   console.log(
    //     "Remote Track Received"
    //   );

    //   if (remoteVideoRef.current) {
    //     remoteVideoRef.current.srcObject =
    //       event.streams[0];

    //     console.log(
    //       "Remote Video Set"
    //     );
    //   }
    // };

    peer.ontrack = (event) => {
  console.log(
    "Remote Track Received From:",
    targetSocketId
  );

  addRemoteStream(
    targetSocketId,
    event.streams[0]
  );

  console.log(
    "Remote Stream Added"
  );
};

    peer.onicecandidate = (
  event
) => {
  if (event.candidate) {
    socket.emit("ice-candidate", {
      target: targetSocketId,
      sender: socket.id,
      candidate:
        event.candidate,
    });

    console.log(
      "ICE Sent To:",
      targetSocketId
    );
  }
};

    peer.onconnectionstatechange = () => {
      console.log(
        "Connection State:",
        peer.connectionState
      );
    };

    peer.oniceconnectionstatechange =
      () => {
        console.log(
          "ICE Connection State:",
          peer.iceConnectionState
        );
      };
  };

  // const createOffer = async (
  //   usersList
  // ) => {
  //   const peer = peerRef.current;

  //   const target = usersList.find(
  //     (id) => id !== socket.id
  //   );

  //   if (peer && target) {
  //     const offer =
  //       await peer.createOffer();

  //     await peer.setLocalDescription(
  //       offer
  //     );

  //     socket.emit("offer", {
  //       target,
  //       sender: socket.id,
  //       offer,
  //     });

  //     console.log(
  //       "Offer Created and Sent"
  //     );
  //   }
  // };

  const createOffer = async (
  targetSocketId
) => {
  const peer =
    peersRef.current[
      targetSocketId
    ];

  if (!peer) {
    console.log(
      "Peer not found:",
      targetSocketId
    );
    return;
  }

  const offer =
    await peer.createOffer();

  await peer.setLocalDescription(
    offer
  );

  socket.emit("offer", {
    target: targetSocketId,
    sender: socket.id,
    offer,
  });

  console.log(
    "Offer Sent To:",
    targetSocketId
  );
};

  const toggleMute = () => {
  if (!streamRef.current) return;

  const audioTrack = streamRef.current
    .getAudioTracks()[0];

  if (!audioTrack) return;

  audioTrack.enabled =
    !audioTrack.enabled;

  setIsMuted(!audioTrack.enabled);

  console.log(
    "Mic:",
    audioTrack.enabled
      ? "Unmuted"
      : "Muted"
  );
};


const toggleCamera = () => {
  if (!streamRef.current) return;

  const videoTrack =
    streamRef.current.getVideoTracks()[0];

  if (!videoTrack) return;

  videoTrack.enabled =
    !videoTrack.enabled;

  setIsCameraOff(
    !videoTrack.enabled
  );

  console.log(
    "Camera:",
    videoTrack.enabled
      ? "ON"
      : "OFF"
  );
};

  // const leaveMeeting = () => {
  //   if (streamRef.current) {
  //     streamRef.current
  //       .getTracks()
  //       .forEach((track) =>
  //         track.stop()
  //       );
  //   }

  //   navigate("/dashboard");
  // };

//   const toggleScreenShare = async () => {
//   try {
//     if (!isSharingScreen) {
//       const screenStream =
//         await navigator.mediaDevices.getDisplayMedia({
//           video: true,
//         });

//       const screenTrack =
//         screenStream.getVideoTracks()[0];

//       // Local video me screen dikhao
//       localVideoRef.current.srcObject =
//         screenStream;

//       setIsSharingScreen(true);

//       console.log("Screen Sharing Started");

//       // User manually stop kare
//       screenTrack.onended = () => {
//         localVideoRef.current.srcObject =
//           streamRef.current;

//         setIsSharingScreen(false);

//         console.log(
//           "Screen Sharing Stopped"
//         );
//       };
//     } else {
//       // Camera wapas
//       localVideoRef.current.srcObject =
//         streamRef.current;

//       setIsSharingScreen(false);

//       console.log(
//         "Screen Sharing Stopped"
//       );
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };


const toggleScreenShare = async () => {
  try {
    const peer = peerRef.current;

    if (!peer) {
      console.log("Peer not found");
      return;
    }

    const sender = peer
      .getSenders()
      .find(
        (s) =>
          s.track &&
          s.track.kind === "video"
      );

    if (!sender) {
      console.log(
        "Video sender not found"
      );
      return;
    }

    if (!isSharingScreen) {
      const screenStream =
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

      const screenTrack =
        screenStream.getVideoTracks()[0];

      // Remote user ko screen bhejo
      await sender.replaceTrack(
        screenTrack
      );

      // Local preview me bhi screen dikhao
      localVideoRef.current.srcObject =
        screenStream;

      setIsSharingScreen(true);

      console.log(
        "Remote Screen Sharing Started"
      );

      // Browser se stop sharing
      screenTrack.onended =
        async () => {
          const cameraTrack =
            streamRef.current
              .getVideoTracks()[0];

          await sender.replaceTrack(
            cameraTrack
          );

          localVideoRef.current.srcObject =
            streamRef.current;

          setIsSharingScreen(false);

          console.log(
            "Remote Screen Sharing Stopped"
          );
        };
    } else {
      const cameraTrack =
        streamRef.current
          .getVideoTracks()[0];

      await sender.replaceTrack(
        cameraTrack
      );

      localVideoRef.current.srcObject =
        streamRef.current;

      setIsSharingScreen(false);

      console.log(
        "Remote Screen Sharing Stopped"
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const sendMessage = () => {
  if (!chatInput.trim()) return;

  socket.emit("chat-message", {
    meetingId,
    message: chatInput,
  });

  setChatInput("");
};

  const leaveMeeting = () => {
  console.log("Leaving Meeting...");

  // Stop Camera + Mic
  if (streamRef.current) {
    streamRef.current
      .getTracks()
      .forEach((track) => {
        track.stop();
      });
  }

  // Close Peer Connection
  Object.values(
  peersRef.current
).forEach((peer) => {
  peer.close();
});

peersRef.current = {};

  // Remove socket listeners
  socket.off("connect");
  socket.off("participants-count");
  socket.off("room-users");
  socket.off("user-joined");
  socket.off("offer");
  socket.off("answer");
  socket.off("ice-candidate");

  // Disconnect socket
  socket.disconnect();

  // Reset refs
  joinedRef.current = false;
  targetRef.current = null;

  console.log("Meeting Left Successfully");

  navigate("/dashboard");
};

  return (
    <div>
      <h1>Meeting Room</h1>

      <h2>
        Meeting ID: {meetingId}
      </h2>

      <h3>
        Participants: {participants}
      </h3>

      {message && <h4>{message}</h4>}

      <hr />

      <h3>Connected Users</h3>

      {users.map((user) => (
        <p key={user}>{user}</p>
      ))}

      <hr />

<h3>💬 Chat</h3>

<div
  style={{
    border: "1px solid gray",
    height: "150px",
    overflowY: "auto",
    padding: "10px",
    marginBottom: "10px",
  }}
>
  {messages.map((msg, index) => (
    <p key={index}>
      <strong>
        {msg.sender === socket.id
          ? "You"
          : "User"}
        :
      </strong>{" "}
      {msg.message}
    </p>
  ))}
</div>

<input
  type="text"
  placeholder="Type a message..."
  value={chatInput}
  onChange={(e) =>
    setChatInput(e.target.value)
  }
/>

<button onClick={sendMessage}>
  Send
</button>

<hr />

      <hr />

      <h3>My Video</h3>

      <video
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        width="400"
      />

      <hr />

      <h3>Remote Video</h3>

      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        width="400"
      />

      <button onClick={toggleMute}>
  {isMuted
    ? "🎤 Unmute"
    : "🔇 Mute"}
</button>

<br />
<br />

<button onClick={toggleCamera}>
  {isCameraOff
    ? "📷 Turn Camera On"
    : "📵 Turn Camera Off"}
</button>

<br />
<br />


<button onClick={toggleScreenShare}>
  {isSharingScreen
    ? "🛑 Stop Sharing"
    : "🖥️ Share Screen"}
</button>

<br />
<br />

      

      <button
        onClick={leaveMeeting}
      >
        Leave Meeting
      </button>
    </div>
  );
}

export default MeetingRoomMulti;