
import React, { useState, useEffect } from 'react';
import { ClientRecord } from '../types';

interface ClientManagerProps {
    onBackToDashboard: () => void;
}

const ClientManager: React.FC<ClientManagerProps> = ({ onBackToDashboard }) => {
    const [records, setRecords] = useState<ClientRecord[]>([]);

    useEffect(() => {
        const storedRecordsJSON = localStorage.getItem('clientRecords');
        if (storedRecordsJSON) {
            setRecords(JSON.parse(storedRecordsJSON));
        }
    }, []);

    const handleExportCSV = () => {
        if (records.length === 0) return;

        const headers = "Nombre,Correo Electrónico,Fecha de Ingreso\n";
        const csvContent = records
            .map(r => `"${r.name}","${r.email}","${new Date(r.loggedInAt).toLocaleString('es-CO')}"`)
            .join("\n");
        
        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "registro_clientes_guardiac.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleClearRecords = () => {
        if (window.confirm('¿Estás seguro de que quieres borrar permanentemente todo el registro de clientes? Esta acción no se puede deshacer.')) {
            localStorage.removeItem('clientRecords');
            setRecords([]);
        }
    };

    return (
        <div className="w-full bg-dark-surface p-6 sm:p-8 rounded-xl shadow-2xl border border-dark-border">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div className="flex-grow">
                    <h2 className="text-white tracking-tight text-[32px] font-bold leading-tight">Registro de Clientes</h2>
                    <p className="text-dark-text-secondary text-sm font-normal leading-normal mt-2">
                        Visualiza, exporta o gestiona los registros de acceso de los usuarios a la plataforma.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={onBackToDashboard} className="flex-shrink-0 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-secondary hover:bg-dark-border text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors">
                        Volver al Inicio
                    </button>
                    <button onClick={handleExportCSV} disabled={records.length === 0} className="flex-shrink-0 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-dark-accent-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity disabled:opacity-50">
                        Exportar a CSV
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="tracking-wider border-b border-dark-border-secondary uppercase">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Correo Electrónico</th>
                            <th scope="col" className="px-6 py-3">Fecha de Ingreso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.length > 0 ? (
                            records.map((record, index) => (
                                <tr key={index} className="border-b border-dark-border-secondary/50 hover:bg-dark-accent-secondary/20 transition-colors">
                                    <td className="px-6 py-4 font-medium">{record.name}</td>
                                    <td className="px-6 py-4 text-dark-text-secondary">{record.email}</td>
                                    <td className="px-6 py-4 text-dark-text-secondary">{new Date(record.loggedInAt).toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' })}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="text-center py-10 text-dark-text-secondary">
                                    No hay registros de clientes todavía.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

             <div className="mt-8 flex justify-end">
                <button
                    onClick={handleClearRecords}
                    disabled={records.length === 0}
                    className="text-red-500 hover:text-red-400 text-sm font-medium disabled:opacity-50 transition-colors"
                >
                    Borrar todos los registros
                </button>
            </div>
        </div>
    );
};

export default ClientManager;
