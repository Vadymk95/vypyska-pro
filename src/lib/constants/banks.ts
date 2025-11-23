export const BANKS = {
    MONOBANK: 'Monobank',
    PRIVATBANK: 'PrivatBank',
    UNKNOWN: 'Unknown'
} as const;

export type BankName = (typeof BANKS)[keyof typeof BANKS];

export const BANK_NAMES = {
    MONOBANK: BANKS.MONOBANK,
    PRIVATBANK: BANKS.PRIVATBANK
} as const;

export type BankType = (typeof BANK_NAMES)[keyof typeof BANK_NAMES];

export const BANK_DISPLAY_NAMES = {
    [BANKS.MONOBANK]: 'Monobank',
    [BANKS.PRIVATBANK]: 'PrivatBank'
} as const;
