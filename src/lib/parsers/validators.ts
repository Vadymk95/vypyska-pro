import type { BankType } from '@/constants';
import { BANKS, BANK_DISPLAY_NAMES } from '@/constants';

export interface FileStructure {
    hasDate: boolean;
    hasAmount: boolean;
    hasDescription: boolean;
    hasMonobankFields: boolean;
    hasPrivatBankFields: boolean;
}

export const detectBankFromStructure = (headers: string[]): BankType | null => {
    const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

    const hasMonobankFields =
        lowerHeaders.some((h) => h.includes('date') || h.includes('дата')) &&
        lowerHeaders.some((h) => h.includes('time') || h.includes('час')) &&
        lowerHeaders.some((h) => h.includes('description') || h.includes('опис')) &&
        lowerHeaders.some((h) => h.includes('amount') || h.includes('сума')) &&
        lowerHeaders.some((h) => h.includes('balance') || h.includes('залишок'));

    const hasPrivatBankFields =
        lowerHeaders.some((h) => h.includes('дата')) &&
        lowerHeaders.some((h) => h.includes('час')) &&
        lowerHeaders.some((h) => h.includes('тип операції') || h.includes('тип операц')) &&
        lowerHeaders.some((h) => h.includes('сума') && !h.includes('залишок')) &&
        lowerHeaders.some((h) => h.includes('валюта'));

    if (hasMonobankFields && !hasPrivatBankFields) {
        return BANKS.MONOBANK;
    }

    if (hasPrivatBankFields && !hasMonobankFields) {
        return BANKS.PRIVATBANK;
    }

    return null;
};

export const validateFileStructure = (
    headers: string[],
    selectedBank: BankType
): { isValid: boolean; detectedBank: BankType | null; error?: string } => {
    const detectedBank = detectBankFromStructure(headers);

    if (!detectedBank) {
        return {
            isValid: false,
            detectedBank: null,
            error: 'Не вдалося визначити банк за структурою файлу. Перевірте, що файл є випискою Monobank або ПриватБанк.'
        };
    }

    if (detectedBank !== selectedBank) {
        return {
            isValid: false,
            detectedBank,
            error: `Файл виглядає як виписка ${BANK_DISPLAY_NAMES[detectedBank]}, але вибрано ${BANK_DISPLAY_NAMES[selectedBank]}. Будь ласка, оберіть правильний банк або завантажте відповідний файл.`
        };
    }

    return { isValid: true, detectedBank };
};
