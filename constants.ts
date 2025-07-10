
import { WizardStep, ComplaintWizardStep } from './types';

export const WIZARD_STEPS: WizardStep[] = [
  { id: 1, title: 'Información de la Empresa', description: 'Datos del responsable del tratamiento.' },
  { id: 2, title: 'Datos y Finalidades', description: 'Tipos de datos y para qué los usas.' },
  { id: 3, title: 'Tecnologías y Transferencias', description: 'Uso de cookies y movimiento de datos.' },
  { id: 4, title: 'Generar Política', description: 'Revisa y genera tu política de privacidad.' },
];

export const DATA_TYPE_OPTIONS: string[] = [
  'Nombres y apellidos',
  'Tipo y número de identificación',
  'Fecha de nacimiento y género',
  'Dirección de residencia',
  'Números de teléfono',
  'Correo electrónico',
  'Datos de geolocalización',
  'Datos de navegación (IP, logs)',
  'Datos financieros y transaccionales',
  'Datos biométricos (ej. huella dactilar, reconocimiento facial)',
  'Información laboral o académica',
];

export const PURPOSE_OPTIONS: string[] = [
  'Gestionar la relación contractual o comercial.',
  'Realizar procesos de facturación y cobro.',
  'Enviar comunicaciones comerciales y publicidad.',
  'Realizar análisis estadísticos y de mercado.',
  'Mejorar nuestros productos y servicios.',
  'Gestionar la seguridad de nuestras instalaciones y plataformas.',
  'Dar cumplimiento a obligaciones legales y requerimientos de autoridades.',
  'Procesos de selección de personal.',
  'Personalizar la experiencia del usuario en el sitio web/app.',
];

// --- Complaint Generator Constants ---

export const COMPLAINT_WIZARD_STEPS: ComplaintWizardStep[] = [
  { id: 1, title: 'Tus Datos', description: 'Información del consumidor que reclama.' },
  { id: 2, title: 'Datos del Proveedor', description: 'Información de la empresa o persona a quien reclamas.' },
  { id: 3, title: 'Detalles del Problema', description: 'Describe el producto, servicio y el inconveniente.' },
  { id: 4, title: 'Generar Reclamación', description: 'Revisa y genera tu carta de reclamación.' },
];

export const ISSUE_TYPE_OPTIONS: string[] = [
    'Producto defectuoso o que no funciona (Garantía)',
    'Publicidad engañosa',
    'Incumplimiento de lo ofrecido',
    'Cobro indebido o facturación incorrecta',
    'Problemas con la entrega del producto',
    'Mala calidad del servicio',
    'Cláusulas abusivas en un contrato',
    'Vulneración al derecho de retracto',
    'Otro tipo de inconveniente',
];

export const CLAIM_OPTIONS: string[] = [
    'Reparación del producto',
    'Cambio del producto por uno nuevo',
    'Devolución total del dinero pagado',
    'Cumplimiento de la oferta o promoción',
    'Corrección de la factura y/o devolución de cobros indebidos',
    'Cancelación del contrato',
];
