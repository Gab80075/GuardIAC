
import React, { useState } from 'react';
import { PolicyData } from '../types';
import { WIZARD_STEPS, DATA_TYPE_OPTIONS, PURPOSE_OPTIONS } from '../constants';
import { generatePolicy } from '../services/geminiService';
import Loader from './Loader';

interface WizardProps {
  onPolicyGenerated: (policy: string, data: PolicyData) => void;
  onGenerationStart: () => void;
  isLoading: boolean;
  onBackToDashboard: () => void;
}

const initialFormData: PolicyData = {
  companyName: '',
  companyId: '',
  companyAddress: '',
  companyEmail: '',
  companyPhone: '',
  dataTypes: [],
  purposes: [],
  usesCookies: false,
  cookieDetails: '',
  internationalTransfers: false,
  transferCountries: '',
  automatedDecisions: false,
  automatedDecisionDetails: '',
};

const Wizard: React.FC<WizardProps> = ({ onPolicyGenerated, onGenerationStart, isLoading, onBackToDashboard }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PolicyData>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBackToDashboard();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelectChange = (collection: keyof PolicyData, value: string) => {
    setFormData(prev => {
      const currentValues = (prev[collection] as string[]) || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [collection]: newValues };
    });
  };

  const handleSubmit = async () => {
    setError(null);
    onGenerationStart();
    try {
      const policyText = await generatePolicy(formData);
      onPolicyGenerated(policyText, formData);
    } catch (err) {
      setError('Ocurrió un error al generar la política. Por favor, inténtalo de nuevo.');
      console.error(err);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-bold text-dark-text-primary mb-1">Información de la Empresa</h3>
            <p className="text-dark-text-secondary mb-6">Estos datos identificarán a tu empresa como la responsable del tratamiento de datos.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Nombre de la Empresa o Razón Social" name="companyName" value={formData.companyName} onChange={handleChange} required />
                <InputField label="NIT o Documento de Identificación" name="companyId" value={formData.companyId} onChange={handleChange} required />
                <InputField label="Dirección Física Principal" name="companyAddress" value={formData.companyAddress} onChange={handleChange} required />
                <InputField label="Correo Electrónico de Contacto (Privacidad)" name="companyEmail" type="email" value={formData.companyEmail} onChange={handleChange} required />
                <InputField label="Teléfono de Contacto" name="companyPhone" type="tel" value={formData.companyPhone} onChange={handleChange} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-dark-text-primary">¿Qué tipos de datos personales recopilas?</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2 rounded-lg">
                {DATA_TYPE_OPTIONS.map(option => (
                  <CheckboxField key={option} label={option} checked={formData.dataTypes.includes(option)} onChange={() => handleMultiSelectChange('dataTypes', option)} />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-dark-text-primary">¿Con qué finalidades tratas los datos?</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {PURPOSE_OPTIONS.map(option => (
                  <CheckboxField key={option} label={option} checked={formData.purposes.includes(option)} onChange={() => handleMultiSelectChange('purposes', option)} />
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <SwitchField label="¿Utilizas cookies u otras tecnologías de rastreo en tu sitio web o aplicación?" name="usesCookies" checked={formData.usesCookies} onChange={handleChange} />
            {formData.usesCookies && <TextareaField label="Describe brevemente para qué usas las cookies" name="cookieDetails" value={formData.cookieDetails} onChange={handleChange} />}
            <SwitchField label="¿Realizas transferencias internacionales de datos personales?" name="internationalTransfers" checked={formData.internationalTransfers} onChange={handleChange} />
            {formData.internationalTransfers && <InputField label="¿A qué países o jurisdicciones?" name="transferCountries" value={formData.transferCountries} onChange={handleChange} placeholder="Ej: Estados Unidos, Unión Europea" />}
            <SwitchField label="¿Utilizas sistemas para tomar decisiones automatizadas sobre las personas (ej. perfilamiento)?" name="automatedDecisions" checked={formData.automatedDecisions} onChange={handleChange} />
            {formData.automatedDecisions && <TextareaField label="Describe brevemente cómo funcionan estas decisiones automatizadas" name="automatedDecisionDetails" value={formData.automatedDecisionDetails} onChange={handleChange} />}
          </div>
        );
      case 4:
        return (
          <div className="text-center py-8">
            <h3 className="text-3xl font-bold text-dark-text-primary mb-4">¡Estás listo para generar tu política!</h3>
            <p className="text-dark-text-secondary mb-8 max-w-2xl mx-auto">Revisa los pasos anteriores si es necesario. Al hacer clic en "Generar Política", nuestra IA creará un documento borrador basado en tus respuestas. Recuerda que este documento debe ser revisado por un profesional legal.</p>
            {isLoading ? <Loader /> : (
              <button onClick={handleSubmit} className="flex mx-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-dark-accent-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
                Generar Política de Privacidad
              </button>
            )}
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-dark-surface p-6 sm:p-8 rounded-xl shadow-2xl border border-dark-border w-full">
      <div className="mb-8">
        <div className="flex justify-between mb-2">
            {WIZARD_STEPS.map((step, index) => (
                <div key={step.id} className={`flex-1 text-center ${index < WIZARD_STEPS.length -1 ? 'relative' : ''}`}>
                    <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 font-bold
                        ${currentStep > step.id ? 'bg-dark-accent-primary text-white' : ''}
                        ${currentStep === step.id ? 'bg-dark-accent-primary text-white scale-110 ring-4 ring-dark-accent-primary/30' : ''}
                        ${currentStep < step.id ? 'bg-dark-accent-secondary text-dark-text-secondary' : ''}`}
                    >
                        {currentStep > step.id ? '✓' : step.id}
                    </div>
                    <p className={`mt-2 text-xs sm:text-sm font-semibold transition-colors duration-300 ${currentStep >= step.id ? 'text-dark-text-primary' : 'text-dark-text-secondary'}`}>
                        {step.title}
                    </p>
                    {index < WIZARD_STEPS.length - 1 && (
                      <div className={`absolute top-5 left-1/2 w-full h-0.5 
                        ${currentStep > step.id ? 'bg-dark-accent-primary' : 'bg-dark-accent-secondary'}`}>
                      </div>
                    )}
                </div>
            ))}
        </div>
      </div>

      <div className="py-8 min-h-[300px]">
        {renderStep()}
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-dark-border">
        <button onClick={handlePrev} disabled={isLoading} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors disabled:opacity-50">
          {currentStep === 1 ? 'Volver al Inicio' : 'Anterior'}
        </button>
        {currentStep < WIZARD_STEPS.length && (
          <button onClick={handleNext} disabled={isLoading} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity disabled:opacity-50">
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
};


// Helper components for form fields
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-dark-text-secondary mb-2">{label}{props.required && <span className="text-red-400">*</span>}</label>
        <input {...props} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-dark-text-primary focus:outline-0 focus:ring-2 focus:ring-dark-accent-primary/50 border border-dark-border bg-dark-surface focus:border-dark-accent-primary placeholder:text-dark-text-secondary/70 p-[15px] text-base font-normal leading-normal transition-colors" />
    </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-dark-text-secondary mb-2">{label}</label>
        <textarea {...props} rows={4} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-dark-text-primary focus:outline-0 focus:ring-2 focus:ring-dark-accent-primary/50 border border-dark-border bg-dark-surface focus:border-dark-accent-primary placeholder:text-dark-text-secondary/70 p-[15px] text-base font-normal leading-normal transition-colors" />
    </div>
);

const CheckboxField: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-3 p-3 bg-dark-bg/50 hover:bg-dark-accent-secondary/50 rounded-lg cursor-pointer transition-colors border border-dark-border">
        <input type="checkbox" checked={checked} onChange={onChange} className="h-5 w-5 rounded border-dark-border text-dark-accent-primary bg-dark-surface focus:ring-dark-accent-primary/50" />
        <span className="text-sm text-dark-text-secondary">{label}</span>
    </label>
);

const SwitchField: React.FC<{ label: string, name: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, name, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-xl border border-dark-border">
        <span className="text-sm font-medium text-dark-text-secondary">{label}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name={name} checked={checked} onChange={onChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-dark-accent-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dark-accent-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dark-accent-primary"></div>
        </label>
    </div>
);


export default Wizard;