import { describe, expect, it } from 'vitest';

import { BANKS } from '@/constants';

import { detectBankFromStructure, validateFileStructure } from './validators';

describe('validators', () => {
    describe('detectBankFromStructure', () => {
        it('should detect Monobank structure', () => {
            const headers = ['Date', 'Time', 'Description', 'Amount', 'Balance'];
            const result = detectBankFromStructure(headers);
            expect(result).toBe(BANKS.MONOBANK);
        });

        it('should detect PrivatBank structure', () => {
            const headers = ['Дата', 'Час', 'Тип операції', 'Сума', 'Валюта', 'Призначення'];
            const result = detectBankFromStructure(headers);
            expect(result).toBe(BANKS.PRIVATBANK);
        });

        it('should detect Monobank with combined date-time field', () => {
            const headers = [
                'Дата i час операції',
                'Деталі операції',
                'Сума в валюті картки (UAH)',
                'Залишок після операції'
            ];
            const result = detectBankFromStructure(headers);
            expect(result).toBe(BANKS.MONOBANK);
        });

        it('should return null for unknown structure', () => {
            const headers = ['Column1', 'Column2', 'Column3'];
            const result = detectBankFromStructure(headers);
            expect(result).toBeNull();
        });

        it('should detect Monobank with mixed case', () => {
            const headers = ['date', 'TIME', 'Description', 'amount', 'BALANCE'];
            const result = detectBankFromStructure(headers);
            expect(result).toBe(BANKS.MONOBANK);
        });

        it('should detect PrivatBank with mixed case', () => {
            const headers = ['ДАТА', 'час', 'Тип операції', 'СУМА', 'валюта', 'Призначення'];
            const result = detectBankFromStructure(headers);
            expect(result).toBe(BANKS.PRIVATBANK);
        });
    });

    describe('validateFileStructure', () => {
        it('should validate correct Monobank file', () => {
            const headers = ['Date', 'Time', 'Description', 'Amount', 'Balance'];
            const result = validateFileStructure(headers, BANKS.MONOBANK);
            expect(result.isValid).toBe(true);
            expect(result.detectedBank).toBe(BANKS.MONOBANK);
        });

        it('should validate correct PrivatBank file', () => {
            const headers = ['Дата', 'Час', 'Тип операції', 'Сума', 'Валюта', 'Призначення'];
            const result = validateFileStructure(headers, BANKS.PRIVATBANK);
            expect(result.isValid).toBe(true);
            expect(result.detectedBank).toBe(BANKS.PRIVATBANK);
        });

        it('should validate PrivatBank file without Тип операції', () => {
            const headers = ['Дата', 'Час', 'Сума', 'Валюта', 'Призначення'];
            const result = validateFileStructure(headers, BANKS.PRIVATBANK);
            expect(result.isValid).toBe(true);
            expect(result.detectedBank).toBe(BANKS.PRIVATBANK);
        });

        it('should reject file with unknown structure', () => {
            const headers = ['Column1', 'Column2', 'Column3'];
            const result = validateFileStructure(headers, BANKS.MONOBANK);
            expect(result.isValid).toBe(false);
            expect(result.detectedBank).toBeNull();
            expect(result.error).toContain('Не вдалося визначити банк');
        });

        it('should reject Monobank file when PrivatBank is selected', () => {
            const headers = ['Date', 'Time', 'Description', 'Amount', 'Balance'];
            const result = validateFileStructure(headers, BANKS.PRIVATBANK);
            expect(result.isValid).toBe(false);
            expect(result.detectedBank).toBe(BANKS.MONOBANK);
            expect(result.error).toContain('виписка Monobank');
            expect(result.error).toContain('вибрано PrivatBank');
        });

        it('should reject PrivatBank file when Monobank is selected', () => {
            const headers = ['Дата', 'Час', 'Тип операції', 'Сума', 'Валюта', 'Призначення'];
            const result = validateFileStructure(headers, BANKS.MONOBANK);
            expect(result.isValid).toBe(false);
            expect(result.detectedBank).toBe(BANKS.PRIVATBANK);
            expect(result.error).toContain('виписка PrivatBank');
            expect(result.error).toContain('вибрано Monobank');
        });
    });
});
