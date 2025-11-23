import { beforeEach, describe, expect, it, vi } from 'vitest';

import { download1CFile } from '@/lib/converters/to1c';
import { parseMonobankCsv, parsePrivatBankCsv } from '@/lib/parsers';

// Mock dependencies
vi.mock('@/lib/parsers');
vi.mock('@/lib/converters/to1c');
vi.mock('@/store/appStore', () => ({
    useAppStore: {
        use: {
            addToHistory: vi.fn(() => vi.fn())
        }
    }
}));

// Note: useConverter hook testing requires React Testing Library setup
// For now, we test the core logic through integration tests in ConverterPage.test.tsx
// This file serves as a placeholder for future hook-specific tests

describe('useConverter integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should export parseMonobankCsv function', () => {
        expect(parseMonobankCsv).toBeDefined();
        expect(typeof parseMonobankCsv).toBe('function');
    });

    it('should export parsePrivatBankCsv function', () => {
        expect(parsePrivatBankCsv).toBeDefined();
        expect(typeof parsePrivatBankCsv).toBe('function');
    });

    it('should export download1CFile function', () => {
        expect(download1CFile).toBeDefined();
        expect(typeof download1CFile).toBe('function');
    });
});
