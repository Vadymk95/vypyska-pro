import { saveAs } from 'file-saver';

import type { ExportFormat } from '@/constants';
import { EXPORT_FORMATS, FILE_EXTENSIONS, FILE_NAMES } from '@/constants';
import type { ParseResult } from '@/types';

const format1CDate = (isoDate: string): string => {
    const d = new Date(isoDate);
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
};

const format1CDateTime = (isoDate: string): string => {
    const d = new Date(isoDate);
    const date = format1CDate(isoDate);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    return `${date} ${hours}:${minutes}:${seconds}`;
};

const escapeXml = (str: string): string => {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

export const generate1CXml = (data: ParseResult): string => {
    const totalIncome = data.transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = Math.abs(
        data.transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
    );
    const startBalance = data.transactions[data.transactions.length - 1]?.balance || 0;
    const endBalance = data.transactions[0]?.balance || 0;

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<КлієнтБанкОбмін>
    <ЗагальніВідомості>
        <ВерсіяФормату>1.02</ВерсіяФормату>
        <Відправник>Vypyska.pro</Відправник>
        <ДатаФормування>${format1CDate(new Date().toISOString())}</ДатаФормування>
    </ЗагальніВідомості>
    <Виписка>
        <ДатаПочатку>${format1CDate(data.metadata.period.start)}</ДатаПочатку>
        <ДатаКінця>${format1CDate(data.metadata.period.end)}</ДатаКінця>
        <РозрахунковийРахунок>${data.metadata.bankName}</РозрахунковийРахунок>
        <ПочатковийЗалишок>${startBalance.toFixed(2)}</ПочатковийЗалишок>
        <ВсьогоНадійшло>${totalIncome.toFixed(2)}</ВсьогоНадійшло>
        <ВсьогоСписано>${totalExpense.toFixed(2)}</ВсьогоСписано>
        <КінцевийЗалишок>${endBalance.toFixed(2)}</КінцевийЗалишок>
        <Документи>
`;

    data.transactions.forEach((transaction) => {
        const amount = Math.abs(transaction.amount).toFixed(2);
        const isIncome = transaction.amount > 0;

        xml += `            <Документ>
                <Номер>${transaction.id || ''}</Номер>
                <Дата>${format1CDateTime(transaction.date)}</Дата>
                <Сума>${amount}</Сума>
                <ВидОперації>${isIncome ? 'Прихід' : 'Витрата'}</ВидОперації>
                <ПризначенняПлатежу>${escapeXml(transaction.description)}</ПризначенняПлатежу>
                ${transaction.sender ? `<Платник>${escapeXml(transaction.sender)}</Платник>` : ''}
                ${transaction.recipient ? `<Отримувач>${escapeXml(transaction.recipient)}</Отримувач>` : ''}
            </Документ>
`;
    });

    xml += `        </Документи>
    </Виписка>
</КлієнтБанкОбмін>`;

    return xml;
};

export const generate1CTxt = (data: ParseResult): string => {
    const totalIncome = data.transactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = Math.abs(
        data.transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
    );
    const startBalance = data.transactions[data.transactions.length - 1]?.balance || 0;
    const endBalance = data.transactions[0]?.balance || 0;

    let txt = `1CClientBankExchange
ВерсіяФормату=1.02
Кодування=Windows
Відправник=Vypyska.pro
ДатаФормування=${format1CDate(new Date().toISOString())}
СекціяРозрахунковийРахунок
ДатаПочатку=${format1CDate(data.metadata.period.start)}
ДатаКінця=${format1CDate(data.metadata.period.end)}
РозрахунковийРахунок=${data.metadata.bankName}
ПочатковийЗалишок=${startBalance.toFixed(2)}
ВсьогоНадійшло=${totalIncome.toFixed(2)}
ВсьогоСписано=${totalExpense.toFixed(2)}
КінцевийЗалишок=${endBalance.toFixed(2)}
КінецьРозрахунковийРахунок
`;

    data.transactions.forEach((transaction) => {
        const amount = Math.abs(transaction.amount).toFixed(2);
        const isIncome = transaction.amount > 0;

        txt += `СекціяДокумент
Номер=${transaction.id || ''}
Дата=${format1CDateTime(transaction.date)}
Сума=${amount}
ВидОперації=${isIncome ? 'Прихід' : 'Витрата'}
ПризначенняПлатежу=${transaction.description}
`;
        if (transaction.sender) {
            txt += `Платник=${transaction.sender}
`;
        }
        if (transaction.recipient) {
            txt += `Отримувач=${transaction.recipient}
`;
        }
        if (transaction.edrpou) {
            txt += `ЄДРПОУ=${transaction.edrpou}
`;
        }
        txt += `КінецьДокумент
`;
    });

    return txt;
};

export const download1CFile = (data: ParseResult, format: ExportFormat = EXPORT_FORMATS.TXT) => {
    const timestamp = new Date().getTime();

    if (format === EXPORT_FORMATS.TXT) {
        const txtContent = generate1CTxt(data);
        const blob = new Blob([txtContent], { type: 'text/plain;charset=windows-1251' });
        saveAs(blob, `${FILE_NAMES.STATEMENT_PREFIX}${timestamp}${FILE_EXTENSIONS.TXT}`);
    } else {
        const xmlContent = generate1CXml(data);
        const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
        saveAs(blob, `${FILE_NAMES.STATEMENT_PREFIX}${timestamp}${FILE_EXTENSIONS.XML}`);
    }
};
