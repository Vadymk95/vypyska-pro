import { describe, expect, it, vi } from 'vitest';

import { BANKS } from '@/constants';

import { parseMonobankCsv } from './monobank';

vi.mock('jschardet', () => ({
    detect: vi.fn(() => ({ encoding: 'utf-8', confidence: 0.9 }))
}));

vi.mock('papaparse', () => ({
    parse: vi.fn((content, options) => {
        const csvContent = content as string;
        const lines = csvContent.split('\n').filter((line) => line.trim());
        const headers = lines[0].split(',');
        const rows = lines.slice(1).map((line) => {
            const values = line.split(',');
            const row: Record<string, string> = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index]?.trim() || '';
            });
            return row;
        });

        if (options?.complete) {
            options.complete({ data: rows, errors: [], meta: {} });
        }
    })
}));

describe('parseMonobankCsv', () => {
    it('should parse Monobank CSV with Date,Time,Statement format correctly', async () => {
        const csvContent = `Date,Time,Statement,Amount,Currency,Balance,Description,MCC,Transaction ID,Card Number
2025-01-15,10:30:15,Списание,-250.50,UAH,4750.00,Покупка в магазині АТБ,5411,1234567890abcdef1234567890abcdef1234,5168********1234
2025-01-14,18:45:22,Списание,-500.00,UAH,5000.50,Переказ на картку,,234567890abcdef1234567890abcdef1234,5168********1234`;

        const file = new File([csvContent], 'monobank.csv', { type: 'text/csv' });

        const result = await parseMonobankCsv(file);

        expect(result.metadata.bankName).toBe(BANKS.MONOBANK);
        expect(result.transactions).toHaveLength(2);
        expect(result.transactions[0].amount).toBe(-250.5);
        expect(result.transactions[0].description).toBe('Покупка в магазині АТБ');
        expect(result.transactions[0].balance).toBe(4750.0);
    });

    it('should parse Monobank CSV with statementDate format correctly', async () => {
        const csvContent = `account,statementDate,statementTime,reference,description,mcc,amount,currency,balance,comment
2600xxxxxxxxxx1234,2025-11-20,09:15:30,TRN123456789,"Оплата за услуги от ООО ""Партнер""",8999,5000.00,UAH,55000.00,Оплата по договору №123
2600xxxxxxxxxx1234,2025-11-21,11:45:10,TRN987654321,Налоги и сборы,9311,-1500.00,UAH,53500.00,Уплата единого налога`;

        const file = new File([csvContent], 'monobank-fop.csv', { type: 'text/csv' });

        const result = await parseMonobankCsv(file);

        expect(result.metadata.bankName).toBe(BANKS.MONOBANK);
        expect(result.transactions).toHaveLength(2);
        expect(result.transactions[0].amount).toBe(5000.0);
        expect(result.transactions[1].amount).toBe(-1500.0);
    });

    it('should handle income transactions correctly', async () => {
        const csvContent = `Date,Time,Statement,Amount,Currency,Balance,Description
2025-01-11,14:55:41,Пополнение,15000.00,UAH,7351.25,Зарплата`;

        const file = new File([csvContent], 'income.csv', { type: 'text/csv' });

        const result = await parseMonobankCsv(file);

        expect(result.transactions[0].amount).toBe(15000.0);
    });

    it('should handle expense transactions correctly', async () => {
        const csvContent = `Date,Time,Statement,Amount,Currency,Balance,Description
2025-01-15,10:30:15,Списание,-250.50,UAH,4750.00,Покупка в магазині АТБ`;

        const file = new File([csvContent], 'expense.csv', { type: 'text/csv' });

        const result = await parseMonobankCsv(file);

        expect(result.transactions[0].amount).toBe(-250.5);
    });

    it('should calculate period correctly', async () => {
        const csvContent = `Date,Time,Statement,Amount,Currency,Balance,Description
2025-01-08,20:15:45,Списание,-500.00,UAH,-6148.75,Покупка палива
2025-01-15,10:30:15,Списание,-250.50,UAH,4750.00,Покупка в магазині АТБ`;

        const file = new File([csvContent], 'period.csv', { type: 'text/csv' });

        const result = await parseMonobankCsv(file);

        expect(result.metadata.period.start).toBe('2025-01-08T20:15:45');
        expect(result.metadata.period.end).toBe('2025-01-15T10:30:15');
    });

    it('should throw error for empty CSV', async () => {
        const csvContent = `Date,Time,Amount`;

        const file = new File([csvContent], 'empty.csv', { type: 'text/csv' });

        await expect(parseMonobankCsv(file)).rejects.toThrow();
    });
});
