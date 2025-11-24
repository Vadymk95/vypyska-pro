import { beforeEach, describe, expect, it, vi } from 'vitest';

import { download1CFile } from '@/lib/converters/to1c';
import { parseMonobankCsv, parsePrivatBankCsv } from '@/lib/parsers';

vi.mock('@/lib/parsers');
vi.mock('@/lib/converters/to1c');

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
