
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
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  useEffect(() => {
    const loadAd = () => {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error(`AdSense error for slot ${dataAdSlot}:`, err);
      }
    };

    // Use a small timeout to allow the ad container to be ready
    const timeout = setTimeout(loadAd, 50);

    return () => clearTimeout(timeout);
  }, [dataAdSlot]);

  if (!adClient) {
    return <div className={className} style={{ minHeight: '50px' }}></div>;
  }

  return (
    <div ref={adRef} className={className} style={{ minHeight: '50px', display: 'block' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></ins>
    </div>
  );
};

export default AdBanner;
