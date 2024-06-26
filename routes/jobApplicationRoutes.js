const {
  createApplication,
  getAllApplications,
  getSingleApplication,
  updateApplication,
  deleteApplication,
  getMyApplications,
} = require("../controllers/jobApplicationController");
const {
  authorizeAdmin,
  isAuthenticatedUser,
} = require("../utils/authMiddlewares");
const router = require("express").Router();

router.post(
  "/api/job_house_application/createApplication",
  isAuthenticatedUser,
  createApplication
);
router.put(
  "/api/job_house_application/updateApplication",
  authorizeAdmin,
  updateApplication
);
router.delete(
  "/api/job_house_application/deleteApplication",
  authorizeAdmin,
  deleteApplication
);
router.get(
  "/api/job_house_application/allApplications",
  authorizeAdmin,
  getAllApplications
);
router.get(
  "/api/job_house_application/myApplications",
  isAuthenticatedUser,
  getMyApplications
);
router.get(
  "/api/job_house_application/application",
  isAuthenticatedUser,
  getSingleApplication
);

module.exports = router;
