'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { useUser, useFirestore } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';

// This component is responsible for managing push notification permissions and tokens.
export function NotificationManager() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    // Wait until we know who the user is and ensure we're on a native platform.
    if (isUserLoading || !user || !Capacitor.isNativePlatform()) {
      return;
    }

    const registerNotifications = async () => {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        // User denied permissions, we can't do anything.
        console.log('User denied push notification permissions.');
        return;
      }

      // On success, we should be able to receive notifications.
      // Now, register with FCM to get a token.
      await PushNotifications.register();
    };

    const addListeners = async () => {
      // On success, we should be ableto receive notifications
      await PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
        // Save the token to Firestore
        if (user) {
            const tokenRef = doc(firestore, `users/${user.uid}/deviceTokens/${token.value}`);
            setDocumentNonBlocking(tokenRef, {
                token: token.value,
                platform: Capacitor.getPlatform(),
                createdAt: new Date().toISOString(),
            }, { merge: true });
        }
      });

      // Some issue with our setup and push will not work
      await PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });
    };

    registerNotifications();
    addListeners();

    // Clean up listeners on component unmount
    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [user, isUserLoading, firestore]);

  // This component does not render anything.
  return null;
}
