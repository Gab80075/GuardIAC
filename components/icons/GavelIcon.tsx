import React from 'react';

export const GavelIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="m14 14-7 7"/>
        <path d="M18 10 7.5 20.5"/>
        <path d="m16 16 6 6"/>
        <path d="M10 10a3 3 0 0 0-4.24-2.83 3 3 0 0 0-2.83 4.24l8.49 8.49A3 3 0 0 0 14.24 17a3 3 0 0 0 2.83-4.24Z"/>
        <path d="m14.24 17 8.49-8.49a3 3 0 0 0-4.24-4.24l-8.49 8.49a3 3 0 0 0 4.24 4.24Z"/>
  </svg>
);
