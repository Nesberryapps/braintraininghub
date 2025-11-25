
"use client";

import Script from 'next/script';
import { useEffect } from 'react';

export function GoogleScripts() {
  return (
    <>
      <Script
        async
        src="https://fundingchoicesmessages.google.com/i/pub-6191158195654090?ers=1"
        onLoad={() => {
            document.dispatchEvent(new CustomEvent('ump-ready'));
        }}
        />
      <Script
        id="google-adsense"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6191158195654090"
        crossOrigin="anonymous"
      />
    </>
  );
}
