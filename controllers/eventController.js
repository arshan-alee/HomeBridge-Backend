const { default: mongoose } = require("mongoose");
const EventModel = require("../models/eventModel");
const EventApplicationModel = require("../models/eventApplicationModel");

// Admin
module.exports.eventRegistration = async (req, res, next) => {
  try {
    const newEvent = await EventModel.create(req.body);

    return res.status(201).json({
      status: true,
      message: "Event registration successful",
      data: newEvent,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Admin
module.exports.editEventRegistration = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid Event Id" });
    }

    const existingEvent = await EventModel.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
      });
    }

    const {
      price,
      deadline,
      productIntroduction,
      productDescription,
      departure,
      arrival,
      traffic,
      productInformation,
      schedules,
      eventImages,
    } = req.body;

    existingEvent.price = price;
    existingEvent.eventImages = eventImages;
    existingEvent.departure = departure;
    existingEvent.arrival = arrival;
    existingEvent.traffic = traffic;
    existingEvent.deadline = deadline;
    existingEvent.productIntroduction = productIntroduction;
    existingEvent.productDescription = productDescription;
    existingEvent.productInformation = productInformation;
    existingEvent.schedules = schedules;

    const updatedEvent = await existingEvent.save();

    return res.status(200).json({
      status: true,
      message: "Event registration updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Admin
module.exports.deleteEventRegistration = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res
        .status(404)
        .json({ status: false, message: "Invalid Event Id" });
    }

    if (!eventId) {
      return res
        .status(404)
        .json({ status: false, message: "Insufficient Details" });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ status: false, message: "No Record Found" });
    }

    // Delete the event
    await EventModel.findByIdAndDelete(eventId);

    // Delete event applications related to the event
    await EventApplicationModel.deleteMany({ event: eventId });

    return res.json({
      status: true,
      message: "Event deleted successfully!",
    });
  } catch (ex) {
    return res.status(500).json({ status: false, message: ex.message });
  }
};

// Website Paginated
module.exports.getAllEventsWebsite = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const eventsPerPage = parseInt(req.query.eventsPerPage) || 8;

    const totalEvents = await EventModel.countDocuments();

    if ((page - 1) * eventsPerPage >= totalEvents) {
      return res.status(200).json({
        status: false,
        message: "No more records",
      });
    }

    const allEvents = await EventModel.find()
      .skip((page - 1) * eventsPerPage)
      .limit(eventsPerPage);

    if (allEvents.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No Record Found",
      });
    }

    let data = {
      currentPage: page,
      eventsPerPage: eventsPerPage,
      totalEvents: totalEvents,
      events: allEvents,
    };

    return res.status(200).json({
      status: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports.getAllEventsAdminPanel = async (req, res, next) => {
  try {
    const allEvents = await EventModel.aggregate([
      {
        $lookup: {
          from: "eventapplications",
          localField: "_id",
          foreignField: "event",
          as: "applicants",
        },
      },
      {
        $addFields: {
          numberOfApplicants: { $size: "$applicants" },
        },
      },
      {
        $project: {
          applicants: 0,
        },
      },
    ]);

    if (allEvents.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No Record Found",
      });
    }

    return res.status(200).json({
      status: true,
      data: allEvents,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports.getSingleEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid event ID",
      });
    }

    const foundEvent = await EventModel.findById(eventId);

    if (!foundEvent) {
      return res.status(404).json({
        status: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: foundEvent,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
