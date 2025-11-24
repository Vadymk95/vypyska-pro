import { parse } from 'papaparse';

import type { BankType } from '@/constants';
import { BANKS, DEFAULT_CURRENCY } from '@/constants';
import type { ParseResult, Transaction } from '@/types';
import { readFileWithEncoding } from '@/utils/file';

import { validateFileStructure } from './validators';

export const parsePrivatBankCsv = async (
    file: File,
    selectedBank?: string
): Promise<ParseResult> => {
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
                    const headers = results.meta.fields || [];
                    const transactions: Transaction[] = [];
                    const data = results.data;

                    if (!data || data.length === 0) {
                        throw new Error('Файл порожній або має неправильний формат');
                    }

                    if (selectedBank) {
                        const validation = validateFileStructure(headers, selectedBank as BankType);
                        if (!validation.isValid) {
                            throw new Error(validation.error || 'Неправильна структура файлу');
                        }
                    }

                    data.forEach((row) => {
                        const dateKey = Object.keys(row).find((k) =>
                            k.toLowerCase().includes('дата')
                        );
                        const timeKey = Object.keys(row).find((k) =>
                            k.toLowerCase().includes('час')
                        );
                        const typeKey = Object.keys(row).find(
                            (k) =>
                                k.toLowerCase().includes('тип операції') ||
                                (k.toLowerCase().includes('тип') &&
                                    k.toLowerCase().includes('операц'))
                        );
                        const amountKey = Object.keys(row).find(
                            (k) =>
                                k.toLowerCase().includes('сума') &&
                                !k.toLowerCase().includes('залишок')
                        );
                        const currencyKey = Object.keys(row).find((k) =>
                            k.toLowerCase().includes('валюта')
                        );
                        const descKey = Object.keys(row).find(
                            (k) =>
                                k.toLowerCase().includes('призначення') ||
                                k.toLowerCase().includes('опис')
                        );
                        const counterpartyKey = Object.keys(row).find(
                            (k) =>
                                k.toLowerCase().includes('контрагент') ||
                                k.toLowerCase().includes('плательщик')
                        );
                        const balanceKey = Object.keys(row).find((k) =>
                            k.toLowerCase().includes('залишок')
                        );
                        const edrpouKey = Object.keys(row).find((k) => {
                            const lower = k.toLowerCase();
                            return (
                                lower.includes('єдрпou') ||
                                lower.includes('едрпou') ||
                                lower.includes('edrpou') ||
                                lower.includes('єдрпоу') ||
                                lower.includes('едрпоу')
                            );
                        });

                        if (dateKey && amountKey) {
                            const rawAmount = String(row[amountKey] || '0')
                                .replace(/["+]/g, '')
                                .replace(/\s/g, '')
                                .replace(',', '.');
                            const amount = parseFloat(rawAmount);

                            if (!isNaN(amount)) {
                                const rawDate = row[dateKey] || '';
                                const rawTime = timeKey ? row[timeKey] || '' : '00:00:00';

                                let isoDate = '';
                                if (rawDate.match(/^\d{2}\.\d{2}\.\d{4}/)) {
                                    const [day, month, year] = rawDate.split('.');
                                    const timeWithSeconds =
                                        rawTime.split(':').length === 2 ? `${rawTime}:00` : rawTime;
                                    isoDate = `${year}-${month}-${day}T${timeWithSeconds}`;
                                }

                                const typeValue = typeKey ? row[typeKey]?.toLowerCase() : '';
                                const isIncome =
                                    typeValue === 'надходження' ||
                                    (!typeValue.includes('витрата') && amount > 0);

                                const counterpartyName = counterpartyKey
                                    ? row[counterpartyKey]
                                    : undefined;

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
                                    sender:
                                        !isIncome && counterpartyName
                                            ? counterpartyName
                                            : undefined,
                                    recipient:
                                        isIncome && counterpartyName ? counterpartyName : undefined,
                                    id: `${isoDate}_${amount}`,
                                    edrpou: edrpouKey ? row[edrpouKey] : undefined
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
                            bankName: BANKS.PRIVATBANK,
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
                                err.message ||
                                    `Помилка при читанні CSV структури ${BANKS.PRIVATBANK}`
                            )
                        );
                    } else {
                        reject(new Error(`Помилка при читанні CSV структури ${BANKS.PRIVATBANK}`));
                    }
                }
            },
            error: (err: Error) => reject(err)
        });
    });
};
