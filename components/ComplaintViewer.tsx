
import React, { useState } from 'react';
import { ComplaintData } from '../types';
import LegalAssistant from './LegalAssistant';
import { LegalExpertIcon } from './icons/LegalExpertIcon';

interface ComplaintViewerProps {
  complaintText: string;
  complaintData: ComplaintData | null;
  onReset: () => void;
}

const ComplaintViewer: React.FC<ComplaintViewerProps> = ({ complaintText, complaintData, onReset }) => {
  const [copySuccess, setCopySuccess] = useState('');
  const [showAssistant, setShowAssistant] = useState(false);

  const formatComplaintText = (text: string) => {
    return text.split('\n').map((line, index) => {
      line = line.trim();
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="my-2"><strong className="font-semibold text-dark-text-primary">{line.substring(2, line.length - 2)}</strong></p>;
      }
      if (line.toLowerCase().startsWith('asunto:') || line.toLowerCase().startsWith('señores')) {
        return <p key={index} className="my-2 font-bold text-dark-text-primary">{line}</p>;
      }
      if (line.toLowerCase().startsWith('atentamente,')) {
          return <p key={index} className="mt-8 mb-2 text-dark-text-secondary">{line}</p>;
      }
      if (line === '') {
        return <br key={index} />; // Render empty lines as breaks for spacing
      }
      return <p key={index} className="my-2 text-dark-text-secondary">{line}</p>;
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(complaintText).then(() => {
      setCopySuccess('¡Copiado!');
      setTimeout(() => setCopySuccess(''), 2000);
    }, () => {
      setCopySuccess('Error');
    });
  };

  const downloadTxt = () => {
    const blob = new Blob([complaintText], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `reclamacion_${complaintData?.providerName.replace(/\s+/g, '_').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <>
      <div className="w-full">
         <div className="flex flex-wrap gap-2 p-4">
            <span className="text-dark-text-secondary text-base font-medium leading-normal">Reclamaciones</span>
            <span className="text-dark-text-secondary text-base font-medium leading-normal">/</span>
            <span className="text-dark-text-primary text-base font-medium leading-normal">Revisar y Enviar</span>
        </div>

        <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white tracking-tight text-[32px] font-bold leading-tight">Revisa tu Reclamación</p>
            <p className="text-dark-text-secondary text-sm font-normal leading-normal">
                Lee la carta generada. Puedes copiarla para enviarla por email o descargarla. Usa al experto de IA si tienes dudas sobre el contenido.
            </p>
            </div>
             <div className="flex items-center gap-2">
                <button onClick={copyToClipboard} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                    {copySuccess || 'Copiar'}
                </button>
                <button onClick={downloadTxt} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                    Descargar (.txt)
                </button>
                 <button onClick={onReset} className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                    Empezar de Nuevo
                </button>
            </div>
        </div>

        <div className="bg-dark-surface p-6 sm:p-8 rounded-xl border border-dark-border mt-4 font-mono text-sm">
          {formatComplaintText(complaintText)}
        </div>

        <div className="mt-8 text-center text-sm text-yellow-300 bg-yellow-900/40 p-4 rounded-xl border border-yellow-800/50">
          <strong>Recomendación:</strong> Guarda una copia de esta reclamación y del comprobante de envío (ej. captura de pantalla del email). El proveedor tiene 15 días hábiles para responder.
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

      {showAssistant && complaintData && (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity" onClick={() => setShowAssistant(false)}></div>
            <div
                className="fixed bottom-0 right-0 z-50 bg-dark-bg rounded-t-2xl md:rounded-xl shadow-2xl w-full sm:w-auto sm:max-w-lg md:bottom-6 md:right-6 flex flex-col h-[80vh] md:max-h-[85vh] border border-dark-border"
                role="dialog"
                aria-modal="true"
                aria-labelledby="assistant-title"
            >
                <LegalAssistant documentText={complaintText} contextData={complaintData} onClose={() => setShowAssistant(false)} />
            </div>
        </>
      )}
    </>
  );
};

export default ComplaintViewer;
