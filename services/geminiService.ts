import { PolicyData, ComplaintData, AuditReport, ChatMessage, Part } from '../types';

const BACKEND_API_BASE_URL = "https://guardianova-backend-api-865832184036.us-west1.run.app";

export const generatePolicy = async (data: PolicyData): Promise<string> => {
    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/policy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`La llamada a la API falló: ${response.status} ${errorText}`);
        }
        const result = await response.json();
        if (typeof result.text !== 'string') {
            throw new Error("Respuesta inesperada del servidor.");
        }
        return result.text;
    } catch (error) {
        console.error("Error llamando a la API de generación de políticas:", error);
        throw new Error("No se pudo generar la política desde el servicio de IA.");
    }
};

export const getChatResponse = async (
    history: ChatMessage[],
    newMessage: Part[],
    documentText: string,
    contextData: PolicyData | ComplaintData | null
): Promise<string> => {
  try {
    const requestBody = {
      history: history,
      message: newMessage,
      document: documentText,
      context: contextData,
    };

    const response = await fetch(`${BACKEND_API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(`Error ${response.status}: ${errorData.message || 'Error desconocido del backend'}`);
    }

    const data = await response.json();
    if (typeof data.reply !== 'string') {
        throw new Error("Respuesta inesperada del servidor. El campo 'reply' no fue encontrado o no es un texto.");
    }
    return data.reply;

  } catch (error) {
    console.error("Error en getChatResponse:", error);
    throw new Error(`Fallo al obtener respuesta del asistente: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

export const generateComplaintLetter = async (data: ComplaintData): Promise<string> => {
    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/complaint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`La llamada a la API falló: ${response.status} ${errorText}`);
        }
        const result = await response.json();
        if (typeof result.text !== 'string') {
            throw new Error("Respuesta inesperada del servidor.");
        }
        return result.text;
    } catch (error) {
        console.error("Error llamando a la API de generación de reclamaciones:", error);
        throw new Error("No se pudo generar la carta de reclamación desde el servicio de IA.");
    }
};

export const runComplianceAudit = async (url: string): Promise<{ report: AuditReport; sources: any[] }> => {
    try {
        const response = await fetch(`${BACKEND_API_BASE_URL}/api/audit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`La llamada a la API falló: ${response.status} ${errorText}`);
        }
        const result = await response.json();
        if (!result || typeof result.report !== 'object' || !Array.isArray(result.sources)) {
            throw new Error("Respuesta inesperada del servidor de auditoría.");
        }
        return result;
    } catch (error) {
        console.error("Error llamando a la API de auditoría:", error);
        throw new Error("No se pudo completar la auditoría desde el servicio de IA.");
    }
};