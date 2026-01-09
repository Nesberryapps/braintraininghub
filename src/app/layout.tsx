
"use client";

import { PT_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";
import { AppHeader } from "@/components/layout/header";
import { GoogleScripts } from "@/components/ads/google-scripts";
import Script from "next/script";
import { useEffect } from "react";
import { FirebaseClientProvider, useAuth, useUser, initiateAnonymousSignIn } from "@/firebase";
import { initializePushNotifications } from "@/services/notifications"; // Import the new service

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

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

// New Initializer component
function Initializer() {
  useEffect(() => {
    initializePushNotifications();
  }, []);

  return null; // This component doesn't render anything
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Brain Training Hub</title>
        <meta name="description" content="A clean, modern brain exercise app." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="google-adsense-account" content="ca-pub-619115654090" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <GoogleScripts />
        {/* Google tag (gtag.js) */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17507715969"></Script>
        <Script id="google-ads-config">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17507715969');
          `}
        </Script>
      </head>
      <body className={cn("font-body antialiased", ptSans.variable)}>
          <FirebaseClientProvider>
            <AuthHandler>
              <Initializer /> {/* Add the initializer */}
              <div className="flex flex-col min-h-screen">
                <AppHeader />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </AuthHandler>
          </FirebaseClientProvider>
      </body>
    </html>
  );
}
