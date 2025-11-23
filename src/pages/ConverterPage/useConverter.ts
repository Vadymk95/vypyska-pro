import { useState } from 'react';

import type { ConverterStatus, ExportFormat } from '@/lib/constants';
import {
    BANK_NAMES,
    CONVERTER_STATUS,
    DELAYS,
    EXPORT_FORMATS,
    FILE_FORMATS
} from '@/lib/constants';
import { download1CFile } from '@/lib/converters/to1c';
import { parseMonobankCsv, parsePrivatBankCsv } from '@/lib/parsers';
import type { BankType, ParseResult } from '@/lib/parsers/types';
import { useAppStore } from '@/store/appStore';

export const useConverter = () => {
    const [status, setStatus] = useState<ConverterStatus>(CONVERTER_STATUS.IDLE);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [stats, setStats] = useState<{ count: number; bank: string } | null>(null);
    const [parsedData, setParsedData] = useState<ParseResult | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [selectedBank, setSelectedBank] = useState<BankType>(BANK_NAMES.MONOBANK);

    const addToHistory = useAppStore.use.addToHistory();

    const handleFileSelect = async (file: File, bank?: BankType) => {
        setStatus(CONVERTER_STATUS.PROCESSING);
        setErrorMessage(null);

        try {
            const fileExtension = file.name.toLowerCase().split('.').pop();

            if (!fileExtension || fileExtension !== FILE_FORMATS.CSV) {
                throw new Error(
                    `Непідтримуваний формат файлу (.${fileExtension || 'невідомий'}). Будь ласка, завантажте CSV виписку Monobank або ПриватБанк.`
                );
            }

            await new Promise((resolve) => setTimeout(resolve, DELAYS.PROCESSING));

            const bankToUse = bank || selectedBank;
            let result: ParseResult;

            if (fileExtension === FILE_FORMATS.CSV) {
                if (bankToUse === BANK_NAMES.PRIVATBANK) {
                    result = await parsePrivatBankCsv(file);
                } else {
                    result = await parseMonobankCsv(file);
                }
            } else {
                throw new Error(
                    'Непідтримуваний формат. Будь ласка, завантажте CSV виписку Monobank або ПриватБанк.'
                );
            }

            setParsedData(result);
            setStats({
                count: result.transactions.length,
                bank: result.metadata.bankName
            });
            setStatus(CONVERTER_STATUS.SUCCESS);

            // Save to global history
            addToHistory({
                fileName: file.name,
                bankName: result.metadata.bankName,
                transactionCount: result.transactions.length,
                data: result
            });
        } catch (err) {
            console.error(err);
            if (err instanceof Error) {
                setErrorMessage(err.message || 'Сталася невідома помилка');
            } else {
                setErrorMessage('Сталася невідома помилка');
            }
            setStatus(CONVERTER_STATUS.ERROR);
        }
    };

    const handleDownload = async (format: ExportFormat = EXPORT_FORMATS.TXT) => {
        if (!parsedData) return;

        setIsDownloading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, DELAYS.DOWNLOAD));
            download1CFile(parsedData, format);
        } catch (err) {
            console.error(err);
        } finally {
            setIsDownloading(false);
        }
    };

    const reset = () => {
        setStatus(CONVERTER_STATUS.IDLE);
        setParsedData(null);
        setStats(null);
        setErrorMessage(null);
    };

    const handleBankChange = (bank: BankType) => {
        setSelectedBank(bank);
    };

    return {
        status,
        errorMessage,
        stats,
        isDownloading,
        selectedBank,
        handleFileSelect,
        handleBankChange,
        handleDownload,
        reset
    };
};
