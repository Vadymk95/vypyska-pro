import { describe, expect, it, vi } from 'vitest';

import { BANKS, DEFAULT_CURRENCY } from '@/constants';
import type { ParseResult } from '@/types';

import { generate1CTxt, generate1CXml } from './to1c';

vi.mock('file-saver', () => ({
    saveAs: vi.fn()
}));

const mockParseResult: ParseResult = {
    transactions: [
        {
            date: '2025-01-15T10:30:15',
            amount: -250.5,
            currency: 'UAH',
            description: 'Покупка в магазині АТБ',
            balance: 4750.0,
            sender: 'ТОВ "АТБ-Маркет"',
            id: '2025-01-15T10:30:15_-250.5'
        },
        {
            date: '2025-01-11T14:55:41',
            amount: 15000.0,
            currency: 'UAH',
            description: 'Зарплата',
            balance: 7351.25,
            recipient: 'ТОВ "Роботодавець"',
            id: '2025-01-11T14:55:41_15000'
        }
    ],
    metadata: {
        bankName: BANKS.MONOBANK,
        accountCurrency: DEFAULT_CURRENCY,
        period: {
            start: '2025-01-11T14:55:41',
            end: '2025-01-15T10:30:15'
        }
    }
};

describe('generate1CXml', () => {
    it('should generate valid XML structure', () => {
        const xml = generate1CXml(mockParseResult);

        expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
        expect(xml).toContain('<КлієнтБанкОбмін>');
        expect(xml).toContain('<ЗагальніВідомості>');
        expect(xml).toContain('<Виписка>');
        expect(xml).toContain('</КлієнтБанкОбмін>');
    });

    it('should include all required metadata', () => {
        const xml = generate1CXml(mockParseResult);

        expect(xml).toContain('<ВерсіяФормату>1.02</ВерсіяФормату>');
        expect(xml).toContain('<Відправник>Vypyska.pro</Відправник>');
        expect(xml).toContain('<ДатаПочатку>');
        expect(xml).toContain('<ДатаКінця>');
        expect(xml).toContain(`<РозрахунковийРахунок>${BANKS.MONOBANK}</РозрахунковийРахунок>`);
    });

    it('should include statement totals', () => {
        const xml = generate1CXml(mockParseResult);

        expect(xml).toContain('<ПочатковийЗалишок>');
        expect(xml).toContain('<ВсьогоНадійшло>15000.00</ВсьогоНадійшло>');
        expect(xml).toContain('<ВсьогоСписано>250.50</ВсьогоСписано>');
        expect(xml).toContain('<КінцевийЗалишок>');
    });

    it('should include all transactions', () => {
        const xml = generate1CXml(mockParseResult);

        expect(xml).toContain('<Документи>');
        expect(xml).toContain('<Документ>');
        expect(xml.split('<Документ>').length - 1).toBe(2);
    });

    it('should format transaction data correctly', () => {
        const xml = generate1CXml(mockParseResult);

        expect(xml).toContain('<Дата>15.01.2025 10:30:15</Дата>');
        expect(xml).toContain('<Сума>250.50</Сума>');
        expect(xml).toContain('<ВидОперації>Витрата</ВидОперації>');
        expect(xml).toContain('<ПризначенняПлатежу>Покупка в магазині АТБ</ПризначенняПлатежу>');
        expect(xml).toContain('<Платник>ТОВ &quot;АТБ-Маркет&quot;</Платник>');
    });

    it('should handle income transactions', () => {
        const xml = generate1CXml(mockParseResult);

        expect(xml).toContain('<ВидОперації>Прихід</ВидОперації>');
        expect(xml).toContain('<Отримувач>ТОВ &quot;Роботодавець&quot;</Отримувач>');
    });

    it('should escape XML special characters', () => {
        const resultWithSpecialChars: ParseResult = {
            ...mockParseResult,
            transactions: [
                {
                    ...mockParseResult.transactions[0],
                    description: 'Оплата <товар> & "послуги"'
                }
            ]
        };

        const xml = generate1CXml(resultWithSpecialChars);

        expect(xml).toContain('&lt;товар&gt;');
        expect(xml).toContain('&amp;');
        expect(xml).toContain('&quot;послуги&quot;');
    });
});

describe('generate1CTxt', () => {
    it('should generate valid TXT structure', () => {
        const txt = generate1CTxt(mockParseResult);

        expect(txt).toContain('1CClientBankExchange');
        expect(txt).toContain('СекціяРозрахунковийРахунок');
        expect(txt).toContain('СекціяДокумент');
        expect(txt).toContain('КінецьДокумент');
    });

    it('should include all required metadata', () => {
        const txt = generate1CTxt(mockParseResult);

        expect(txt).toContain('ВерсіяФормату=1.02');
        expect(txt).toContain('Кодування=Windows');
        expect(txt).toContain('Відправник=Vypyska.pro');
        expect(txt).toContain('ДатаПочатку=');
        expect(txt).toContain('ДатаКінця=');
    });

    it('should include statement totals', () => {
        const txt = generate1CTxt(mockParseResult);

        expect(txt).toContain('ПочатковийЗалишок=');
        expect(txt).toContain('ВсьогоНадійшло=15000.00');
        expect(txt).toContain('ВсьогоСписано=250.50');
        expect(txt).toContain('КінцевийЗалишок=');
    });

    it('should include all transactions', () => {
        const txt = generate1CTxt(mockParseResult);

        const documentCount = (txt.match(/СекціяДокумент/g) || []).length;
        expect(documentCount).toBe(2);
    });

    it('should format transaction data correctly', () => {
        const txt = generate1CTxt(mockParseResult);

        expect(txt).toContain('Дата=15.01.2025 10:30:15');
        expect(txt).toContain('Сума=250.50');
        expect(txt).toContain('ВидОперації=Витрата');
        expect(txt).toContain('ПризначенняПлатежу=Покупка в магазині АТБ');
        expect(txt).toContain('Платник=ТОВ "АТБ-Маркет"');
    });

    it('should include EDRPOU when available', () => {
        const resultWithEdrpou: ParseResult = {
            ...mockParseResult,
            transactions: [
                {
                    ...mockParseResult.transactions[0],
                    edrpou: '12345678'
                }
            ]
        };

        const txt = generate1CTxt(resultWithEdrpou);

        expect(txt).toContain('ЄДРПОУ=12345678');
    });

    it('should handle transactions without optional fields', () => {
        const minimalResult: ParseResult = {
            transactions: [
                {
                    date: '2025-01-15T10:30:15',
                    amount: -250.5,
                    currency: 'UAH',
                    description: 'Покупка'
                }
            ],
            metadata: {
                bankName: BANKS.MONOBANK,
                accountCurrency: DEFAULT_CURRENCY,
                period: {
                    start: '2025-01-15T10:30:15',
                    end: '2025-01-15T10:30:15'
                }
            }
        };

        const txt = generate1CTxt(minimalResult);

        expect(txt).toContain('СекціяДокумент');
        expect(txt).not.toContain('Платник=');
        expect(txt).not.toContain('Отримувач=');
        expect(txt).not.toContain('ЄДРПОУ=');
    });
});
