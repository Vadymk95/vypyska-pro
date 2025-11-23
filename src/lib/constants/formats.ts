export const FILE_FORMATS = {
    CSV: 'csv',
    TXT: 'txt',
    XML: 'xml'
} as const;

export type FileFormat = (typeof FILE_FORMATS)[keyof typeof FILE_FORMATS];

export const EXPORT_FORMATS = {
    TXT: FILE_FORMATS.TXT,
    XML: FILE_FORMATS.XML
} as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[keyof typeof EXPORT_FORMATS];

export const SUPPORTED_FILE_FORMATS = [FILE_FORMATS.CSV] as const;

export const FILE_EXTENSIONS = {
    CSV: `.${FILE_FORMATS.CSV}`,
    TXT: `.${FILE_FORMATS.TXT}`,
    XML: `.${FILE_FORMATS.XML}`
} as const;
