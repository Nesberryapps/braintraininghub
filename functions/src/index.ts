import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

const morningMessages = [
  "Good morning! ☀️ Kickstart your day with a quick brain game.",
  "Rise and shine! A puzzle is waiting to challenge your mind.",
  "Start your day smart. A brain exercise awaits you!",
  "Morning! How about a 5-minute game to boost your focus?",
];

const eveningMessages = [
  "Time to unwind. How about a relaxing logic puzzle?",
  "Settle in for the evening with a fun brain teaser.",
  "Ready for a mental workout? A new riddle is waiting.",
  "Wind down your day with a satisfying brain game.",
];

const sendNotifications = async (messages: string[]) => {
  const tokensSnapshot = await db.collectionGroup("deviceTokens").get();

  if (tokensSnapshot.empty) {
    console.log("No device tokens found.");
    return;
  }

  const tokens = tokensSnapshot.docs.map((doc) => doc.data().token);

  if (tokens.length === 0) {
    console.log("No valid tokens to send notifications to.");
    return;
  }
  
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  const payload: admin.messaging.MessagingPayload = {
    notification: {
      title: "Brain Training Hub",
      body: randomMessage,
      sound: "default",
    },
  };

  try {
    const response = await messaging.sendToDevice(tokens, payload);
    console.log("Successfully sent message:", response);
    // You could add logic here to clean up invalid tokens from your database.
  } catch (error) {
    console.error("Error sending message:", error);
  }
};


export const sendMorningNotification = functions.pubsub
  .schedule("0 9 * * *") // Runs every day at 9:00 AM
  .timeZone("America/New_York")
  .onRun(async () => {
    console.log("Running morning notification function.");
    await sendNotifications(morningMessages);
  });


export const sendEveningNotification = functions.pubsub
  .schedule("0 20 * * *") // Runs every day at 8:00 PM (20:00)
  .timeZone("America/New_York")
  .onRun(async () => {
    console.log("Running evening notification function.");
    await sendNotifications(eveningMessages);
  });
