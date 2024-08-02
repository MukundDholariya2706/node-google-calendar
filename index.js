require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const app = express();
const rootRouter = require("./routes/route");
const loggerMiddleware = require("./middleware/loggerMiddleware");

const port = process.env.PORT || 3001;
const URL = process.env.URL || "localhost"

// DB connection
require("./config/dbConnection");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// const oauth2Client = new google.auth.OAuth2(
//   process.env.GOOGLE_CLIENT_ID,
//   process.env.GOOGLE_CLIENT_SECRET,
//   process.env.GOOGLE_REDIRECT_URL
// );

// app.get("/auth-url", (req, res) => {
//   const authUrl = oauth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: ["https://www.googleapis.com/auth/calendar.readonly"],
//   });
//   res.send({ authUrl });
// });

// refreshAccessTokenIfNeeded = async (oAuth2Client, activity_data) => {
//   try {
//     const { credentials } = await oAuth2Client.refreshAccessToken();
//     console.log(credentials, "credentials");

//     oAuth2Client.setCredentials(credentials);
//   } catch (error) {
//     console.error("Error refreshing access token:", error);
//     throw new Error("Error refreshing access token");
//   }
// };

// app.post("/oauth2callback", async (req, res) => {
//   const { code } = req.body;

//   try {
//     const { tokens } = await oauth2Client.getToken(code);
//     oauth2Client.setCredentials(tokens);

//     await refreshAccessTokenIfNeeded(oauth2Client, {
//       refresh_token: tokens?.refresh_token,
//     });

//     res.status(200).send(payload);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// app.get("/oauth2callback", async (req, res) => {
//   const { code } = req.query;
//   try {
//     const { tokens } = await oauth2Client.getToken(code);

//     oauth2Client.setCredentials(tokens);

//     await refreshAccessTokenIfNeeded(oauth2Client, {
//       refresh_token: tokens?.refresh_token,
//     });

//     const calendar = google.calendar({ version: "v3", auth: oauth2Client });

//     // Define multiple calendar IDs
//     const calendarIds = [
//       "primary", // User's primary calendar
//       "en-gb.indian#holiday@group.v.calendar.google.com", // Example for US holidays
//       // Add more calendar IDs here as needed
//     ];

//     // Function to fetch events from a single calendar
//     const fetchEventsFromCalendar = (calendarId) => {
//       return new Promise((resolve, reject) => {
//         calendar.events.list(
//           {
//             calendarId: calendarId,
//             timeMin: new Date().toISOString(),
//             maxResults: 10,
//             singleEvents: true,
//             orderBy: "startTime",
//           },
//           (err, response) => {
//             if (err) return reject(err);
//             resolve(response.data.items);
//           }
//         );
//       });
//     };

//     // Fetch events from all specified calendars in parallel
//     const allEventsPromises = calendarIds.map(fetchEventsFromCalendar);

//     try {
//       const allEvents = await Promise.all(allEventsPromises);
//       // Flatten the array of arrays into a single array of events
//       const flattenedEvents = allEvents.flat();
//       res.send(flattenedEvents);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       res.status(500).send(error);
//     }
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// Ṃiddleware
app.use(loggerMiddleware);

// Routes
app.use(rootRouter);

app.listen(port, () => {
  console.log(`Server is running on http://${URL}:${port}`);
});
