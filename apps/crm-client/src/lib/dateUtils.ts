import { isValid, parseISO } from 'date-fns';

/**
 * Safely parses any input into a Date object or null.
 * Prevents RangeError: Invalid time value crashes.
 */
export const parseSafeDate = (date: unknown): Date | null => {
    if (date === null || date === undefined) return null;

    // 1. If already a Date
    if (date instanceof Date) {
        return isValid(date) ? date : null;
    }

    // 2. If Timestamp (number)
    if (typeof date === 'number') {
        const d = new Date(date);
        return isValid(d) ? d : null;
    }

    // 3. If String
    if (typeof date === 'string') {
        // 3a. Try ISO Standard
        const iso = parseISO(date);
        if (isValid(iso)) return iso;

        // 3b. Try constructing (for other formats browsers support)
        const d = new Date(date);
        if (isValid(d)) return d;
    }

    return null;
};

/**
 * Formats a date safely, returning a fallback if invalid.
 */
export const formatDateSafe = (date: unknown, formatter: (d: Date) => string, fallback: string = ''): string => {
    const d = parseSafeDate(date);
    if (!d) return fallback;
    try {
        return formatter(d);
    } catch {
        return fallback;
    }
};
