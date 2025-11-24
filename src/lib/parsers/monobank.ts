import { parse } from 'papaparse';

import type { BankType } from '@/constants';
import { BANKS, DEFAULT_CURRENCY } from '@/constants';
import type { ParseResult, Transaction } from '@/types';
import { readFileWithEncoding } from '@/utils/file';

import { validateFileStructure } from './validators';

export const parseMonobankCsv = async (file: File, selectedBank?: string): Promise<ParseResult> => {
    const csvContent = await readFileWithEncoding(file);

    return new Promise((resolve, reject) => {
        const delimiter =
            csvContent.includes(';') && !csvContent.match(/"[^"]*;[^"]*"/) ? ';' : ',';

        parse<Record<string, string>>(csvContent, {
            header: true,
            skipEmptyLines: true,
            delimiter: delimiter,
            transformHeader: (header) => header.trim().replace(/^["']|["']$/g, ''),
            complete: (results) => {
                try {
                    const transactions: Transaction[] = [];
                    const data = results.data;

                    if (!data || data.length === 0) {
                        throw new Error('Файл порожній або має неправильний формат');
                    }

                    let headers: string[] = [];
                    if (results.meta.fields && results.meta.fields.length > 0) {
                        headers = results.meta.fields;
                    } else if (data[0] && Object.keys(data[0]).length > 0) {
                        headers = Object.keys(data[0]);
                    } else {
                        throw new Error('Не вдалося визначити заголовки файлу');
                    }

                    if (selectedBank) {
                        const validation = validateFileStructure(headers, selectedBank as BankType);
                        if (!validation.isValid) {
                            throw new Error(validation.error || 'Неправильна структура файлу');
                        }
                    }

                    data.forEach((row) => {
                        const dateKey = Object.keys(row).find(
                            (k) =>
                                k.toLowerCase().includes('date') ||
                                k.toLowerCase().includes('statementdate') ||
                                k.toLowerCase().includes('дата')
                        );
                        const timeKey = Object.keys(row).find(
                            (k) =>
                                k.toLowerCase().includes('time') ||
                                k.toLowerCase().includes('statementtime') ||
                                (k.toLowerCase().includes('час') &&
                                    !k.toLowerCase().includes('дата'))
                        );
                        const dateTimeKey = Object.keys(row).find(
                            (k) =>
                                k.toLowerCase().includes('дата') && k.toLowerCase().includes('час')
                        );
                        const statementKey = Object.keys(row).find(
                            (k) =>
                                k.toLowerCase().includes('statement') &&
                                k.toLowerCase() !== 'statementdate' &&
                                k.toLowerCase() !== 'statementtime'
                        );
                        const amountKey = Object.keys(row).find(
                            (k) =>
                                (k.toLowerCase().includes('amount') &&
                                    !k.toLowerCase().includes('balance')) ||
                                (k.toLowerCase().includes('сума') &&
                                    !k.toLowerCase().includes('залишок') &&
                                    !k.toLowerCase().includes('комісій') &&
                                    !k.toLowerCase().includes('кешбек'))
                        );
                        const currencyKey = Object.keys(row).find(
                            (k) =>
                                k.toLowerCase().includes('currency') ||
                                k.toLowerCase().includes('валюта')
                        );
                        const balanceKey = Object.keys(row).find(
                            (k) =>
                                k.toLowerCase().includes('balance') ||
                                k.toLowerCase().includes('залишок')
                        );
                        const descKey = Object.keys(row).find(
                            (k) =>
                                k.toLowerCase().includes('description') ||
                                k.toLowerCase().includes('опис') ||
                                k.toLowerCase().includes('деталі')
                        );

                        if ((dateKey || dateTimeKey) && amountKey) {
                            const rawAmount = String(row[amountKey] || '0')
                                .replace(/["+]/g, '')
                                .replace(/\s/g, '')
                                .replace(',', '.');
                            const amount = parseFloat(rawAmount);

                            if (!isNaN(amount)) {
                                let rawDate = '';
                                let rawTime = '';

                                if (dateTimeKey) {
                                    const dateTimeValue = row[dateTimeKey] || '';
                                    const dateTimeMatch = dateTimeValue.match(
                                        /(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2}:\d{2})/
                                    );
                                    if (dateTimeMatch) {
                                        rawDate = dateTimeMatch[1];
                                        rawTime = dateTimeMatch[2];
                                    }
                                } else if (dateKey) {
                                    rawDate = row[dateKey] || '';
                                    rawTime = timeKey ? row[timeKey] || '' : '00:00:00';
                                }

                                let isoDate = '';
                                if (rawDate.match(/^\d{4}-\d{2}-\d{2}/)) {
                                    const timeWithSeconds =
                                        rawTime.split(':').length === 2 ? `${rawTime}:00` : rawTime;
                                    isoDate = `${rawDate}T${timeWithSeconds}`;
                                } else if (rawDate.match(/^\d{2}\.\d{2}\.\d{4}/)) {
                                    const [day, month, year] = rawDate.split('.');
                                    const timeWithSeconds =
                                        rawTime.split(':').length === 2 ? `${rawTime}:00` : rawTime;
                                    isoDate = `${year}-${month}-${day}T${timeWithSeconds}`;
                                }

                                const statementValue = statementKey
                                    ? row[statementKey]?.toLowerCase()
                                    : '';
                                const isIncome =
                                    statementValue === 'пополнение' ||
                                    statementValue === 'поповнення' ||
                                    (!statementValue.includes('списание') &&
                                        !statementValue.includes('списання') &&
                                        amount > 0);

                                transactions.push({
                                    date: isoDate,
                                    amount: isIncome ? Math.abs(amount) : -Math.abs(amount),
                                    currency: currencyKey ? row[currencyKey] : 'UAH',
                                    description: descKey ? row[descKey] : 'Переказ коштів',
                                    balance: balanceKey
                                        ? parseFloat(
                                              String(row[balanceKey])
                                                  .replace(/\s/g, '')
                                                  .replace(',', '.')
                                          )
                                        : undefined,
                                    id: `${isoDate}_${amount}`
                                });
                            }
                        }
                    });

                    if (transactions.length === 0) {
                        throw new Error('Не вдалося знайти транзакції. Перевірте формат файлу.');
                    }

                    const dates = transactions.map((t) => t.date).sort();
                    const start = dates[0] || '';
                    const end = dates[dates.length - 1] || '';

                    resolve({
                        transactions,
                        metadata: {
                            bankName: BANKS.MONOBANK,
                            accountCurrency: transactions[0]?.currency || DEFAULT_CURRENCY,
                            period: {
                                start,
                                end
                            }
                        }
                    });
                } catch (err) {
                    if (err instanceof Error) {
                        reject(
                            new Error(
                                err.message || `Помилка при читанні CSV структури ${BANKS.MONOBANK}`
                            )
                        );
                    } else {
                        reject(new Error(`Помилка при читанні CSV структури ${BANKS.MONOBANK}`));
                    }
                }
            },
            error: (err: Error) => reject(err)
        });
    });
};
