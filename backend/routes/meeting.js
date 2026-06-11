const express = require("express");
const Meeting = require("../models/Meeting");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Generate Random 9 Digit Meeting ID
const generateMeetingId = () => {
  return Math.floor(
    100000000 + Math.random() * 900000000
  ).toString();
};

// Test Route
router.get("/", (req, res) => {
  res.send("Meeting Route Working");
});

// Create Meeting
// router.post("/create", async (req, res) => {
    router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    const meeting = new Meeting({
      meetingId: generateMeetingId(),
      title,
      host: req.user.userId,
      status: "active",
    });

    await meeting.save();

    res.status(201).json(meeting);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// Join Meeting
router.get("/join/:id", async (req, res) => {
  try {
    const meeting = await Meeting.findOne({
      meetingId: req.params.id,
    });

    if (!meeting) {
      return res.status(404).send("Meeting Not Found");
    }

    res.json(meeting);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});


router.get(
  "/my-meetings",
  authMiddleware,
  async (req, res) => {
    try {
      const meetings = await Meeting.find({
        host: req.user.userId,
      });

      res.json(meetings);
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }
);


router.delete(
  "/delete/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const meeting = await Meeting.findById(req.params.id);

      if (!meeting) {
        return res.status(404).send("Meeting Not Found");
      }

      // Check Meeting Owner
      if (
        meeting.host.toString() !== req.user.userId
      ) {
        return res.status(403).send("Not Authorized");
      }

      await Meeting.findByIdAndDelete(req.params.id);

      res.send("Meeting Deleted Successfully");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;