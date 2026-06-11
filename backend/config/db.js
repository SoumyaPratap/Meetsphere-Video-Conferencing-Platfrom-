// const mongoose = require("mongoose");

// const connectDB = () => {
//     console.log("Database Connection Function");
// };

// module.export = connectDB;

// const mongoose = require("mongoose");

// const connectDB = () => {
//   console.log("Database Connection Function");
// };

// module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

module.exports = connectDB;