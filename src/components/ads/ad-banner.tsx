
"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

type AdBannerProps = {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  className?: string;
};

const AdBanner = ({
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = true,
  className = '',
}: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVerified, setIsVerified] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleRecaptcha = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Recaptcha not yet available");
      return;
    }

    try {
      const token = await executeRecaptcha('ad_view');
      // In a real app, you would send this token to your backend for verification.
      // For this implementation, we'll proceed if a token is successfully generated.
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

  useEffect(() => {
    if (!isVerified) return;

    const loadAd = () => {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error(`AdSense error for slot ${dataAdSlot}:`, err);
      }
    };

    const timeout = setTimeout(loadAd, 100);

    return () => clearTimeout(timeout);
  }, [dataAdSlot, isVerified]);

  if (!isVerified) {
    return <div className={className} style={{ minHeight: '50px', display: 'block' }}></div>;
  }

  return (
    <div ref={adRef} className={className} style={{ minHeight: '50px', display: 'block' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6191158195654090"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
        data-adtest="on" // Use "on" for testing, remove for production
      ></ins>
    </div>
  );
};

export default AdBanner;
