import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BANKS, CONVERTER_STATUS } from '@/lib/constants';

import { ConverterPage } from '.';
import * as useConverterHook from './useConverter';

// Mock the hook
vi.mock('./useConverter', () => ({
    useConverter: vi.fn()
}));

// Mock child components to simplify testing
vi.mock('@/components/features/FileUploader/FileUploader', () => ({
    FileUploader: ({ onFileSelect }: { onFileSelect: (f: File) => void }) => (
        <div data-testid="file-uploader">
            <button onClick={() => onFileSelect(new File([''], 'test.csv'))}>Upload</button>
        </div>
    )
}));

describe('ConverterPage', () => {
    it('renders title and description correctly', () => {
        // Setup mock for initial state
        vi.spyOn(useConverterHook, 'useConverter').mockReturnValue({
            status: CONVERTER_STATUS.IDLE,
            errorMessage: null,
            stats: null,
            isDownloading: false,
            selectedBank: BANKS.MONOBANK,
            handleFileSelect: vi.fn(),
            handleBankChange: vi.fn(),
            handleDownload: vi.fn(),
            reset: vi.fn()
        });

        render(<ConverterPage />);

        expect(screen.getByText(/Конвертер виписок в/i)).toBeInTheDocument();
        expect(screen.getByText(/100% Конфіденційно/i)).toBeInTheDocument();
    });

    it('shows success state when status is success', () => {
        // Setup mock for success state
        vi.spyOn(useConverterHook, 'useConverter').mockReturnValue({
            status: CONVERTER_STATUS.SUCCESS,
            errorMessage: null,
            stats: { count: 10, bank: BANKS.MONOBANK },
            isDownloading: false,
            selectedBank: BANKS.MONOBANK,
            handleFileSelect: vi.fn(),
            handleBankChange: vi.fn(),
            handleDownload: vi.fn(),
            reset: vi.fn()
        });

        render(<ConverterPage />);

        expect(screen.getByText(/Успішно оброблено!/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Monobank/i).length).toBeGreaterThan(0);
        // Text is split across multiple elements, so we check for parts
        expect(screen.getByText(/Знайдено/i)).toBeInTheDocument();
        // Check that "10" appears in a strong element within the description
        const description = screen.getByText(/Знайдено/i).closest('div');
        expect(description).toHaveTextContent('10');
        expect(screen.getByText(/транзакцій/i)).toBeInTheDocument();
        expect(screen.getByText(/Завантажити TXT/i)).toBeInTheDocument();
        expect(screen.getByText(/Завантажити XML/i)).toBeInTheDocument();
    });

    it('calls reset when "Convert Another" is clicked', () => {
        const mockReset = vi.fn();
        vi.spyOn(useConverterHook, 'useConverter').mockReturnValue({
            status: CONVERTER_STATUS.SUCCESS,
            errorMessage: null,
            stats: { count: 10, bank: BANKS.MONOBANK },
            isDownloading: false,
            selectedBank: BANKS.MONOBANK,
            handleFileSelect: vi.fn(),
            handleBankChange: vi.fn(),
            handleDownload: vi.fn(),
            reset: mockReset
        });

        render(<ConverterPage />);

        const resetButton = screen.getByText(/Конвертувати іншу/i);
        fireEvent.click(resetButton);

        expect(mockReset).toHaveBeenCalled();
    });
});
