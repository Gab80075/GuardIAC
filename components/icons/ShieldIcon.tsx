
import React from 'react';

export const DiamondIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    {...props}
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
  </svg>
);

// Kept original export name to avoid breaking imports, but it's the DiamondIcon now.
export { DiamondIcon as ShieldIcon };
