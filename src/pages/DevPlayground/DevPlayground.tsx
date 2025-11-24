import { Loader2 } from 'lucide-react';
import type { FC } from 'react';
import { useState } from 'react';

import { FeedbackForm } from '@/components/features/FeedbackForm';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { FEEDBACK_SOURCES } from '@/constants';

export const DevPlayground: FC = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [radioValue, setRadioValue] = useState('option1');

    return (
        <div className="container mx-auto max-w-6xl space-y-8 p-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Dev UI Playground</h1>
                <p className="text-muted-foreground">
                    Візуалізація та тестування UI компонентів в ізоляції під час розробки.
                </p>
            </div>

            <hr className="border-border" />

            {/* Buttons Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Кнопки</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Варианти кнопок</CardTitle>
                        <CardDescription>Різні стилі та розміри кнопок</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Варианти</h3>
                            <div className="flex flex-wrap gap-4">
                                <Button variant="default">За замовчуванням</Button>
                                <Button variant="secondary">Вторинний</Button>
                                <Button variant="outline">Контур</Button>
                                <Button variant="ghost">Привид</Button>
                                <Button variant="link">Посилання</Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Розміри</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button size="sm">Малий</Button>
                                <Button size="default">За замовчуванням</Button>
                                <Button size="lg">Великий</Button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Стани</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <Button disabled>Вимкнено</Button>
                                <Button variant="secondary" disabled>
                                    Вимкнено (Вторинний)
                                </Button>
                                <Button
                                    disabled={isLoading}
                                    onClick={() => {
                                        setIsLoading(true);
                                        setTimeout(() => setIsLoading(false), 2000);
                                    }}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Завантаження...
                                        </>
                                    ) : (
                                        'Завантажити'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Inputs Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Поля вводу</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Input та Label</CardTitle>
                        <CardDescription>Різні типи полів вводу</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email-demo">Email</Label>
                                <Input
                                    id="email-demo"
                                    type="email"
                                    placeholder="example@gmail.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="disabled-demo">Вимкнене поле</Label>
                                <Input id="disabled-demo" disabled placeholder="Не можна вводити" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password-demo">Пароль</Label>
                                <Input id="password-demo" type="password" placeholder="••••••••" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="file-demo">Файл</Label>
                                <Input id="file-demo" type="file" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Textarea Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Текстова область</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Textarea</CardTitle>
                        <CardDescription>Багаторядкове поле вводу</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="textarea-demo">Повідомлення</Label>
                            <Textarea
                                id="textarea-demo"
                                placeholder="Введіть ваш текст тут..."
                                rows={4}
                            />
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Radio Group Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Радіо-кнопки</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>RadioGroup</CardTitle>
                        <CardDescription>
                            Група радіо-кнопок для вибору одного значення
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Базовий приклад
                            </h3>
                            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option1" id="option1" />
                                    <Label htmlFor="option1" className="cursor-pointer">
                                        Варіант 1
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option2" id="option2" />
                                    <Label htmlFor="option2" className="cursor-pointer">
                                        Варіант 2
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option3" id="option3" />
                                    <Label htmlFor="option3" className="cursor-pointer">
                                        Варіант 3
                                    </Label>
                                </div>
                            </RadioGroup>
                            <p className="text-sm text-muted-foreground">
                                Вибрано: <strong>{radioValue}</strong>
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Вимкнена група
                            </h3>
                            <RadioGroup value="option1" disabled>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option1" id="disabled-option1" />
                                    <Label
                                        htmlFor="disabled-option1"
                                        className="cursor-not-allowed opacity-50"
                                    >
                                        Вимкнений варіант 1
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option2" id="disabled-option2" />
                                    <Label
                                        htmlFor="disabled-option2"
                                        className="cursor-not-allowed opacity-50"
                                    >
                                        Вимкнений варіант 2
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">
                                Горизонтальне розташування
                            </h3>
                            <RadioGroup
                                value={radioValue}
                                onValueChange={setRadioValue}
                                className="flex gap-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option1" id="horizontal-option1" />
                                    <Label htmlFor="horizontal-option1" className="cursor-pointer">
                                        Monobank
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option2" id="horizontal-option2" />
                                    <Label htmlFor="horizontal-option2" className="cursor-pointer">
                                        PrivatBank
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Cards Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Картки</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Проста картка</CardTitle>
                            <CardDescription>Приклад базової картки з контентом</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Це приклад простого контенту всередині картки. Ви можете
                                використовувати картки для групування пов'язаної інформації.
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full">
                                Дія
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Картка з кольоровим акцентом</CardTitle>
                            <CardDescription>Варіант з додатковими стилями</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Картки можуть мати різні стилі та варіанти відображення в залежності
                                від потреб вашого інтерфейсу.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Dialog Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Діалоги</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>Modal Dialog</CardTitle>
                        <CardDescription>Модальні вікна для важливої інформації</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>Відкрити діалог</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Приклад діалогу</DialogTitle>
                                    <DialogDescription>
                                        Це приклад модального діалогу. Ви можете використовувати
                                        його для підтвердження дій, відображення форми або важливої
                                        інформації.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="dialog-input">Поле вводу</Label>
                                        <Input id="dialog-input" placeholder="Введіть значення" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                        Скасувати
                                    </Button>
                                    <Button onClick={() => setDialogOpen(false)}>
                                        Підтвердити
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </section>

            {/* Feedback Form Section */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Форма відгуку</h2>
                <Card>
                    <CardHeader>
                        <CardTitle>FeedbackForm</CardTitle>
                        <CardDescription>
                            Повна форма з валідацією та обробкою помилок
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="max-w-md">
                            <FeedbackForm source={FEEDBACK_SOURCES.FOOTER} />
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
};
