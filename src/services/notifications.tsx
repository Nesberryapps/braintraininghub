'use client';

import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

// Initialize Firebase and get the necessary services
const { auth, firestore: db } = initializeFirebase();

let isInitialized = false;

// Function to save or update the FCM token in Firestore
const saveTokenToFirestore = async (token: string) => {
  const user = auth.currentUser;
  if (!user) {
    console.log('Cannot save token without a logged-in user.');
    return;
  }

  try {
    const tokenRef = doc(db, 'fcmTokens', user.uid);
    await setDoc(tokenRef, { 
      token: token,
      createdAt: serverTimestamp(),
      platform: Capacitor.getPlatform(),
    }, { merge: true });
    console.log('FCM token saved to Firestore');
  } catch (error) {
    console.error('Error saving FCM token to Firestore:', error);
  }
};

export const initializePushNotifications = async () => {
  if (!Capacitor.isNativePlatform() || isInitialized) {
    return;
  }

  isInitialized = true;
  console.log('Initializing Push Notifications...');

  // 1. Request permission
  const permStatus = await PushNotifications.requestPermissions();

  if (permStatus.receive === 'granted') {
    // 2. Register the device
    await PushNotifications.register();
  } else {
    console.warn('User denied push notification permissions.');
  }

  // 3. Add listeners for events

  // On successful registration, get the token
  PushNotifications.addListener('registration', (token: Token) => {
    console.log('Push registration success, token:', token.value);
    saveTokenToFirestore(token.value);
  });

  // On registration error
  PushNotifications.addListener('registrationError', (error: any) => {
    console.error('Error on registration:', JSON.stringify(error));
  });

  // When a notification is received while the app is in the foreground
  PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
    console.log('Push received:', notification);
    // You could show a toast or an in-app message here
  });

  // When a user taps on a notification
  PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
    console.log('Push action performed:', notification);
    // You can navigate to a specific screen here, e.g.:
    // window.location.href = notification.notification.data.url;
  });
};
