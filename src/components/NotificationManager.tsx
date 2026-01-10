
'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { AdMob } from '@capacitor-community/admob';

// This component is responsible for managing push notification permissions and tokens.
export function NotificationManager() {

  useEffect(() => {
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
      AdMob.requestTrackingAuthorization().then(res => {
        console.log('AdMob tracking authorization:', res);
      });
    }
  }, []);

  // This component does not render anything.
  return null;
}
