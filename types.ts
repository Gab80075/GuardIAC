
export interface PolicyData {
  companyName: string;
  companyId: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  dataTypes: string[];
  purposes: string[];
  usesCookies: boolean;
  cookieDetails: string;
  internationalTransfers: boolean;
  transferCountries: string;
  automatedDecisions: boolean;
  automatedDecisionDetails: string;
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
}

export interface ComplaintData {
  consumerName: string;
  consumerId: string;
  consumerAddress: string;
  consumerEmail: string;
  consumerPhone: string;
  providerName: string;
  providerNit: string;
  providerAddress: string;
  productOrService: string;
  purchaseDate: string;
  issueType: string[];
  claimType: string;
  facts: string;
}

export interface ComplaintWizardStep {
  id: number;
  title: string;
  description: string;
}

export interface User {
  name: string;
  email: string;
}

export interface ClientRecord extends User {
  loggedInAt: number;
}

export interface AuditFinding {
  area: string;
  severity: 'Crítico' | 'Alto' | 'Medio' | 'Bajo';
  description: string;
  recommendation: string;
  legalBasis: string;
}

export interface PositivePoint {
  point: string;
  description: string;
}

export interface AuditReport {
  summary: string;
  positivePoints: PositivePoint[];
  findings: AuditFinding[];
  nextSteps: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  filePreview?: {
    name: string;
    type: string;
  };
}

/**
 * Represents a single part of a multi-modal message.
 * This is used to send text, images, or other data to the model.
 * It's defined locally to decouple the frontend from the @google/genai SDK.
 */
export type Part = {
    text: string;
} | {
    inlineData: {
        mimeType: string;
        data: string; // base64 encoded string
    };
};
