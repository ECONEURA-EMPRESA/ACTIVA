export const queryKeys = {
    patients: {
        all: ['patients'] as const,
        lists: () => [...queryKeys.patients.all, 'list'] as const,
        list: (filters: string) => [...queryKeys.patients.lists(), { filters }] as const,
        details: () => [...queryKeys.patients.all, 'detail'] as const,
        detail: (id: string | number) => [...queryKeys.patients.details(), id] as const,
        documents: (patientId: string | number) => [...queryKeys.patients.detail(patientId), 'documents'] as const,
    },
    settings: {
        all: ['settings'] as const,
        resource: (resourceName: string) => [...queryKeys.settings.all, resourceName] as const,
    },
    sessions: {
        all: ['sessions'] as const,
        byRange: (start: string, end: string) => [...queryKeys.sessions.all, { start, end }] as const,
    },
    reports: {
        all: ['reports'] as const,
        byPatient: (patientId: string | number) => [...queryKeys.reports.all, { patientId }] as const,
    },
};
