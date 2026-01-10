import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Trash2, Eye, FileImage, File, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useDocumentController } from '../../../hooks/controllers/useDocumentController'; // Titanium Controller
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const DocumentsTab: React.FC = () => {
    const { id: patientId } = useParams<{ id: string }>();
    // THE BRAIN: Titanium Controller
    const {
        documents,
        isLoading,
        uploadDocument,
        isUploading,
        deleteDocument,
        isDeleting
    } = useDocumentController(patientId);

    // UI State
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Helpers
    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await processUpload(e.target.files[0]);
        }
    };

    const processUpload = async (file: File) => {
        // Controller handles logic & feedback
        await uploadDocument(file);
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => setIsDragging(false);

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await processUpload(e.dataTransfer.files[0]);
        }
    };

    const getIcon = (mime: string) => {
        if (mime.includes('image')) return <FileImage size={20} />;
        if (mime.includes('pdf')) return <FileText size={20} />;
        return <File size={20} />;
    };

    if (!patientId) return <div>Error: No paciente ID</div>;

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* DROP ZONE */}
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${isDragging
                    ? 'border-brand-500 bg-brand-50 scale-[1.02]'
                    : 'border-slate-300 hover:bg-slate-50 bg-slate-50/50'
                    } ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,application/pdf"
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center animate-pulse">
                        <Loader2 size={32} className="text-brand-500 animate-spin mb-4" />
                        <h3 className="font-bold text-slate-800">Subiendo documento...</h3>
                        <p className="text-slate-500 text-sm">Validando integridad (ISO-5055)</p>
                    </div>
                ) : (
                    <>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${isDragging ? 'bg-white text-brand-600' : 'bg-brand-50 text-brand-500'}`}>
                            <UploadCloud size={32} />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">
                            {isDragging ? '¡Suelta el archivo aquí!' : 'Arrastra archivos aquí'}
                        </h3>
                        <p className="text-slate-500 mb-6 font-medium">Informes, DNI, analíticas (Max 10MB)</p>
                        <Button
                            variant="primary"
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                        >
                            Seleccionar Archivo
                        </Button>
                    </>
                )}
            </div>

            <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-700 uppercase text-xs tracking-wider">
                    Archivos del Expediente ({documents.length})
                </h4>
                {isLoading && <Loader2 size={16} className="animate-spin text-slate-400" />}
            </div>

            {/* LIST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((doc: import('@monorepo/shared').ClinicalDocument) => (
                    <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-brand-200 transition-all hover:shadow-md">
                        <div className="w-10 h-10 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center shrink-0">
                            {getIcon(doc.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="font-bold text-slate-800 truncate hover:text-brand-600 block">
                                {doc.name}
                            </a>
                            <p className="text-xs text-slate-400">
                                {format(new Date(doc.createdAt), "d MMM yyyy", { locale: es })} • {formatSize(doc.size)}
                            </p>
                        </div>
                        <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-slate-100 rounded text-slate-500 transition-colors"
                                title="Ver Documento"
                            >
                                <Eye size={16} />
                            </a>
                            <button
                                onClick={() => {
                                    // TODO: Replace with Titanium Modal
                                    if (confirm('⚠️ [PROTECTED] ¿Eliminar permanentemente este registro clínico?')) deleteDocument(doc);
                                }}
                                className="p-2 hover:bg-red-50 rounded text-red-500 transition-colors"
                                disabled={isDeleting}
                                title="Eliminar"
                            >
                                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </button>
                        </div>
                    </div>
                ))}

                {!isLoading && documents.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                        <File className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p className="text-sm italic">El expediente digital está vacío.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
