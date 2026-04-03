"use client";

import { PageType } from "@/lib/types";

interface Props {
  pageType: PageType;
  bgColor: string;
}

export default function PageBackground({ pageType, bgColor }: Props) {
  const renderPattern = () => {
    switch (pageType) {
      case "ruled":
        return (
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="ruled" x="0" y="0" width="100%" height="32" patternUnits="userSpaceOnUse">
                <line x1="0" y1="31.5" x2="100%" y2="31.5" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ruled)" />
            {/* Left margin line */}
            <line x1="48" y1="0" x2="48" y2="100%" stroke="rgba(240,100,100,0.2)" strokeWidth="1" />
          </svg>
        );

      case "dotted":
        return (
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotted" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="12" cy="12" r="1" fill="rgba(0,0,0,0.15)" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotted)" />
          </svg>
        );

      case "grid":
        return (
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        );

      case "blank":
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 rounded-sm overflow-hidden" style={{ background: bgColor }}>
      {renderPattern()}
    </div>
  );
}