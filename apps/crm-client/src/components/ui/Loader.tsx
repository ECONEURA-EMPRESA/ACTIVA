import { Loader2 } from 'lucide-react';

export const Loader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="animate-spin text-pink-600" size={32} />
  </div>
);
