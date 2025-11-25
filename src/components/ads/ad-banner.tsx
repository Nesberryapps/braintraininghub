"use client";

import { useEffect, useRef } from 'react';

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
  const isAdLoaded = useRef(false);

  useEffect(() => {
    if (isAdLoaded.current) {
      return;
    }
    
    // Use an interval to check for the container's width, as it might not be available on initial render.
    const interval = setInterval(() => {
      if (adRef.current && adRef.current.offsetWidth > 0) {
        try {
          if (!isAdLoaded.current) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            isAdLoaded.current = true; // Mark as loaded
          }
        } catch (err) {
          console.error(`AdSense error for slot ${dataAdSlot}:`, err);
        }
        clearInterval(interval); // Stop checking once the ad is loaded or attempted
      }
    }, 100); // Check every 100ms

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [dataAdSlot]);

  return (
    <div ref={adRef} className={className} style={{ minHeight: '50px', display: 'block' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6191158195654090"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></ins>
    </div>
  );
};

export default AdBanner;