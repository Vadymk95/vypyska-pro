import type { BankName } from '@/constants';

export interface Transaction {
    date: string;
    amount: number;
    currency: string;
    description: string;
    sender?: string;
    recipient?: string;
    balance?: number;
    id?: string;
    edrpou?: string;
}

export interface ParseResult {
    transactions: Transaction[];
    metadata: {
        bankName: BankName;
        accountCurrency: string;
        period: {
            start: string;
            end: string;
        };
    };
}
