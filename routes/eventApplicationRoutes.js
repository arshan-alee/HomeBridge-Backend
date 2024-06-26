const EventApplicationController = require("../controllers/eventApplicationController");
const {
  isAuthenticatedUser,
  authorizeAdmin,
} = require("../utils/authMiddlewares");
const router = require("express").Router();

router.post(
  "/api/createEventApplication/:eventId",
  isAuthenticatedUser,
  EventApplicationController.createEventApplication
);

// Edit Application (Admin)
router.put(
  "/api/editEventApplication/:applicationId",
  authorizeAdmin,
  isAuthenticatedUser,
  EventApplicationController.editEventApplication
);

// Delete Application (Admin)
router.delete(
  "/api/deleteEventApplication/:applicationId",
  authorizeAdmin,
  isAuthenticatedUser,
  EventApplicationController.deleteEventApplication
);

// Get All Application (Admin)
router.get(
  "/api/getAllApplications",
  authorizeAdmin,
  isAuthenticatedUser,
  EventApplicationController.getAllApplications
);

// Get Single Application (Admin)
router.get(
  "/api/getSingleApplication/:applicationId",

  isAuthenticatedUser,
  EventApplicationController.getSingleApplication
);

router.get(
  "/api/getAllMyApplication",
  isAuthenticatedUser,
  EventApplicationController.getAllMyApplications
);

// ======================
// Ignore Below APIs

// Get All Applications of a particular event (Admin)
router.get(
  "/api/getAllApplicationsOfEvent/:eventId",
  authorizeAdmin,
  EventApplicationController.getAllApplicationsOfEvent
);

// Get Single Application of a particular event (Admin)
router.get(
  "/api/getSingleApplicationOfEvent/event/:eventId/application/:applicationId",
  authorizeAdmin,
  EventApplicationController.getSingleApplicationOfEvent
);

module.exports = router;
