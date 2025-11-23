import { describe, expect, it, vi } from 'vitest';

import { BANKS } from '@/lib/constants';

import { parsePrivatBankCsv } from './privatbank';

vi.mock('jschardet', () => ({
    detect: vi.fn(() => ({ encoding: 'utf-8', confidence: 0.9 }))
}));

vi.mock('papaparse', () => ({
    parse: vi.fn((content, options) => {
        const csvContent = content as string;
        const lines = csvContent.split('\n').filter((line) => line.trim());
        // Detect delimiter (semicolon for PrivatBank, comma for others)
        const delimiter = csvContent.includes(';') ? ';' : ',';
        const rawHeaders = lines[0].split(delimiter);
        // Apply transformHeader if provided
        const transformHeader =
            (options?.transformHeader as ((h: string) => string) | undefined) ||
            ((h: string) => h.trim());
        const headers = rawHeaders.map(transformHeader);
        const rows = lines.slice(1).map((line) => {
            const values = line.split(delimiter);
            const row: Record<string, string> = {};
            headers.forEach((header, index) => {
                row[header] = values[index]?.trim() || '';
            });
            return row;
        });

        if (options?.complete) {
            options.complete({ data: rows, errors: [], meta: {} });
        }
    })
}));

describe('parsePrivatBankCsv', () => {
    it('should parse PrivatBank CSV correctly', async () => {
        const csvContent = `Дата;Час;Тип операції;Сума;Валюта;Призначення платежу;Контрагент;Рахунок контрагента;ЄДРПОУ;МФО банку;Залишок
15.01.2025;10:30:15;Витрата;-250.50;UAH;Оплата за товари;ТОВ "АТБ-Маркет";UA123456789012345678901234567890;12345678;305299;4750.00
11.01.2025;14:55:41;Надходження;15000.00;UAH;Зарплата;ТОВ "Роботодавець";UA333333333333333333333333333333;11111111;305299;7351.25`;

        const file = new File([csvContent], 'privatbank.csv', { type: 'text/csv' });

        const result = await parsePrivatBankCsv(file);

        expect(result.metadata.bankName).toBe(BANKS.PRIVATBANK);
        expect(result.transactions).toHaveLength(2);
        expect(result.transactions[0].amount).toBe(-250.5);
        expect(result.transactions[0].sender).toBe('ТОВ "АТБ-Маркет"');
        expect(result.transactions[0].edrpou).toBe('12345678');
        expect(result.transactions[1].amount).toBe(15000.0);
        expect(result.transactions[1].recipient).toBe('ТОВ "Роботодавець"');
        expect(result.transactions[1].edrpou).toBe('11111111');
    });

    it('should handle income transactions correctly', async () => {
        const csvContent = `Дата,Час,Тип операції,Сума,Валюта,Призначення платежу,Контрагент,Залишок
11.01.2025,14:55:41,Надходження,15000.00,UAH,Зарплата,ТОВ "Роботодавець",7351.25`;

        const file = new File([csvContent], 'income.csv', { type: 'text/csv' });

        const result = await parsePrivatBankCsv(file);

        expect(result.transactions[0].amount).toBe(15000.0);
        expect(result.transactions[0].recipient).toBe('ТОВ "Роботодавець"');
    });

    it('should handle expense transactions correctly', async () => {
        const csvContent = `Дата,Час,Тип операції,Сума,Валюта,Призначення платежу,Контрагент,Залишок
15.01.2025,10:30:15,Витрата,-250.50,UAH,Оплата за товари,ТОВ "АТБ-Маркет",4750.00`;

        const file = new File([csvContent], 'expense.csv', { type: 'text/csv' });

        const result = await parsePrivatBankCsv(file);

        expect(result.transactions[0].amount).toBe(-250.5);
        expect(result.transactions[0].sender).toBe('ТОВ "АТБ-Маркет"');
    });

    it('should parse transactions without counterparty correctly', async () => {
        const csvContent = `Дата,Час,Тип операції,Сума,Валюта,Призначення платежу,Залишок
15.01.2025,10:30:15,Витрата,-250.50,UAH,Оплата за товари,4750.00`;

        const file = new File([csvContent], 'no-counterparty.csv', { type: 'text/csv' });

        const result = await parsePrivatBankCsv(file);

        expect(result.transactions[0].amount).toBe(-250.5);
        expect(result.transactions[0].sender).toBeUndefined();
        expect(result.transactions[0].recipient).toBeUndefined();
    });

    it('should calculate period correctly', async () => {
        const csvContent = `Дата,Час,Тип операції,Сума,Валюта,Призначення платежу,Залишок
08.01.2025,20:15:45,Витрата,-500.00,UAH,Оплата палива,-6148.75
15.01.2025,10:30:15,Витрата,-250.50,UAH,Оплата за товари,4750.00`;

        const file = new File([csvContent], 'period.csv', { type: 'text/csv' });

        const result = await parsePrivatBankCsv(file);

        expect(result.metadata.period.start).toBe('2025-01-08T20:15:45');
        expect(result.metadata.period.end).toBe('2025-01-15T10:30:15');
    });

    it('should throw error for empty CSV', async () => {
        const csvContent = `Дата,Час,Сума`;

        const file = new File([csvContent], 'empty.csv', { type: 'text/csv' });

        await expect(parsePrivatBankCsv(file)).rejects.toThrow();
    });
});
