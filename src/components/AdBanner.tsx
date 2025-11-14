'use client';
import { useEffect, useId } from 'react';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

interface AdBannerProps {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({
  adSlot,
  adFormat = 'auto',
  style = { display: 'block' },
  className,
}) => {
  const id = useId();

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // This error is common in development and can be ignored.
      if (process.env.NODE_ENV === 'development') {
        console.warn("Ad push error ignored in development:", err);
        return;
      }
      console.error("Ad push error:", err);
    }
  }, [adSlot, id]); 

  // The key prop is essential here to ensure React creates a new element on re-render.
  return (
    <div className={className} style={{ overflow: 'hidden' }} key={id}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-app-pub-3386995525015386"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdBanner;
