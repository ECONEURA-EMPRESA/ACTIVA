import React, { useRef, useState } from 'react';
import ReactSignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/Button';
import { Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
    onSave: (dataUrl: string) => void;
    onClear?: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onClear }) => {
    const sigCanvas = useRef<ReactSignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const clear = () => {
        sigCanvas.current?.clear();
        setIsEmpty(true);
        onClear?.();
    };

    const save = () => {
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
            onSave(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
        }
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-slate-200 border-dashed rounded-xl overflow-hidden bg-slate-50 relative group hover:border-pink-300 transition-colors">
                <ReactSignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{
                        className: 'w-full h-48 cursor-crosshair',
                        style: { width: '100%', height: '200px' }
                    }}
                    onBegin={() => setIsEmpty(false)}
                />
                {isEmpty && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 font-bold text-sm uppercase tracking-widest">
                        Firme Aquí
                    </div>
                )}
            </div>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" icon={Eraser} onClick={clear}>
                    Borrar
                </Button>
                <Button variant="primary" size="sm" icon={Check} onClick={save} disabled={isEmpty}>
                    Guardar Firma
                </Button>
            </div>
        </div>
    );
};
