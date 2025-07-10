
import React, { useState } from 'react';
import LegalAssistant from './LegalAssistant';
import { LegalExpertIcon } from './icons/LegalExpertIcon';

interface ExpertAnalyzerProps {
    onBackToDashboard: () => void;
}

const ExpertAnalyzer: React.FC<ExpertAnalyzerProps> = ({ onBackToDashboard }) => {
    const [policyText, setPolicyText] = useState('');
    const [showAssistant, setShowAssistant] = useState(false);

    const handleAnalyze = () => {
        // Now allows opening the assistant even with empty text
        setShowAssistant(true);
    };

    return (
        <>
            <div className="w-full bg-dark-surface p-6 sm:p-8 rounded-xl shadow-2xl border border-dark-border">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div className="flex-grow">
                        <h2 className="text-white tracking-tight text-[32px] font-bold leading-tight">Asesor Experto con IA</h2>
                        <p className="text-dark-text-secondary text-sm font-normal leading-normal mt-2">
                            Pega un documento para analizarlo, o simplemente conversa con nuestro "GuardIAn Legal" para resolver tus dudas sobre protección de datos, derechos del consumidor o ciberseguridad.
                        </p>
                    </div>
                    <button onClick={onBackToDashboard} className="flex-shrink-0 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                        Volver al Inicio
                    </button>
                </div>

                <div className="mt-6">
                    <label htmlFor="policy-text-analyzer" className="sr-only">Texto del documento (opcional)</label>
                    <textarea
                        id="policy-text-analyzer"
                        value={policyText}
                        onChange={(e) => {
                            setPolicyText(e.target.value);
                        }}
                        placeholder="Pega aquí el texto de tu política, contrato o T&C para analizar... (Opcional)"
                        className="form-input flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-xl text-dark-text-primary focus:outline-0 focus:ring-2 focus:ring-dark-accent-primary/50 border border-dark-border bg-dark-bg focus:border-dark-accent-primary placeholder:text-dark-text-secondary/70 p-[15px] text-base font-normal leading-normal transition-colors min-h-[40vh]"
                        rows={15}
                    ></textarea>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={handleAnalyze}
                        className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-xl h-12 px-6 bg-dark-accent-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
                    >
                        <LegalExpertIcon className="w-5 h-5" />
                        <span>{policyText.trim() ? 'Analizar Documento' : 'Consultar al Experto'}</span>
                    </button>
                </div>
            </div>

            {showAssistant && (
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 transition-opacity" onClick={() => setShowAssistant(false)}></div>
                    <div
                        className="fixed bottom-0 right-0 z-50 bg-dark-bg rounded-t-2xl md:rounded-xl shadow-2xl w-full sm:w-auto sm:max-w-lg md:bottom-6 md:right-6 flex flex-col h-[80vh] md:max-h-[85vh] border border-dark-border"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="assistant-title"
                    >
                        <LegalAssistant 
                            documentText={policyText} 
                            contextData={null} 
                            onClose={() => setShowAssistant(false)}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default ExpertAnalyzer;
