
import React from 'react';

interface LoaderProps {
    title?: string;
    subtitle?: string;
}

const Loader: React.FC<LoaderProps> = ({ 
    title = "Generando política, por favor espera...", 
    subtitle = "La IA está redactando tu documento." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="w-16 h-16 border-4 border-t-4 border-dark-border border-t-dark-accent-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-dark-text-primary font-semibold text-center">{title}</p>
      <p className="text-sm text-dark-text-secondary text-center">{subtitle}</p>
    </div>
  );
};

export default Loader;
