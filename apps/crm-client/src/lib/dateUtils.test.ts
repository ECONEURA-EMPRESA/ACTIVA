import { describe, it, expect } from 'vitest';
import { parseSafeDate, formatDateSafe } from './dateUtils';
import { format } from 'date-fns';

describe('dateUtils', () => {
    describe('parseSafeDate', () => {
        it('should parse valid ISO strings', () => {
            const d = parseSafeDate('2024-01-01');
            expect(d).toBeInstanceOf(Date);
            expect(d?.getFullYear()).toBe(2024);
        });

        it('should handle Javascript timestamps', () => {
            const now = Date.now();
            const d = parseSafeDate(now);
            expect(d?.getTime()).toBe(now);
        });

        it('should return null for invalid strings', () => {
            expect(parseSafeDate('invalid-date')).toBeNull();
            expect(parseSafeDate('')).toBeNull();
        });

        it('should return null for null/undefined', () => {
            expect(parseSafeDate(null)).toBeNull();
            expect(parseSafeDate(undefined)).toBeNull();
        });
    });

    describe('formatDateSafe', () => {
        it('should format valid dates correctly', () => {
            const d = '2024-01-01';
            const result = formatDateSafe(d, (date) => format(date, 'yyyy'));
            expect(result).toBe('2024');
        });

        it('should return fallback for invalid dates', () => {
            const result = formatDateSafe('bad', (date) => format(date, 'yyyy'), 'N/A');
            expect(result).toBe('N/A');
        });
    });
});
