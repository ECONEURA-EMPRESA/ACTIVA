import { create } from 'zustand';

interface QuickAppointmentState {
    isOpen: boolean;
    mode: 'existing' | 'new';
    open: (mode: 'existing' | 'new') => void;
    close: () => void;
}

interface GroupSessionState {
    isOpen: boolean;
    mode: 'schedule' | 'evolution';
    initialGroupName?: string;
    data?: any; // New Field
    open: (initialGroupName?: string, mode?: 'schedule' | 'evolution', data?: any) => void;
    close: () => void;
}

interface UIStore {
    quickAppointment: QuickAppointmentState;
    groupSession: GroupSessionState;
    isSidebarOpen: boolean;
    toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    quickAppointment: {
        isOpen: false,
        mode: 'existing',
        open: (mode) => set((state: UIStore) => ({
            quickAppointment: { ...state.quickAppointment, isOpen: true, mode }
        })),
        close: () => set((state: UIStore) => ({
            quickAppointment: { ...state.quickAppointment, isOpen: false }
        })),
    },
    groupSession: {
        isOpen: false,
        mode: 'evolution',
        initialGroupName: undefined,
        data: undefined,
        open: (initialGroupName?: string, mode: 'schedule' | 'evolution' = 'evolution', data?: any) => set((state: UIStore) => ({
            groupSession: { ...state.groupSession, isOpen: true, initialGroupName, mode, data }
        })),
        close: () => set((state: UIStore) => ({
            groupSession: { ...state.groupSession, isOpen: false, initialGroupName: undefined, mode: 'evolution', data: undefined }
        })),
    },
    isSidebarOpen: true,
    toggleSidebar: () => set((state: UIStore) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
