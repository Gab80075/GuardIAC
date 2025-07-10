
import React, { useState } from 'react';
import { runComplianceAudit } from '../services/geminiService';
import { AuditReport, AuditFinding } from '../types';
import Loader from './Loader';
import { ComplianceIcon } from './icons/ComplianceIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface ComplianceAuditProps {
    onBackToDashboard: () => void;
}

const SeverityBadge: React.FC<{ severity: AuditFinding['severity'] }> = ({ severity }) => {
    const severityClasses = {
        'Crítico': 'bg-red-700 text-white',
        'Alto': 'bg-orange-500 text-white',
        'Medio': 'bg-yellow-500 text-black',
        'Bajo': 'bg-blue-400 text-white',
    };
    return (
        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${severityClasses[severity]}`}>
            {severity}
        </span>
    );
};


const ComplianceAudit: React.FC<ComplianceAuditProps> = ({ onBackToDashboard }) => {
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [report, setReport] = useState<AuditReport | null>(null);
    const [sources, setSources] = useState<any[] | null>(null);

    const handleAudit = async () => {
        if (!url.trim()) {
            setError('Por favor, ingresa una URL válida.');
            return;
        }
        let formattedUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            formattedUrl = `https://${url}`;
        }

        setIsLoading(true);
        setError(null);
        setReport(null);
        setSources(null);

        try {
            const result = await runComplianceAudit(formattedUrl);
            setReport(result.report);
            setSources(result.sources);
        } catch (e: any) {
            setError(e.message || 'Ocurrió un error inesperado.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetAudit = () => {
        setUrl('');
        setReport(null);
        setSources(null);
        setError(null);
        setIsLoading(false);
    };

    const renderInitialView = () => (
        <div className="w-full bg-dark-surface p-6 sm:p-8 rounded-xl shadow-2xl border border-dark-border">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div className="flex-grow">
                    <h2 className="text-white tracking-tight text-[32px] font-bold leading-tight">Auditoría de Cumplimiento</h2>
                    <p className="text-dark-text-secondary text-sm font-normal leading-normal mt-2">
                        Ingresa la URL de tu sitio web para que "Auditor GuardIAn" realice un análisis de cumplimiento de alto nivel.
                    </p>
                </div>
                <button onClick={onBackToDashboard} className="flex-shrink-0 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                    Volver al Inicio
                </button>
            </div>
            <div className="mt-8 space-y-6">
                 <div className="relative">
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.tuempresa.com"
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-dark-text-primary focus:outline-0 focus:ring-2 focus:ring-dark-accent-primary/50 border border-dark-border bg-dark-bg focus:border-dark-accent-primary placeholder:text-dark-text-secondary/70 p-[15px] text-base font-normal leading-normal transition-colors pr-12"
                    />
                     <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                        <kbd className="inline-flex items-center rounded border border-dark-border-secondary px-2 font-sans text-sm font-medium text-dark-text-secondary">
                          Enter
                        </kbd>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleAudit}
                        disabled={isLoading}
                        className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center overflow-hidden rounded-xl h-12 px-6 bg-dark-accent-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <ComplianceIcon className="w-5 h-5" />
                        <span>Comenzar Auditoría</span>
                    </button>
                </div>
                {error && <p className="text-red-400 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
    
    const renderReportView = () => (
        report && (
            <div className="w-full">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-white tracking-tight text-[32px] font-bold leading-tight">Reporte de Auditoría</h2>
                        <p className="text-dark-text-secondary text-sm font-normal leading-normal mt-1 break-all">Para: {url}</p>
                    </div>
                     <button onClick={resetAudit} className="flex-shrink-0 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                        Nueva Auditoría
                    </button>
                </div>

                <div className="bg-dark-surface p-6 sm:p-8 rounded-xl border border-dark-border">
                    <h3 className="text-xl font-bold text-dark-text-primary mb-2">Resumen General</h3>
                    <p className="text-dark-text-secondary mb-8">{report.summary}</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-dark-text-primary mb-4">Puntos Positivos</h3>
                            <div className="space-y-4">
                                {report.positivePoints.length > 0 ? report.positivePoints.map((item, index) => (
                                    <div key={index} className="p-4 bg-dark-accent-secondary/30 border border-dark-border-secondary rounded-lg">
                                        <p className="font-semibold text-dark-text-primary">{item.point}</p>
                                        <p className="text-sm text-dark-text-secondary mt-1">{item.description}</p>
                                    </div>
                                )) : <p className="text-sm text-dark-text-secondary">No se identificaron puntos positivos destacados.</p>}
                            </div>
                        </div>
                         <div>
                            <h3 className="text-lg font-bold text-dark-text-primary mb-4">Próximos Pasos</h3>
                            <ul className="space-y-3 list-disc list-inside text-dark-text-secondary">
                                {report.nextSteps.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-dark-text-primary mb-4">Hallazgos y Recomendaciones</h3>
                         <div className="space-y-4">
                            {report.findings.length > 0 ? report.findings.map((finding, index) => (
                                <div key={index} className="p-4 bg-dark-bg/50 border border-dark-border rounded-lg">
                                    <div className="flex flex-wrap items-center gap-4 mb-2">
                                        <h4 className="text-md font-semibold text-dark-text-primary flex-grow">{finding.area}</h4>
                                        <SeverityBadge severity={finding.severity} />
                                    </div>
                                    <p className="text-sm text-dark-text-secondary mb-3"><strong className="text-dark-text-secondary/80">Descripción:</strong> {finding.description}</p>
                                    <p className="text-sm text-green-400 bg-green-900/30 p-3 rounded-md"><strong className="text-green-300">Recomendación:</strong> {finding.recommendation}</p>
                                    <p className="text-xs text-dark-text-secondary/70 mt-3 font-mono">Base Legal: {finding.legalBasis}</p>
                                </div>
                            )) : <p className="text-sm text-dark-text-secondary">¡Excelente! No se encontraron hallazgos críticos de incumplimiento.</p>}
                        </div>
                    </div>
                    
                    {sources && sources.length > 0 && (
                        <div className="mt-8 pt-4 border-t border-dark-border-secondary">
                           <h4 className="text-md font-bold text-dark-text-primary mb-3">Fuentes Consultadas</h4>
                           <div className="flex flex-wrap gap-2">
                            {sources.map((source, index) => (
                                source.web && (
                                    <a 
                                        key={index}
                                        href={source.web.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs bg-dark-accent-secondary hover:bg-dark-border text-dark-text-secondary px-2 py-1 rounded-md transition-colors"
                                        title={source.web.title}
                                    >
                                        <span>{source.web.title || new URL(source.web.uri).hostname}</span>
                                        <ExternalLinkIcon className="w-3 h-3" />
                                    </a>
                                )
                            ))}
                           </div>
                        </div>
                    )}
                </div>
            </div>
        )
    );

    if (isLoading) {
        return <Loader title="Realizando auditoría en tu sitio web..." subtitle="La IA está analizando políticas, términos y cookies. Esto puede tardar un momento." />;
    }

    if (report) {
        return renderReportView();
    }

    return renderInitialView();
};

export default ComplianceAudit;
