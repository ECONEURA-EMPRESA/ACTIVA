import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Download, Search, Filter, Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
// Titanium Upgrade: New Controller
import { useReportController } from '../../hooks/controllers/useReportController';


export const ReportsView: React.FC = () => {
    useAuth();
    // TITANIUM CONTROLLER
    const { reports, isLoading, isError, error } = useReportController(); // Global fetch

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<string>('all');

    // Filter Logic
    const filteredReports = reports.filter(report => {
        const matchesSearch = (report.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (report.id || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || report.type === filterType;
        return matchesSearch && matchesType;
    });

    if (isLoading) return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin text-slate-400" size={32} />
        </div>
    );

    if (isError) return (
        <div className="p-8 text-center border-2 border-amber-100 bg-amber-50 rounded-2xl">
            <AlertTriangle className="mx-auto text-amber-500 mb-4" size={48} />
            <h3 className="text-lg font-bold text-amber-900">Requiere Configuración</h3>
            <p className="text-amber-700 mb-4">
                {(error as Error)?.message?.includes('Index')
                    ? 'Falta el índice "Collection Group" en Firebase. Contacta al administrador.'
                    : 'Error al cargar los informes.'}
            </p>
            <p className="text-xs font-mono text-amber-600 bg-amber-100 p-2 rounded inline-block">
                {(error as Error)?.message || 'Unknown Error'}
            </p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Informes Clínicos
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Repositorio central de documentación (Titanium View)
                    </p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                        Para crear un nuevo informe
                    </p>
                    <p className="text-sm text-slate-600">
                        Ve a la ficha del paciente &rarr; Informe
                    </p>
                </div>
            </header>

            {/* Filters & Search */}
            <Card className="p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative flex-1 w-full md:w-auto">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input
                            className="input-pro pl-10"
                            placeholder="Buscar por paciente o ref..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                        {['all', 'initial', 'evolution', 'discharge'].map(type => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px - 4 py - 2 rounded - lg text - sm font - bold transition - colors whitespace - nowrap ${filterType === type
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    } `}
                            >
                                {type === 'all' ? 'Todos' : type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* Reports List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                    <Card key={report.id} className="p-6 hover:shadow-lg transition-all group cursor-pointer border-l-4 border-l-purple-500">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <FileText size={24} />
                            </div>
                            <span className={`px - 2 py - 1 text - xs font - bold rounded uppercase ${report.status === 'final' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                } `}>
                                {report.status || 'draft'}
                            </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-lg mb-1">{report.patientName || 'Sin Nombre'}</h3>
                        <p className="text-xs text-slate-500 mb-4 font-mono">{report.id} • {report.date || 'Sin fecha'}</p>

                        <div className="space-y-2 text-sm text-slate-600 mb-6">
                            <div className="flex items-center gap-2">
                                <Filter size={14} />
                                <span className="capitalize">{report.type === 'initial' ? 'Evaluación Inicial' : report.type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={14} />
                                <span>Generado por {report.generatedBy || 'Sistema'}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" className="w-full" icon={Download}>
                                Descargar PDF
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredReports.length === 0 && (
                <div className="text-center py-20 text-slate-400">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No se encontraron informes. Los informes se crean desde la ficha del paciente.</p>
                </div>
            )}
        </div>
    );
};
