
"use client";

import Script from 'next/script';

export function GoogleScripts() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  if (!pubId) {
    return null;
  }

  return (
    <>
      <Script
        async
        src={`https://fundingchoicesmessages.google.com/i/${pubId}?ers=1`}
        onLoad={() => {
            document.dispatchEvent(new CustomEvent('ump-ready'));
        }}
        />
      <Script
        id="google-adsense"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
        crossOrigin="anonymous"
      />
    </>
  );
}
