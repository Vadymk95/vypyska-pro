import { Download, FileCheck, Loader2, ShieldCheck } from 'lucide-react';
import type { FC } from 'react';

import { FeedbackForm } from '@/components/features/FeedbackForm';
import { FileUploader } from '@/components/features/FileUploader';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { CONVERTER_STATUS, EXPORT_FORMATS, FEEDBACK_SOURCES } from '@/constants';

import { useConverter } from './useConverter';

export const ConverterPage: FC = () => {
    const {
        status,
        errorMessage,
        stats,
        isDownloading,
        selectedBank,
        handleFileSelect,
        handleBankChange,
        handleDownload,
        reset
    } = useConverter();

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center space-y-12">
            <div className="space-y-4 text-center">
                <h1 className="text-foreground text-3xl font-extrabold tracking-tight md:text-5xl">
                    Конвертер виписок в <span className="text-primary">1С/BAS</span>
                </h1>
                <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed md:text-xl">
                    Перетворіть виписки Monobank та ПриватБанк у формат, зрозумілий для вашої
                    бухгалтерії.
                    <br />
                    <span className="text-foreground mt-2 flex items-center justify-center gap-2 font-medium">
                        <ShieldCheck
                            className="text-green-600 h-5 w-5"
                            aria-label="Іконка конфіденційності"
                        />
                        100% Конфіденційно
                    </span>
                    <span className="mt-1 block text-sm opacity-80">
                        Обробка відбувається у вашому браузері. Дані не передаються на сервер.
                    </span>
                </p>
            </div>

            {status === CONVERTER_STATUS.IDLE ||
            status === CONVERTER_STATUS.PROCESSING ||
            status === CONVERTER_STATUS.ERROR ? (
                <div className="w-full animate-in fade-in zoom-in-95 duration-300">
                    <FileUploader
                        onFileSelect={(file) => handleFileSelect(file, selectedBank)}
                        selectedBank={selectedBank}
                        onBankChange={handleBankChange}
                        isLoading={status === CONVERTER_STATUS.PROCESSING}
                        error={errorMessage}
                    />
                </div>
            ) : (
                <Card className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-300">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <FileCheck className="h-8 w-8" aria-label="Іконка успішної обробки" />
                        </div>
                        <CardTitle className="text-green-700 text-2xl">
                            Успішно оброблено!
                        </CardTitle>
                        <CardDescription>
                            Знайдено <strong>{stats?.count || 0}</strong> транзакцій банку{' '}
                            <strong>{stats?.bank}</strong>.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col justify-center gap-3 pt-4 sm:flex-row">
                            <Button
                                variant="outline"
                                onClick={reset}
                                disabled={isDownloading}
                                size="lg"
                            >
                                Конвертувати іншу
                            </Button>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <Button
                                    size="lg"
                                    onClick={() => handleDownload(EXPORT_FORMATS.TXT)}
                                    className="gap-2"
                                    disabled={isDownloading}
                                    variant="default"
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2
                                                className="h-4 w-4 animate-spin"
                                                aria-label="Завантаження в процесі"
                                            />
                                            Завантажується...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4" aria-hidden="true" />
                                            Завантажити TXT
                                        </>
                                    )}
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={() => handleDownload(EXPORT_FORMATS.XML)}
                                    className="gap-2"
                                    disabled={isDownloading}
                                    variant="outline"
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2
                                                className="h-4 w-4 animate-spin"
                                                aria-label="Завантаження в процесі"
                                            />
                                            Завантажується...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4" aria-hidden="true" />
                                            Завантажити XML
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 border-t pt-6">
                            <h4 className="text-muted-foreground mb-4 text-sm font-semibold">
                                Як вам результат? Залиште короткий відгук:
                            </h4>
                            <FeedbackForm source={FEEDBACK_SOURCES.CONVERSION_SUCCESS} />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center border-t pt-4">
                        <div className="text-muted-foreground w-full space-y-1 text-center text-xs">
                            <p>
                                Завантажуючи файл, ви погоджуєтесь перевірити дані перед імпортом.
                            </p>
                            <p>Сервіс надається за принципом "AS IS" (Як є).</p>
                        </div>
                    </CardFooter>
                </Card>
            )}

            <div className="w-full max-w-xl border-t py-12">
                <div className="space-y-6 text-center">
                    <h2 className="text-2xl font-bold tracking-tight">Маєте пропозиції?</h2>
                    <p className="text-muted-foreground">
                        Ми постійно вдосконалюємо сервіс. Напишіть, чого вам не вистачає, або
                        повідомте, якщо знайшли помилку.
                    </p>
                    <Card className="p-6 text-left">
                        <FeedbackForm source={FEEDBACK_SOURCES.FOOTER} />
                    </Card>
                </div>
            </div>
        </div>
    );
};
