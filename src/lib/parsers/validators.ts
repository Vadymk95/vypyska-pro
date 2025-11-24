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

    const hasDateTimeCombined = lowerHeaders.some(
        (h) => h.includes('дата') && h.includes('час') && (h.includes('i') || h.includes('і'))
    );

    const hasDate = lowerHeaders.some((h) => h.includes('date') || h.includes('дата'));
    const hasTime = lowerHeaders.some((h) => h.includes('time') || h.includes('час'));
    const hasDateTime = hasDateTimeCombined || (hasDate && hasTime);

    const hasDescription =
        lowerHeaders.some((h) => h.includes('description') || h.includes('опис')) ||
        lowerHeaders.some((h) => h.includes('деталі'));
    const hasAmount = lowerHeaders.some((h) => h.includes('amount') || h.includes('сума'));
    const hasBalance = lowerHeaders.some((h) => h.includes('balance') || h.includes('залишок'));

    const hasMonobankFields = hasDateTime && hasDescription && hasAmount && hasBalance;

    const hasPrivatBankDate = lowerHeaders.some((h) => h.includes('дата'));
    const hasPrivatBankTime = lowerHeaders.some((h) => h.includes('час'));
    const hasPrivatBankAmount = lowerHeaders.some(
        (h) => h.includes('сума') && !h.includes('залишок')
    );
    const hasPrivatBankCurrency = lowerHeaders.some((h) => h.includes('валюта'));
    const hasPrivatBankDescription = lowerHeaders.some(
        (h) => h.includes('призначення') || h.includes('опис')
    );

    const hasPrivatBankFields =
        hasPrivatBankDate &&
        hasPrivatBankTime &&
        hasPrivatBankAmount &&
        hasPrivatBankCurrency &&
        hasPrivatBankDescription &&
        !hasDateTimeCombined;

    if (hasMonobankFields && !hasPrivatBankFields) {
        return BANKS.MONOBANK;
    }

    if (hasPrivatBankFields && !hasMonobankFields) {
        return BANKS.PRIVATBANK;
    }

    if (hasDateTimeCombined && hasAmount && hasDescription) {
        return BANKS.MONOBANK;
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
