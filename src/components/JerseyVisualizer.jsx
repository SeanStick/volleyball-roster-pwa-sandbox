import React from 'react';

export default function JerseyVisualizer({
  number = 0,
  name = '',
  position = '',
  isCaptain = false,
  isLibero = false,
  primaryColor = '#ff6b35',
  secondaryColor = '#1e3a8a',
  size = 140
}) {
  const jerseyColor = isLibero ? '#7c3aed' : primaryColor;
  const trimColor = isLibero ? '#f59e0b' : secondaryColor;
  const textColor = '#ffffff';

  const displayName = name ? name.toUpperCase() : 'SPIKER';
  const displayNum = number !== undefined && number !== null && number !== '' ? number : '00';

  return (
    <div style={{ width: size, height: size * 1.1 }} className="jersey-svg-wrap">
      <svg
        viewBox="0 0 200 220"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))' }}
      >
        <defs>
          <linearGradient id={`jersey-grad-${isLibero ? 'lib' : 'norm'}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={jerseyColor} />
            <stop offset="100%" stopColor={isLibero ? '#4c1d95' : '#c2410c'} />
          </linearGradient>
          <linearGradient id="fabric-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Jersey Body Silhouette */}
        <path
          d="M 65 20 
             C 80 35, 120 35, 135 20 
             L 185 45 
             L 165 95 
             L 145 80 
             L 145 200 
             C 145 205, 140 210, 135 210 
             L 65 210 
             C 60 210, 55 205, 55 200 
             L 55 80 
             L 35 95 
             L 15 45 
             Z"
          fill={`url(#jersey-grad-${isLibero ? 'lib' : 'norm'})`}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Fabric Shading Texture */}
        <path
          d="M 65 20 C 80 35, 120 35, 135 20 L 185 45 L 165 95 L 145 80 L 145 200 L 55 200 L 55 80 L 35 95 L 15 45 Z"
          fill="url(#fabric-highlight)"
        />

        {/* Collar Trim */}
        <path
          d="M 65 20 C 80 35, 120 35, 135 20 C 120 45, 80 45, 65 20 Z"
          fill={trimColor}
          stroke="#ffffff"
          strokeWidth="1"
        />

        {/* Side / Sleeve Athletic Stripes */}
        <path d="M 15 45 L 35 95 L 42 90 L 25 43 Z" fill={trimColor} opacity="0.9" />
        <path d="M 185 45 L 165 95 L 158 90 L 175 43 Z" fill={trimColor} opacity="0.9" />

        {/* Side Rib Panels */}
        <path d="M 55 80 L 62 80 L 62 205 L 55 200 Z" fill={trimColor} opacity="0.75" />
        <path d="M 145 80 L 138 80 L 138 205 L 145 200 Z" fill={trimColor} opacity="0.75" />

        {/* Player Name on Upper Back / Chest */}
        <text
          x="100"
          y="75"
          fontFamily="'Plus Jakarta Sans', sans-serif"
          fontSize="11"
          fontWeight="800"
          letterSpacing="1.5"
          fill={textColor}
          textAnchor="middle"
          opacity="0.95"
        >
          {displayName}
        </text>

        {/* Jersey Number */}
        <text
          x="100"
          y="142"
          fontFamily="'Chakra Petch', 'Impact', sans-serif"
          fontSize="56"
          fontWeight="900"
          fill="#ffffff"
          stroke="#0f172a"
          strokeWidth="2.5"
          paintOrder="stroke fill"
          textAnchor="middle"
          letterSpacing="-1"
        >
          {displayNum}
        </text>

        {/* Captain Bar Under Number */}
        {isCaptain && (
          <rect
            x="75"
            y="155"
            width="50"
            height="5"
            rx="2.5"
            fill="#f59e0b"
            stroke="#ffffff"
            strokeWidth="0.5"
          />
        )}

        {/* Bottom Brand / League Tag */}
        <rect x="70" y="195" width="60" height="8" rx="2" fill="rgba(0, 0, 0, 0.4)" />
        <text
          x="100"
          y="201"
          fontFamily="system-ui, sans-serif"
          fontSize="5.5"
          fontWeight="800"
          fill="#ffffff"
          textAnchor="middle"
          letterSpacing="0.5"
        >
          {isLibero ? 'LIBERO • FIVB' : 'GO STAND OVER THERE'}
        </text>
      </svg>
    </div>
  );
}
