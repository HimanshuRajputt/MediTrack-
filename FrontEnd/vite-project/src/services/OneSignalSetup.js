import { useEffect } from "react";

const OneSignalSetup = () => {
  useEffect(() => {
    const APP_ID = "e872011f-fd2d-4b9b-a250-81e1592a0aa8"; // Your OneSignal App ID

    if (!window.OneSignal) {
      console.error("❌ OneSignal SDK is NOT loaded.");
      return;
    }

    window.OneSignal = window.OneSignal || [];

    window.OneSignal.push(async function () {
      try {
        console.log("✅ Initializing OneSignal...");

        await window.OneSignal.init({
          appId: APP_ID,
          safari_web_id:
            "web.onesignal.auto.0b751c21-4ab5-448f-a888-cd2e20e2cfd5",
          notifyButton: { enable: true },
          allowLocalhostAsSecureOrigin: true, // Allows localhost testing
        });

        // 🔹 Get and Log Permission Status
        const permission = await window.OneSignal.getNotificationPermission();
        console.log("🔔 Notification Permission:", permission);

        // 🔹 Show Prompt if Not Already Subscribed
        if (permission !== "granted") {
          console.log("📢 Requesting Notification Permission...");
          await window.OneSignal.showSlidedownPrompt();
        }

        // 🔹 Ensure Subscription is Enabled
        const isSubscribed =
          await window.OneSignal.isPushNotificationsEnabled();
        console.log("📌 Is Subscribed?", isSubscribed);

        if (!isSubscribed) {
          console.log("🔄 Forcing Subscription...");
          await window.OneSignal.registerForPushNotifications();
        }

        // 🔹 Retrieve & Log User ID
        const userId = await window.OneSignal.getUserId();
        if (userId) {
          console.log("✅ User Registered Successfully:", userId);
        } else {
          console.log("❌ User ID Not Found. Subscription Failed.");
        }

        console.log("✅ OneSignal Initialized Successfully!");
      } catch (error) {
        console.error("❌ Error Initializing OneSignal:", error);
      }
    });
  }, []);

  return null;
};

export default OneSignalSetup;
