'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getApp } from 'firebase/app';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    const services = initializeFirebase();
    
    if (typeof window !== 'undefined') {
      const app = getApp();
      const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (reCaptchaKey) {
          try {
              initializeAppCheck(app, {
                  provider: new ReCaptchaV3Provider(reCaptchaKey),
                  isTokenAutoRefreshEnabled: true,
              });
          } catch (e) {
              console.error("App Check initialization failed.", e);
          }
      } else {
          console.warn("reCAPTCHA Site Key not found. App Check will not be enabled.");
      }
    }

    return services;
  }, []); 

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
