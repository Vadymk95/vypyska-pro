import { AlertCircle, Upload } from 'lucide-react';
import type { FC } from 'react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { BANK_NAMES, FILE_EXTENSIONS, FILE_FORMATS } from '@/lib/constants';
import type { BankType } from '@/lib/parsers/types';
import { cn } from '@/lib/utils';

import { BankSelector } from './BankSelector';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    selectedBank?: BankType;
    onBankChange?: (bank: BankType) => void;
    isLoading?: boolean;
    error?: string | null;
}

export const FileUploader: FC<FileUploaderProps> = ({
    onFileSelect,
    selectedBank = BANK_NAMES.MONOBANK,
    onBankChange,
    isLoading = false,
    error = null
}) => {
    const [bank, setBank] = useState<BankType>(selectedBank);

    const handleBankChange = (newBank: BankType) => {
        setBank(newBank);
        onBankChange?.(newBank);
    };
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onFileSelect(acceptedFiles[0]);
            }
        },
        [onFileSelect]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            [`text/${FILE_FORMATS.CSV}`]: [FILE_EXTENSIONS.CSV]
        },
        maxFiles: 1,
        multiple: false,
        disabled: isLoading
    });

    return (
        <div className="relative z-0 w-full max-w-2xl mx-auto">
            <BankSelector value={bank} onChange={handleBankChange} disabled={isLoading} />

            <div
                {...getRootProps()}
                className={cn(
                    'relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out p-10 flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px]',
                    isDragActive
                        ? 'border-primary bg-primary/5 ring-4 ring-primary/20'
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30',
                    error ? 'border-destructive/50 bg-destructive/5' : '',
                    isLoading ? 'opacity-50 pointer-events-none' : ''
                )}
            >
                <input {...getInputProps()} />

                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div
                        className={cn(
                            'p-4 rounded-full transition-colors',
                            isDragActive
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted text-muted-foreground',
                            error ? 'bg-destructive/10 text-destructive' : ''
                        )}
                    >
                        {error ? (
                            <AlertCircle className="w-8 h-8" />
                        ) : (
                            <Upload className="w-8 h-8" />
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold tracking-tight">
                            {isDragActive ? 'Відпустіть файл тут' : 'Завантажити виписку'}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                            Перетягніть файл CSV сюди, або натисніть для вибору
                        </p>
                    </div>
                </div>

                {/* Decorative background pattern */}
                <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <pattern
                            id="grid"
                            width="8"
                            height="8"
                            patternUnits="userSpaceOnUse"
                            className="text-current"
                        >
                            <path
                                d="M 8 0 L 0 0 0 8"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="0.5"
                            />
                        </pattern>
                        <rect width="100" height="100" fill="url(#grid)" />
                    </svg>
                </div>
            </div>

            {error && (
                <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium">Помилка обробки файлу</p>
                        <p className="opacity-90">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
