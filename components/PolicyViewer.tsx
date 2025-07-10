
import React, { useState } from 'react';
import { PolicyData } from '../types';
import LegalAssistant from './LegalAssistant';
import { LegalExpertIcon } from './icons/LegalExpertIcon';

interface PolicyViewerProps {
  policyText: string;
  policyData: PolicyData | null;
  onReset: () => void;
}

const PolicyViewer: React.FC<PolicyViewerProps> = ({ policyText, policyData, onReset }) => {
  const [copySuccess, setCopySuccess] = useState('');
  const [showAssistant, setShowAssistant] = useState(false);

  const formatPolicyText = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        line = line.trim();
        if (line.startsWith('## ')) {
          return <h3 key={index} className="text-xl font-bold mt-6 mb-2 text-dark-text-primary">{line.substring(3)}</h3>;
        }
        if (line.startsWith('# ')) {
          return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 border-b-2 border-dark-border-secondary pb-2 text-dark-text-primary">{line.substring(2)}</h2>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
            return <p key={index} className="my-2"><strong className="font-semibold text-dark-text-primary">{line.substring(2, line.length - 2)}</strong></p>;
        }
        if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.') || line.startsWith('6.') || line.startsWith('7.') || line.startsWith('8.') || line.startsWith('9.')) {
           return <p key={index} className="my-2 ml-4 text-dark-text-secondary">{line}</p>;
        }
        if (line === '') {
          return null; // Don't render empty lines as breaks
        }
        return <p key={index} className="my-4 text-dark-text-secondary">{line}</p>;
      });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(policyText).then(() => {
      setCopySuccess('¡Copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Error');
    });
  };

  const downloadHtml = () => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Política de Privacidad - ${policyData?.companyName || ''}</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #90adcb; background-color: #101a23; max-width: 800px; margin: 20px auto; padding: 0 20px; }
          h1, h2, h3 { color: #ffffff; }
          h2 { border-bottom: 2px solid #223649; padding-bottom: 10px; }
          strong { color: #ffffff; }
        </style>
      </head>
      <body>
        ${policyText.replace(/#\s/g, '<h1>').replace(/##\s/g, '<h2>').replace(/\n/g, '<br />')}
      </body>
      </html>
    `;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `politica_privacidad_${policyData?.companyName.replace(/\s+/g, '_').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className="w-full">
         <div className="flex flex-wrap gap-2 p-4">
            <span className="text-dark-text-secondary text-base font-medium leading-normal">Políticas</span>
            <span className="text-dark-text-secondary text-base font-medium leading-normal">/</span>
            <span className="text-dark-text-primary text-base font-medium leading-normal">Revisar y Publicar</span>
        </div>

        <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white tracking-tight text-[32px] font-bold leading-tight">Revisa y Publica tu Política</p>
            <p className="text-dark-text-secondary text-sm font-normal leading-normal">
                Revisa cuidadosamente la política generada para asegurarte de que refleja con precisión las prácticas de tu negocio. Puedes publicarla o consultar a nuestro experto de IA para refinarla.
            </p>
            </div>
             <div className="flex items-center gap-2">
                <button onClick={copyToClipboard} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                    {copySuccess || 'Copiar'}
                </button>
                <button onClick={downloadHtml} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                    Descargar
                </button>
                 <button onClick={onReset} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                    Empezar de Nuevo
                </button>
            </div>
        </div>

        <div className="bg-dark-surface p-6 sm:p-8 rounded-xl border border-dark-border mt-4">
          {formatPolicyText(policyText)}
        </div>

        <div className="mt-8 text-center text-sm text-yellow-300 bg-yellow-900/40 p-4 rounded-xl border border-yellow-800/50">
          <strong>Importante:</strong> Este es un documento generado automáticamente. Es fundamental que sea revisado y adaptado por un abogado para garantizar que cumple con todos los requisitos legales específicos para tu negocio y jurisdicción.
        </div>
      </div>
      
      {!showAssistant && (
        <button
          onClick={() => setShowAssistant(true)}
          className="fixed bottom-6 right-6 bg-dark-accent-primary hover:opacity-90 text-white p-4 rounded-full shadow-lg z-50 transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          aria-label="Consultar con IA Legal"
          title="Consultar con IA Legal"
        >
          <LegalExpertIcon className="w-8 h-8" />
        </button>
      )}

      {showAssistant && policyData && (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity" onClick={() => setShowAssistant(false)}></div>
            <div
                className="fixed bottom-0 right-0 z-50 bg-dark-bg rounded-t-2xl md:rounded-xl shadow-2xl w-full sm:w-auto sm:max-w-lg md:bottom-6 md:right-6 flex flex-col h-[80vh] md:max-h-[85vh] border border-dark-border"
                role="dialog"
                aria-modal="true"
                aria-labelledby="assistant-title"
            >
                <LegalAssistant documentText={policyText} contextData={policyData} onClose={() => setShowAssistant(false)} />
            </div>
        </>
      )}
    </>
  );
};

export default PolicyViewer;
