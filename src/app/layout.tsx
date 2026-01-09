
"use client";

import { PT_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/layout/footer";
import { AppHeader } from "@/components/layout/header";
import { GoogleScripts } from "@/components/ads/google-scripts";
import Script from "next/script";
import { useEffect, useState, useCallback, createContext, useContext } from "react";
import { FirebaseClientProvider, useAuth, useUser, initiateAnonymousSignIn } from "@/firebase";
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
});

// Create a context to hold the verification status
const RecaptchaContext = createContext({ isVerified: false });
export const useRecaptcha = () => useContext(RecaptchaContext);

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

function RecaptchaVerifier({ children }: { children: React.ReactNode }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isVerified, setIsVerified] = useState(false);

  const handleRecaptcha = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Recaptcha not yet available");
      return;
    }
    try {
      const token = await executeRecaptcha('ad_view');
      if (token) {
        setIsVerified(true);
      }
    } catch (error) {
      console.error("reCAPTCHA execution failed:", error);
    }
  }, [executeRecaptcha]);

  useEffect(() => {
    handleRecaptcha();
  }, [handleRecaptcha]);

  return (
    <RecaptchaContext.Provider value={{ isVerified }}>
      {children}
    </RecaptchaContext.Provider>
  );
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const recaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
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
              <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey ?? ""}>
                <RecaptchaVerifier>
                    <div className="flex flex-col min-h-screen">
                      <AppHeader />
                      <main className="flex-grow">{children}</main>
                      <Footer />
                    </div>
                    <Toaster />
                </RecaptchaVerifier>
              </GoogleReCaptchaProvider>
            </AuthHandler>
          </FirebaseClientProvider>
      </body>
    </html>
  );
}
