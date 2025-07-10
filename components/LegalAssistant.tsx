
import React, { useState, useEffect, useRef } from 'react';
import { PolicyData, ComplaintData, ChatMessage, Part } from '../types';
import { getChatResponse } from '../services/geminiService';
import { CloseIcon } from './icons/CloseIcon';
import { ClipIcon } from './icons/ClipIcon';

interface LegalAssistantProps {
  documentText: string;
  contextData: PolicyData | ComplaintData | null;
  onClose: () => void;
}

const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                // Return only the Base64 part
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error('Failed to read file as Base64 string.'));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};

const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('Failed to read file as text.'));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};


const LegalAssistant: React.FC<LegalAssistantProps> = ({ documentText, contextData, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initChat = async () => {
      try {
        setIsLoading(true);
        const firstMessageParts: Part[] = [{ text: "Hola, por favor preséntate y analiza el documento si se proporcionó uno." }];
        
        const responseText = await getChatResponse(
          [], // No history yet
          firstMessageParts,
          documentText,
          contextData
        );

        setMessages([{ role: 'model', text: responseText }]);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setMessages([{ role: 'model', text: "Lo siento, no pude iniciar el chat. Por favor, revisa la conexión con el servidor y vuelve a intentarlo." }]);
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, [documentText, contextData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Basic validation for supported types
      if (file.type.startsWith('image/') || file.type.startsWith('text/')) {
         setSelectedFile(file);
      } else {
        alert("Tipo de archivo no soportado. Por favor, sube una imagen o un archivo de texto.");
      }
    }
  };

  const sendMessage = async () => {
    if ((!input.trim() && !selectedFile) || isLoading) return;
    setIsLoading(true);
    
    const userMessageText = input;
    const historyForAPI = [...messages];

    const userMessageForUI: ChatMessage = { role: 'user', text: userMessageText };
    const parts: Part[] = [{ text: userMessageText }];

    if (selectedFile) {
        userMessageForUI.filePreview = { name: selectedFile.name, type: selectedFile.type };
        if (selectedFile.type.startsWith('image/')) {
            const base64Data = await readFileAsBase64(selectedFile);
            parts.push({ inlineData: { mimeType: selectedFile.type, data: base64Data } });
        } else if (selectedFile.type.startsWith('text/')) {
            const textData = await readFileAsText(selectedFile);
            parts.push({ text: `\n\n--- CONTENIDO DEL ARCHIVO ADJUNTO (${selectedFile.name}) ---\n${textData}\n--- FIN DEL ARCHIVO ---` });
        }
    }
    
    setMessages(prev => [...prev, userMessageForUI]);
    setInput('');
    setSelectedFile(null);

    try {
        const responseText = await getChatResponse(
            historyForAPI,
            parts,
            documentText,
            contextData
        );
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
        console.error("Error sending message:", error);
        setMessages(prev => [...prev, { role: 'model', text: "Lo siento, ocurrió un error al procesar tu mensaje." }]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b border-dark-border-secondary flex-shrink-0">
        <h2 id="assistant-title" className="text-lg font-bold text-white">GuardIAn Legal</h2>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-dark-surface">
          <CloseIcon className="w-6 h-6 text-dark-text-secondary" />
        </button>
      </header>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-dark-accent-primary text-white' : 'bg-dark-surface text-dark-text-secondary'}`}>
              {msg.filePreview && (
                <div className="mb-2 p-2 bg-black/20 rounded-lg border border-white/20">
                    <p className="text-xs font-bold truncate">Archivo adjunto:</p>
                    <p className="text-xs truncate">{msg.filePreview.name}</p>
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && messages.length > 0 && (
          <div className="flex justify-start">
             <div className="max-w-xs p-3 rounded-2xl bg-dark-surface text-dark-text-secondary">
               <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-dark-text-secondary rounded-full animate-pulse"></div>
                 <div className="w-2 h-2 bg-dark-text-secondary rounded-full animate-pulse [animation-delay:0.2s]"></div>
                 <div className="w-2 h-2 bg-dark-text-secondary rounded-full animate-pulse [animation-delay:0.4s]"></div>
                 <span className="text-sm">Pensando...</span>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-dark-border-secondary flex-shrink-0">
         {selectedFile && (
            <div className="mb-2 flex items-center justify-between p-2 bg-dark-surface rounded-lg">
                <span className="text-sm text-dark-text-secondary truncate">
                    {selectedFile.name}
                </span>
                <button onClick={() => setSelectedFile(null)} className="p-1 rounded-full hover:bg-dark-border">
                    <CloseIcon className="w-4 h-4 text-dark-text-secondary" />
                </button>
            </div>
        )}
        <div className="relative flex items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,text/plain,text/markdown"
          />
           <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-dark-text-secondary hover:text-white transition-colors"
                aria-label="Adjuntar archivo"
           >
                <ClipIcon className="w-6 h-6" />
           </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta aquí..."
            className="w-full flex-1 bg-transparent text-dark-text-primary placeholder-dark-text-secondary focus:outline-none resize-none max-h-32 px-3 py-2"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || (!input.trim() && !selectedFile)}
            className="ml-2 px-4 py-2 bg-dark-accent-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalAssistant;
