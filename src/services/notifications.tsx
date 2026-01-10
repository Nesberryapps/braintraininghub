'use client';

import { Capacitor } from '@capacitor/core';
import { PushNotifications, Token, PushNotificationSchema, ActionPerformed } from '@capacitor/push-notifications';
import { doc, setDoc, serverTimestamp, getFirestore, Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

let isInitialized = false;

const saveTokenToFirestore = async (auth: Auth, db: Firestore, token: string) => {
  const user = auth.currentUser;
  if (!user) {
    console.log('Cannot save token without a logged-in user.');
    return;
  }

  try {
    const tokenRef = doc(db, 'users', user.uid, 'deviceTokens', token);
    await setDoc(tokenRef, { 
      token: token,
      createdAt: serverTimestamp(),
      platform: Capacitor.getPlatform(),
    }, { merge: true });
    console.log('FCM token saved to Firestore in user subcollection');
  } catch (error) {
    console.error('Error saving FCM token to Firestore:', error);
  }
};

export const initializePushNotifications = async (auth: Auth) => {
  if (!Capacitor.isNativePlatform() || isInitialized) {
    return;
  }

  isInitialized = true;
  console.log('Initializing Push Notifications...');

  const db = getFirestore(auth.app);

  // Check permission status
  let permStatus = await PushNotifications.checkPermissions();

  // If permission is not yet determined, prompt the user
  if (permStatus.receive === 'prompt') {
    permStatus = await PushNotifications.requestPermissions();
  }

  // If permission is not granted, do not proceed
  if (permStatus.receive !== 'granted') {
    console.warn('User denied push notification permissions.');
    return;
  }

  // If permission is granted, register the device for push notifications
  await PushNotifications.register();

  // Add all the necessary event listeners
  PushNotifications.addListener('registration', (token: Token) => {
    console.log('Push registration success, token:', token.value);
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
