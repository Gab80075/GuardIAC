

import React, { useState, useEffect } from 'react';
import { ComplaintData, User } from '../types';
import { COMPLAINT_WIZARD_STEPS, ISSUE_TYPE_OPTIONS, CLAIM_OPTIONS } from '../constants';
import { generateComplaintLetter } from '../services/geminiService';
import Loader from './Loader';

interface ComplaintGeneratorProps {
  currentUser: User;
  onComplaintGenerated: (complaint: string, data: ComplaintData) => void;
  onGenerationStart: () => void;
  isLoading: boolean;
  onBackToDashboard: () => void;
}

const initialFormData: ComplaintData = {
  consumerName: '',
  consumerId: '',
  consumerAddress: '',
  consumerEmail: '',
  consumerPhone: '',
  providerName: '',
  providerNit: '',
  providerAddress: '',
  productOrService: '',
  purchaseDate: '',
  issueType: [],
  claimType: '',
  facts: '',
};

const ComplaintGenerator: React.FC<ComplaintGeneratorProps> = ({ currentUser, onComplaintGenerated, onGenerationStart, isLoading, onBackToDashboard }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ComplaintData>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Pre-fill form with logged-in user's data
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        consumerName: currentUser.name || '',
        consumerEmail: currentUser.email || ''
      }));
    }
  }, [currentUser]);

  const handleNext = () => {
    if (currentStep < COMPLAINT_WIZARD_STEPS.length) {
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (value: string) => {
    setFormData(prev => {
      const currentValues = prev.issueType || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, issueType: newValues };
    });
  };

  const handleSubmit = async () => {
    setError(null);
    onGenerationStart();
    try {
      const complaintText = await generateComplaintLetter(formData);
      onComplaintGenerated(complaintText, formData);
    } catch (err) {
      setError('Ocurrió un error al generar la reclamación. Por favor, inténtalo de nuevo.');
      console.error(err);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h3 className="text-xl font-bold text-dark-text-primary mb-1">Información del Consumidor</h3>
            <p className="text-dark-text-secondary mb-6">Tus datos como reclamante. Serán usados para identificarte en la carta.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Nombre Completo" name="consumerName" value={formData.consumerName} onChange={handleChange} required />
                <InputField label="Número de Cédula" name="consumerId" value={formData.consumerId} onChange={handleChange} required />
                <InputField label="Dirección de Notificación" name="consumerAddress" value={formData.consumerAddress} onChange={handleChange} required />
                <InputField label="Correo Electrónico" name="consumerEmail" type="email" value={formData.consumerEmail} onChange={handleChange} required />
                <InputField label="Teléfono de Contacto" name="consumerPhone" type="tel" value={formData.consumerPhone} onChange={handleChange} />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-xl font-bold text-dark-text-primary mb-1">Información del Proveedor</h3>
            <p className="text-dark-text-secondary mb-6">Datos de la empresa, establecimiento o persona a quien le vas a reclamar.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Nombre de la Empresa o Proveedor" name="providerName" value={formData.providerName} onChange={handleChange} required />
                <InputField label="NIT del Proveedor (si lo conoces)" name="providerNit" value={formData.providerNit} onChange={handleChange} />
                <InputField label="Dirección del Proveedor" name="providerAddress" value={formData.providerAddress} onChange={handleChange} required />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <InputField label="Producto o Servicio Adquirido" name="productOrService" value={formData.productOrService} onChange={handleChange} required />
            <InputField label="Fecha de la Compra" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} required />
             <div>
              <h3 className="text-lg font-semibold mb-3 text-dark-text-primary">¿Cuál es el problema principal?</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 rounded-lg">
                {ISSUE_TYPE_OPTIONS.map(option => (
                  <CheckboxField key={option} label={option} checked={formData.issueType.includes(option)} onChange={() => handleMultiSelectChange(option)} />
                ))}
              </div>
            </div>
             <div>
              <h3 className="text-lg font-semibold mb-3 text-dark-text-primary">¿Qué solicitas al proveedor (pretensión)?</h3>
              <div className="space-y-2">
                {CLAIM_OPTIONS.map(option => (
                    <RadioField key={option} label={option} name="claimType" value={option} checked={formData.claimType === option} onChange={handleChange} />
                ))}
              </div>
            </div>
            <TextareaField label="Describe los hechos" name="facts" value={formData.facts} onChange={handleChange} required placeholder="Relata de forma clara y cronológica lo que sucedió..." />
          </div>
        );
      case 4:
        return (
          <div className="text-center py-8">
            <h3 className="text-3xl font-bold text-dark-text-primary mb-4">¡Listo para generar tu reclamación!</h3>
            <p className="text-dark-text-secondary mb-8 max-w-2xl mx-auto">Nuestra IA redactará una carta formal basada en la Ley 1480 de 2011 con la información que proporcionaste. Recuerda que este es un borrador que puedes ajustar.</p>
            {isLoading ? <Loader /> : (
              <button onClick={handleSubmit} className="flex mx-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-8 bg-dark-accent-primary text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
                Generar Reclamación
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
            {COMPLAINT_WIZARD_STEPS.map((step, index) => (
                <div key={step.id} className={`flex-1 text-center ${index < COMPLAINT_WIZARD_STEPS.length -1 ? 'relative' : ''}`}>
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
                    {index < COMPLAINT_WIZARD_STEPS.length - 1 && (
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
        {currentStep < COMPLAINT_WIZARD_STEPS.length && (
          <button onClick={handleNext} disabled={isLoading} className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity disabled:opacity-50">
            Siguiente
          </button>
        )}
      </div>
    </div>
  );
};


// Helper components for form fields (re-used from Wizard.tsx with slight adaptations)
const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-dark-text-secondary mb-2">{label}{props.required && <span className="text-red-400">*</span>}</label>
        <input {...props} className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-dark-text-primary focus:outline-0 focus:ring-2 focus:ring-dark-accent-primary/50 border border-dark-border bg-dark-surface focus:border-dark-accent-primary placeholder:text-dark-text-secondary/70 p-[15px] text-base font-normal leading-normal transition-colors" />
    </div>
);

const TextareaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-dark-text-secondary mb-2">{label}{props.required && <span className="text-red-400">*</span>}</label>
        <textarea {...props} rows={5} className="form-input flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-xl text-dark-text-primary focus:outline-0 focus:ring-2 focus:ring-dark-accent-primary/50 border border-dark-border bg-dark-surface focus:border-dark-accent-primary placeholder:text-dark-text-secondary/70 p-[15px] text-base font-normal leading-normal transition-colors" />
    </div>
);

const CheckboxField: React.FC<{ label: string, checked: boolean, onChange: () => void }> = ({ label, checked, onChange }) => (
    <label className="flex items-center space-x-3 p-3 bg-dark-bg/50 hover:bg-dark-accent-secondary/50 rounded-lg cursor-pointer transition-colors border border-dark-border">
        <input type="checkbox" checked={checked} onChange={onChange} className="h-5 w-5 rounded border-dark-border text-dark-accent-primary bg-dark-surface focus:ring-dark-accent-primary/50" />
        <span className="text-sm text-dark-text-secondary">{label}</span>
    </label>
);

const RadioField: React.FC<{ label: string, name: string, value: string, checked: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, name, value, checked, onChange }) => (
    <label className="flex items-center space-x-3 p-3 bg-dark-bg/50 hover:bg-dark-accent-secondary/50 rounded-lg cursor-pointer transition-colors border border-dark-border">
        <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="h-5 w-5 border-dark-border text-dark-accent-primary bg-dark-surface focus:ring-dark-accent-primary/50" />
        <span className="text-sm text-dark-text-secondary">{label}</span>
    </label>
);

export default ComplaintGenerator;
