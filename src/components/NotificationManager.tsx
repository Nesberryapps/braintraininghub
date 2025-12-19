
'use client';

import { useEffect } from 'react';
import { Capacitor, App as CapacitorApp } from '@capacitor/core';
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
    
    // --- Define functions to be called by listeners ---
    const addListeners = async () => {
      await PushNotifications.addListener('registration', (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
        if (user) {
            const tokenRef = doc(firestore, `users/${user.uid}/deviceTokens/${token.value}`);
            setDocumentNonBlocking(tokenRef, {
                token: token.value,
                platform: Capacitor.getPlatform(),
                createdAt: new Date().toISOString(),
            }, { merge: true });
        }
      });

      await PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration: ' + JSON.stringify(error));
      });
    };

    const registerNotifications = async () => {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.log('User denied push notification permissions.');
        return;
      }
      
      await PushNotifications.register();
    };

    // --- Safer initialization ---
    // Only run registration logic once the app is fully active.
    CapacitorApp.addListener('appStateChange', (state) => {
        if (state.isActive) {
            registerNotifications();
        }
    });

    addListeners();

    // Clean up listeners on component unmount
    return () => {
        PushNotifications.removeAllListeners().catch(err => console.error("Could not remove all listeners", err));
        CapacitorApp.removeAllListeners().catch(err => console.error("Could not remove all listeners", err));
    };
  }, [user, isUserLoading, firestore]);

  // This component does not render anything.
  return null;
}
