'use client';

import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { doc, setDoc, serverTimestamp, getFirestore, Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

let isInitialized = false;

// This function now accepts auth and db instances
const saveTokenToFirestore = async (auth: Auth, db: Firestore, token: string) => {
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

// This function now accepts the auth instance to derive other services
export const initializePushNotifications = async (auth: Auth) => {
  if (!Capacitor.isNativePlatform() || isInitialized) {
    return;
  }

  isInitialized = true;
  console.log('Initializing Push Notifications...');

  const db = getFirestore(auth.app);

  const permStatus = await PushNotifications.requestPermissions();

  if (permStatus.receive === 'granted') {
    await PushNotifications.register();
  } else {
    console.warn('User denied push notification permissions.');
  }

  PushNotifications.addListener('registration', (token: Token) => {
    console.log('Push registration success, token:', token.value);
    // Pass the auth and db instances to the save function
    saveTokenToFirestore(auth, db, token.value);
  });

  PushNotifications.addListener('registrationError', (error: any) => {
    console.error('Error on registration:', JSON.stringify(error));
  });

  PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
    console.log('Push received:', notification);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
    console.log('Push action performed:', notification);
  });
};
