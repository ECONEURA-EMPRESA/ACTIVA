import React from 'react';
import { Patient } from '@monorepo/shared'; // Strict Import
import { User, Phone, Calendar, Music } from 'lucide-react';
import { Card } from '../../../../components/ui/Card';
import { Badge } from '../../../../components/ui/Badge';

interface PatientHeaderProps {
    patient: Patient;
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({ patient }) => {
    return (
        <Card className="p-6 border-l-4 border-l-brand-500 shadow-md">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                {/* LEFT: AVATAR & NAME */}
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                        {patient.photo ? (
                            <img src={patient.photo} alt={patient.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-8 h-8 text-slate-400" />
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant={patient.pathologyType === 'dementia' ? 'warning' : 'neutral'}>
                                {patient.diagnosis}
                            </Badge>
                            <span className="text-sm text-slate-500">
                                {patient.age} años
                            </span>
                        </div>
                    </div>
                </div>

                {/* RIGHT: STATS & META */}
                <div className="flex flex-wrap gap-6 text-sm text-slate-600">
                    <button
                        onClick={() => {
                            if (patient.contact) {
                                window.location.href = `tel:${patient.contact.replace(/\s/g, '')}`;
                            }
                        }}
                        className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer group"
                    >
                        <Phone className="w-4 h-4 text-brand-500 group-hover:text-slate-700" />
                        <span className="font-bold">{patient.contact}</span>
                    </button>
                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                        <Calendar className="w-4 h-4 text-brand-500" />
                        <span>Desde {new Date(patient.joinedDate || Date.now()).toLocaleDateString()}</span>
                    </div>
                    {patient.musicalIdentity?.likes?.[0] && (
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg">
                            <Music className="w-4 h-4 text-purple-500" />
                            <span className="truncate max-w-[150px]">{patient.musicalIdentity?.likes?.[0]}</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
