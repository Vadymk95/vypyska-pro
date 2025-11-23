import type { FC } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';

interface TermsOfUseModalProps {
    trigger?: React.ReactNode;
}

export const TermsOfUseModal: FC<TermsOfUseModalProps> = ({
    trigger = <Button variant="link">Умови використання</Button>
}) => {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-h-[80vh] flex flex-col p-0">
                <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
                    <DialogTitle>Умови використання</DialogTitle>
                    <DialogDescription>
                        Будь ласка, уважно прочитайте ці умови перед використанням Vypyska.pro
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-sm px-6 pb-6 overflow-y-auto scrollbar-rounded flex-1 min-h-0">
                    <section>
                        <h3 className="font-semibold mb-2">1. Прийняття умов</h3>
                        <p className="text-muted-foreground">
                            Отримуючи доступ та використовуючи Vypyska.pro (далі — "Сервіс"), ви
                            приймаєте та погоджуєтеся дотримуватися умов та положень цієї угоди.
                            Якщо ви не згодні дотримуватися вищезазначеного, будь ласка, не
                            використовуйте цей сервіс.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold mb-2">2. Опис сервісу</h3>
                        <p className="text-muted-foreground">
                            Vypyska.pro — це веб-інструмент, який конвертує банківські виписки у
                            форматі CSV з Monobank та ПриватБанк у формати TXT та XML, сумісні з
                            1С/BAS. Вся обробка відбувається локально у вашому браузері. Дані не
                            передаються на наші сервери.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold mb-2">3. Сервіс "ЯК Є"</h3>
                        <p className="text-muted-foreground">
                            СЕРВІС НАДАЄТЬСЯ "ЯК Є" ТА "ЯК ДОСТУПНО" БЕЗ ГАРАНТІЙ БУДЬ-ЯКОГО ВИДУ,
                            ЯВНИХ АБО НЕЯВНИХ, ВКЛЮЧАЮЧИ, АЛЕ НЕ ОБМЕЖУЮЧИСЬ, НЕЯВНИМИ ГАРАНТІЯМИ
                            ТОВАРНОЇ ПРИДАТНОСТІ, ПРИДАТНОСТІ ДЛЯ КОНКРЕТНОЇ МЕТИ АБО НЕПОРУШЕННЯ
                            ПРАВ.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold mb-2">4. Обмеження відповідальності</h3>
                        <p className="text-muted-foreground">
                            В МАКСИМАЛЬНІЙ МІРІ, ДОЗВОЛЕНІЙ ЗАКОНОМ, VYPYSKA.PRO, ЙОГО ОПЕРАТОРИ ТА
                            АФІЛІЙОВАНІ ОСОБИ НЕ НЕСУТЬ ВІДПОВІДАЛЬНОСТІ ЗА БУДЬ-ЯКІ НЕПРЯМІ,
                            ВИПАДКОВІ, СПЕЦІАЛЬНІ, НАСЛІДКОВІ АБО ШТРАФНІ ЗБИТКИ, АБО БУДЬ-ЯКІ
                            ВТРАТИ ПРИБУТКУ АБО ДОХОДІВ, НЕЗАЛЕЖНО ВІД ТОГО, ЧИ ВОНИ ЗАВДАНІ ПРЯМО
                            АБО НЕПРЯМО, АБО БУДЬ-ЯКІ ВТРАТИ ДАНИХ, ВИКОРИСТАННЯ, ДОБРОЇ ВОЛІ АБО
                            ІНШІ НЕМАТЕРІАЛЬНІ ВТРАТИ, ЩО ВИНИКАЮТЬ У ЗВ'ЯЗКУ З ВИКОРИСТАННЯМ ВАМИ
                            СЕРВІСУ.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold mb-2">5. Конфіденційність даних</h3>
                        <p className="text-muted-foreground">
                            Вся обробка файлів виконується локально у вашому браузері. Ми не
                            збираємо, не зберігаємо та не передаємо ваші фінансові дані. Будь-який
                            відгук, який ви добровільно надсилаєте, може зберігатися для покращення
                            сервісу.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold mb-2">6. Відповідальність користувача</h3>
                        <p className="text-muted-foreground">
                            Ви несете повну відповідальність за перевірку точності конвертованих
                            даних перед імпортом їх у вашу бухгалтерську систему. Завжди перевіряйте
                            згенеровані TXT або XML файли перед використанням. Рекомендуємо
                            зберігати резервні копії ваших оригінальних CSV файлів. Переконайтеся,
                            що ви правильно обрали банк (Monobank або PrivatBank) перед
                            завантаженням файлу.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold mb-2">7. Відсутність гарантій</h3>
                        <p className="text-muted-foreground">
                            Ми не гарантуємо, що Сервіс буде безперервним, безпечним або без
                            помилок, або що будь-які дефекти будуть виправлені. Сервіс може бути
                            тимчасово недоступним через технічне обслуговування або технічні
                            проблеми.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold mb-2">8. Зміни умов</h3>
                        <p className="text-muted-foreground">
                            Ми залишаємо за собою право змінювати ці умови в будь-який час. Ваше
                            подальше використання Сервісу після будь-яких таких змін означає вашу
                            згоду з новими умовами.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-semibold mb-2">9. Контакти</h3>
                        <p className="text-muted-foreground">
                            Якщо у вас є питання щодо цих Умов використання, будь ласка, зв'яжіться
                            з нами через форму зворотного зв'язку на сайті.
                        </p>
                    </section>
                </div>
            </DialogContent>
        </Dialog>
    );
};
