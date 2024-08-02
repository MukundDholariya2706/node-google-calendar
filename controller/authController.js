const AuthService = require("../services/authService");

const authService = new AuthService();

const oauth2callback = async (req, res) => {
    await authService.oauth2Config(req, res);
}

const googleCalendarEvent = async (req, res) => {
    await authService.events(req, res);
}

module.exports = {
    oauth2callback,
    googleCalendarEvent
}