require("dotenv").config();
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("./responseService");
const Authentication = require("../models/authenticationSchema");
const moment = require("moment");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

class AuthService {
  refreshAccessTokenIfNeeded = async (oAuth2Client, activity_data) => {
    try {
      const { credentials } = await oAuth2Client.refreshAccessToken();

      oAuth2Client.setCredentials(credentials);
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw new Error("Error refreshing access token");
    }
  };

  oauth2Config = async (req, res) => {
    try {
      const { code } = req.body;
      const { tokens } = await oauth2Client.getToken(code);
      const decoded = jwt.decode(tokens?.id_token);

      let user_exist = await Authentication.findOne({
        email: decoded?.email,
      }).lean();

      if (!user_exist) {
        user_exist = await Authentication.create({
          email: decoded?.email,
          refresh_token: tokens?.refresh_token,
          access_token: tokens?.access_token,
        });
        user_exist = user_exist.toObject({ getters: true });
      }

      return sendResponse(res, 200, true, "Google Verification is complete.", {
        ...user_exist,
      });
    } catch (error) {
      return sendResponse(res, 500, false, error.message, {
        message: error.message,
      });
    }
  };

  events = async (req, res) => {
    try {
      const { email, startDate, endDate } = req.body;

      let user_details = await Authentication.findOne({ email }).lean();

      oauth2Client.setCredentials({
        access_token: user_details.access_token,
        refresh_token: user_details.refresh_token,
      });

      await this.refreshAccessTokenIfNeeded(oauth2Client, {
        refresh_token: user_details?.refresh_token,
      });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      
      // Get All Calendar Id from the register user
      // this.getCalendarIds(calendar, user_details)

      // Function to fetch events from a single calendar
      const fetchEventsFromCalendar = (calendarId) => {
        return new Promise((resolve, reject) => {
          calendar.events.list(
            {
              calendarId: calendarId,
              timeMin: new Date(startDate),
              timeMax: new Date(endDate),
              singleEvents: true,
            },
            (err, response) => {
              if (err) return reject(err);
              resolve(response.data.items);
            }
          );
        });
      };

      // Fetch events from all specified calendars in parallel
      const allEventsPromises = user_details?.calendarId?.map( fetchEventsFromCalendar );

      try {
        const allEvents = await Promise.all(allEventsPromises);
        const flattenedEvents = allEvents.flat();
        return sendResponse(res, 200, true, "Google Calender Event", flattenedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        return sendResponse(res, 500, false, error.message, { message: error.message });
      }
    } catch (error) {
      return sendResponse(res, 500, false, error.message, { message: error.message });
    }
  };

  addCalenderId = async (req, res) => {
    try {
      const { email, newCalendarId } = req.body;

      const updatedUser = await Authentication.findOneAndUpdate(
        { email },
        { $addToSet: { calendarId: newCalendarId } },
        { new: true }
      ).lean();

      if (!updatedUser) {
        return sendResponse(res, 400, false, "User not found", undefined);
      }

      return sendResponse(res, 200, true, "Calendar Id added", updatedUser);
    } catch (error) {
      return sendResponse(res, 500, false, error.message, {
        message: error.message,
      });
    }
  };

  getCalendarIds = async (calendar, user) => {
    try {
      const response = await calendar.calendarList.list();

      const calendars = response.data.items.map((calendar) => ({
        id: calendar.id,
        summary: calendar.summary,
      }));

      const calendar_events = calendars.map((calendar) => ({
        event_id: calendar.id,
        summary: calendar.summary,
      }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
