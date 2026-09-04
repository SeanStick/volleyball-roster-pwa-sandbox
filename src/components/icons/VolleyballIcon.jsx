import React from 'react';

export default function VolleyballIcon({ size = 16, color = 'currentColor', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m18 15-6-3" />
      <path d="m20.3 8-7 3.5" />
      <path d="m6 9 6 3" />
      <path d="m3.7 16 7-3.5" />
      <path d="m15 6-3 6" />
      <path d="m8 3.7 3.5 7" />
    </svg>
  );
}
