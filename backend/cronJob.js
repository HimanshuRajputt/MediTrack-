import cron from "node-cron";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

// Function to check subscribed users
const getSubscribedUsers = async () => {
  try {
    const response = await axios.get(
      `https://onesignal.com/api/v1/players?app_id=${ONESIGNAL_APP_ID}`,
      {
        headers: { Authorization: `Basic ${ONESIGNAL_API_KEY}` },
      }
    );

    const subscribedUsers = response.data.players.filter(
      (user) => user.notification_types !== -2
    );
    return subscribedUsers.length;
  } catch (error) {
    console.error(
      "❌ Error fetching subscribed users:",
      error.response?.data || error.message
    );
    return 0;
  }
};

// Function to send push notification
const sendNotification = async (message) => {
  try {
    const totalUsers = await getSubscribedUsers();

    if (totalUsers === 0) {
      console.log(
        "❌ No users are subscribed to push notifications. Skipping..."
      );
      return;
    }

    console.log(
      `✅ Found ${totalUsers} subscribed users. Sending notification...`
    );

    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: ONESIGNAL_APP_ID,
        included_segments: ["All"],
        headings: { en: "🔥 Important Reminder!" }, // Send to all subscribed users
        contents: { en: message },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        },
      }
    );

    console.log("✅ Notification Sent Successfully:", response.data);
  } catch (error) {
    console.error(
      "❌ Error Sending Notification:",
      error.response?.data || error.message
    );
  }
};

// Schedule the cron job to run every 10 minutes
// cron.schedule("0 */4 * * *", async () => {
  // Every 4 hour
  // cron.schedule("0 8,12,18 * * *", async () => {
  //Send Notification at 8 AM, 12 PM, and 6 PM
  cron.schedule("*/10 * * * * *", async () => {
  // every 5 second
  console.log(
    "⏳ Checking for subscribed users before sending notification..."
  );
  await sendNotification("📢 Medication Reminder: Don't forget to check your Medication schedule!");
});
