
import React from 'react';
import { LegalExpertIcon } from './icons/LegalExpertIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { ComplaintIcon } from './icons/ComplaintIcon';
import { NotebookLMIcon } from './icons/NotebookLMIcon';
import { ComplianceIcon } from './icons/ComplianceIcon';

interface DashboardProps {
  onStartGeneration: () => void;
  onStartExpertConsultation: () => void;
  onStartComplaintGeneration: () => void;
  onStartNotebookLMImport: () => void;
  onStartComplianceAudit: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
    onStartGeneration, 
    onStartExpertConsultation,
    onStartComplaintGeneration,
    onStartNotebookLMImport,
    onStartComplianceAudit
}) => {
  return (
    <div>
        <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
            <p className="text-white tracking-tight text-[32px] font-bold leading-tight">Tu Centro de Cumplimiento Legal</p>
            <p className="text-dark-text-secondary text-sm font-normal leading-normal">
                Usa nuestras herramientas con IA para generar documentos, analizar textos y gestionar tus necesidades legales.
            </p>
            </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
                icon={<FileTextIcon className="w-8 h-8 text-dark-text-primary" />}
                title="Generador de Políticas"
                description="Crea una Política de Privacidad a la medida para tu negocio, cumpliendo con la ley colombiana."
                buttonText="Crear Política"
                onClick={onStartGeneration}
            />
             <DashboardCard
                icon={<ComplaintIcon className="w-8 h-8 text-dark-text-primary" />}
                title="Generador de Reclamaciones"
                description="Redacta una carta de reclamación formal como consumidor ante un proveedor por problemas con productos o servicios."
                buttonText="Crear Reclamación"
                onClick={onStartComplaintGeneration}
            />
             <DashboardCard
                icon={<ComplianceIcon className="w-8 h-8 text-dark-text-primary" />}
                title="Auditoría de Cumplimiento"
                description="Analiza tu sitio web para verificar su alineación con las normativas colombianas clave de privacidad y consumo."
                buttonText="Iniciar Auditoría"
                onClick={onStartComplianceAudit}
            />
            <DashboardCard
                icon={<LegalExpertIcon className="w-8 h-8 text-dark-text-primary" />}
                title="Analizador de Documentos"
                description="Pega un contrato, política o T&C para que la IA lo revise, identifique riesgos y te ofrezca sugerencias de mejora."
                buttonText="Analizar Documento"
                onClick={onStartExpertConsultation}
            />
            <DashboardCard
                icon={<NotebookLMIcon className="w-8 h-8 text-dark-text-primary" />}
                title="Conectar con NotebookLM"
                description="Importa tus notas e investigaciones desde NotebookLM para que nuestro experto legal las analice en contexto."
                buttonText="Importar Notas"
                onClick={onStartNotebookLMImport}
            />
        </div>
    </div>
  );
};

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

const DashboardCard: React.FC<CardProps> = ({ icon, title, description, buttonText, onClick }) => {
  return (
    <div className="bg-dark-surface p-6 rounded-xl flex flex-col justify-between shadow-lg border border-dark-border hover:border-dark-border-secondary transition-colors">
      <div>
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-bold text-dark-text-primary">{title}</h3>
        <p className="text-sm text-dark-text-secondary mt-2 mb-4 h-24">{description}</p>
      </div>
      <button
        onClick={onClick}
        className="mt-auto flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default Dashboard;
