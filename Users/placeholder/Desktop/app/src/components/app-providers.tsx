
"use client";

import { useEffect } from "react";
import {
  FirebaseClientProvider,
  useAuth,
  useUser,
  initiateAnonymousSignIn,
} from "@/firebase";

function AuthHandler({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (!isUserLoading && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  return <>{children}</>;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AuthHandler>{children}</AuthHandler>
    </FirebaseClientProvider>
  );
}
