const { default: mongoose } = require("mongoose");
const EventApplicationModel = require("../models/eventApplicationModel");
const EventModel = require("../models/eventModel");

// Creates New Event Application (User)
module.exports.createEventApplication = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, message } = req.body;
    const { eventId } = req.params;

    console.log("req.user._id");
    console.log(req.user._id);

    // Check if the event exists
    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(400).json({
        status: false,
        message: "Event not found",
      });
    }

    // Check if the user has already applied to this event
    const existingApplication = await EventApplicationModel.findOne({
      user: req?.user._id,
      event: eventId,
    });

    if (existingApplication) {
      return res.status(400).json({
        status: false,
        message: "You have already applied to this event",
      });
    }

    const newEventApplication = await EventApplicationModel.create({
      user: req.user.id,
      event: eventId,
      name,
      phoneNumber,
      email,
      message,
    });

    return res.json({
      status: true,
      message: "Event application submitted",
      eventApplication: newEventApplication,
    });
  } catch (ex) {
    return res.status(500).json({ status: false, message: ex.message });
  }
};

// Edit Event Application (Admin)
module.exports.editEventApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid Application Id" });
    }

    const application = await EventApplicationModel.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ status: false, message: "No Application Found" });
    }

    await EventApplicationModel.findByIdAndUpdate(applicationId, req.body, {
      new: true,
    });

    return res.json({
      status: true,
      message: "Application updated successfully!",
    });
  } catch (ex) {
    return res.status(500).json({ status: false, message: ex.message });
  }
};

// Delete Event Application (Admin)
module.exports.deleteEventApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid Application Id" });
    }

    const application = await EventApplicationModel.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ status: false, message: "No Application Found" });
    }

    await EventApplicationModel.findByIdAndDelete(applicationId);

    return res.json({
      status: true,
      message: "Event Application deleted successfully!",
    });
  } catch (ex) {
    return res.status(500).json({ status: false, message: ex.message });
  }
};

// Get All Application (Admin)
module.exports.getAllApplications = async (req, res, next) => {
  try {
    const allApplications = await EventApplicationModel.find().populate(
      "event",
      "productIntroduction"
    );

    if (allApplications.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No Record Found",
      });
    }

    return res.status(200).json({
      status: true,
      data: allApplications,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
// Get Single Application (Admin)
module.exports.getSingleApplication = async (req, res, next) => {
  try {
    const { applicationId } = req.params;

    const foundApplication = await EventApplicationModel.findById(
      applicationId
    ).populate("event");

    if (!foundApplication) {
      return res.status(404).json({
        status: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: foundApplication,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports.getAllMyApplications = async (req, res, next) => {
  try {
    const myApplications = await EventApplicationModel.find({
      user: req?.user?._id,
    }).populate("event");

    if (myApplications.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No Record Found",
      });
    }

    return res.status(200).json({
      status: true,
      data: myApplications,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// =============================
// Ignore below

// Get All Applications of a particular event (Admin)
module.exports.getAllApplicationsOfEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    // Check if the event exists
    const eventExists = await EventModel.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
      });
    }

    // Fetch all applications for the specified event
    const eventApplications = await EventApplicationModel.find({
      event: eventId,
    });

    return res.status(200).json({
      status: true,
      data: eventApplications,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get Single Application of a particular event (Admin)
module.exports.getSingleApplicationOfEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { applicationId } = req.params;

    // Check if the event exists
    const eventExists = await EventModel.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
      });
    }

    // Fetch the single application for the specified event
    const eventApplication = await EventApplicationModel.findOne({
      _id: applicationId,
      event: eventId,
    });

    if (!eventApplication) {
      return res.status(404).json({
        status: false,
        message: "Application not found for the specified event",
      });
    }

    return res.status(200).json({
      status: true,
      data: eventApplication,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
