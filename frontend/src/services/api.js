// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://192.168.1.3:5000/api",
// });

// export default API;


import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
});

export default API;