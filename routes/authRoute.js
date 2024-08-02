const { oauth2callback, googleCalendarEvent } = require("../controller/authController");

const authRoute = require("express").Router();

authRoute.post("/oauth2callback", oauth2callback);
authRoute.post("/calendar-event", googleCalendarEvent )

module.exports = authRoute;
