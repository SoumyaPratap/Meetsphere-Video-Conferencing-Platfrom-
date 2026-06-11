// import { io } from "socket.io-client";

// const socket = io(
//   "http://192.168.1.3:5000",
//   {
//     autoConnect: false,
//   }
// );

// export default socket;
import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_API_URL,
  {
    autoConnect: false,
  }
);

export default socket;
