export const CONVERTER_STATUS = {
    IDLE: 'idle',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    ERROR: 'error'
} as const;

export type ConverterStatus = (typeof CONVERTER_STATUS)[keyof typeof CONVERTER_STATUS];
