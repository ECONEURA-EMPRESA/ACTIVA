import { render, screen, fireEvent } from '@testing-library/react';
import { SessionsManager } from './SessionsManager';
import { Patient, GroupSession } from '../../lib/types';
import { describe, it, expect, vi } from 'vitest';

// MOCK DATA
const mockPatients: Patient[] = [
    {
        id: 'p1',
        name: 'Juan Perez',
        diagnosis: 'Alzheimer',
        age: 72,
        pathologyType: 'dementia',
        sessionsCompleted: 12,
        sessions: [
            {
                id: 's1',
                date: '2023-10-01',
                time: '10:00',
                type: 'individual',
                notes: 'Individual 1',
                price: 50,
                paid: false,
                billable: true,
                isAbsent: false,
                activities: []
            }
        ]
    },
    {
        id: 'p2',
        name: 'Maria Garcia',
        diagnosis: 'Parkinson',
        age: 68,
        pathologyType: 'neuro',
        sessionsCompleted: 8,
        sessions: [
            {
                id: 's2',
                date: '2023-10-02',
                time: '11:00',
                type: 'individual',
                notes: 'Individual 2',
                price: 50,
                paid: true,
                billable: true,
                isAbsent: false,
                activities: []
            }
        ]
    }
];

const mockGroupSessions: GroupSession[] = [
    {
        id: 'g1',
        groupName: 'Taller Memoria',
        date: '2023-10-03',
        time: '16:00',
        phase: 1,
        activities: [],
        location: 'Sala 1',
        type: 'group',
        participantNames: ['Juan Perez'],
        price: 20,
        paid: false,
        observations: 'Grupo 1'
    }
];

// TESTS
describe('SessionsManager Logic', () => {
    // 1. RENDER & FILTERING
    it('renders individual sessions by default', () => {
        render(
            <SessionsManager
                patients={mockPatients}
                onUpdatePatient={vi.fn()}
                filterMode="individual"
            />
        );
        expect(screen.getByText('Juan Perez')).toBeTruthy();
        expect(screen.getByText('Maria Garcia')).toBeTruthy();
        expect(screen.queryByText('Taller Memoria')).toBeNull();
    });

    it('renders group sessions when mode is group', () => {
        render(
            <SessionsManager
                patients={mockPatients}
                groupSessions={mockGroupSessions}
                onUpdatePatient={vi.fn()}
                filterMode="group"
            />
        );
        expect(screen.getByText('Taller Memoria')).toBeTruthy();
        expect(screen.queryByText('Maria Garcia')).toBeNull();
    });

    // 2. SEARCH LOGIC (Strict Typing Check)
    it('filters individual sessions by patient name', () => {
        render(
            <SessionsManager
                patients={mockPatients}
                onUpdatePatient={vi.fn()}
            />
        );
        const input = screen.getByPlaceholderText('Buscar...');
        fireEvent.change(input, { target: { value: 'Juan' } });

        expect(screen.getByText('Juan Perez')).toBeTruthy();
        expect(screen.queryByText('Maria Garcia')).toBeNull();
    });

    it('filters individual sessions by notes (strict access)', () => {
        render(
            <SessionsManager
                patients={mockPatients}
                onUpdatePatient={vi.fn()}
            />
        );
        const input = screen.getByPlaceholderText('Buscar...');
        fireEvent.change(input, { target: { value: 'Individual 2' } });

        expect(screen.getByText('Maria Garcia')).toBeTruthy();
        expect(screen.queryByText('Juan Perez')).toBeNull();
    });

    // 3. ADAPTER LOGIC (Implicit)
    it('sorts sessions by date descending', () => {
        render(
            <SessionsManager
                patients={mockPatients}
                onUpdatePatient={vi.fn()}
            />
        );

        const names = screen.getAllByRole('heading', { level: 4 });
        // S2 (Maria) is Oct 2nd, S1 (Juan) is Oct 1st. Descending -> Maria First.
        expect(names[0].textContent).toContain('Maria Garcia');
        expect(names[1].textContent).toContain('Juan Perez');
    });
});
