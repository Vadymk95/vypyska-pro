import { detect } from 'jschardet';

export const readFileWithEncoding = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const binaryString = e.target?.result as string;
                const detected = detect(binaryString);

                const encoding =
                    detected.encoding === 'windows-1251' || detected.encoding === 'KOI8-R'
                        ? detected.encoding
                        : 'utf-8';

                const textReader = new FileReader();
                textReader.onload = (ev) => resolve(ev.target?.result as string);
                textReader.onerror = () => reject(new Error('Помилка читання файлу'));
                textReader.readAsText(file, encoding);
            } catch (err) {
                console.error(err);
                const textReader = new FileReader();
                textReader.onload = (ev) => resolve(ev.target?.result as string);
                textReader.onerror = () => reject(new Error('Помилка читання файлу'));
                textReader.readAsText(file, 'utf-8');
            }
        };

        reader.onerror = () => reject(new Error('Помилка читання файлу'));
        reader.readAsBinaryString(file);
    });
};
