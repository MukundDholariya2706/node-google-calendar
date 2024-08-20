const { oauth2callback, googleCalendarEvent, addCalenderId } = require("../controller/authController");

const authRoute = require("express").Router();

authRoute.post("/oauth2callback", oauth2callback);
authRoute.post("/calendar-event", googleCalendarEvent);
authRoute.post("/add-calendar-id", addCalenderId)

module.exports = authRoute;
