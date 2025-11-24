import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BANK_NAMES } from '@/constants';

import { FileUploader } from './index';

vi.mock('react-dropzone', () => ({
    useDropzone: vi.fn(({ onDrop, disabled }) => ({
        getRootProps: () => ({
            onClick: () => {
                if (!disabled) {
                    const file = new File(['test content'], 'test.csv', { type: 'text/csv' });
                    onDrop([file]);
                }
            }
        }),
        getInputProps: () => ({}),
        isDragActive: false
    }))
}));

vi.mock('./BankSelector', () => ({
    BankSelector: ({
        value,
        onChange,
        disabled
    }: {
        value: string;
        onChange: (val: string) => void;
        disabled: boolean;
    }) => (
        <div data-testid="bank-selector">
            <button
                data-testid="bank-monobank"
                onClick={() => onChange(BANK_NAMES.MONOBANK)}
                disabled={disabled}
            >
                Monobank
            </button>
            <button
                data-testid="bank-privatbank"
                onClick={() => onChange(BANK_NAMES.PRIVATBANK)}
                disabled={disabled}
            >
                PrivatBank
            </button>
            <span data-testid="selected-bank">{value}</span>
        </div>
    )
}));

describe('FileUploader', () => {
    it('renders file uploader with default bank', () => {
        const mockOnFileSelect = vi.fn();
        render(<FileUploader onFileSelect={mockOnFileSelect} />);

        expect(screen.getByText(/Завантажити виписку/i)).toBeInTheDocument();
        expect(screen.getByText(/Перетягніть файл CSV/i)).toBeInTheDocument();
        expect(screen.getByTestId('bank-selector')).toBeInTheDocument();
    });

    it('calls onFileSelect when file is selected', () => {
        const mockOnFileSelect = vi.fn();
        render(<FileUploader onFileSelect={mockOnFileSelect} />);

        const dropzone = screen.getByText(/Завантажити виписку/i).closest('div');
        if (dropzone) {
            fireEvent.click(dropzone);
        }

        expect(mockOnFileSelect).toHaveBeenCalled();
        expect(mockOnFileSelect.mock.calls[0][0]).toBeInstanceOf(File);
        expect(mockOnFileSelect.mock.calls[0][0].name).toBe('test.csv');
    });

    it('displays error message when error prop is provided', () => {
        const mockOnFileSelect = vi.fn();
        const errorMessage = 'Помилка завантаження файлу';
        render(<FileUploader onFileSelect={mockOnFileSelect} error={errorMessage} />);

        expect(screen.getByText(/Помилка обробки файлу/i)).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('does not display error when error is null', () => {
        const mockOnFileSelect = vi.fn();
        render(<FileUploader onFileSelect={mockOnFileSelect} error={null} />);

        expect(screen.queryByText(/Помилка обробки файлу/i)).not.toBeInTheDocument();
    });

    it('disables dropzone when isLoading is true', () => {
        const mockOnFileSelect = vi.fn();
        render(<FileUploader onFileSelect={mockOnFileSelect} isLoading />);

        const dropzone = screen.getByText(/Завантажити виписку/i).closest('div');
        if (dropzone) {
            fireEvent.click(dropzone);
        }

        expect(screen.getByTestId('bank-selector')).toBeInTheDocument();
    });

    it('calls onBankChange when bank is changed', () => {
        const mockOnFileSelect = vi.fn();
        const mockOnBankChange = vi.fn();
        render(
            <FileUploader
                onFileSelect={mockOnFileSelect}
                onBankChange={mockOnBankChange}
                selectedBank="Monobank"
            />
        );

        const privatbankButton = screen.getByTestId('bank-privatbank');
        fireEvent.click(privatbankButton);

        expect(mockOnBankChange).toHaveBeenCalledWith('PrivatBank');
    });

    it('uses selectedBank prop as initial value', () => {
        const mockOnFileSelect = vi.fn();
        render(<FileUploader onFileSelect={mockOnFileSelect} selectedBank="PrivatBank" />);

        const selectedBank = screen.getByTestId('selected-bank');
        expect(selectedBank).toHaveTextContent('PrivatBank');
    });

    it('disables bank selector when isLoading is true', () => {
        const mockOnFileSelect = vi.fn();
        const mockOnBankChange = vi.fn();
        render(
            <FileUploader
                onFileSelect={mockOnFileSelect}
                onBankChange={mockOnBankChange}
                isLoading
            />
        );

        const monobankButton = screen.getByTestId('bank-monobank');
        const privatbankButton = screen.getByTestId('bank-privatbank');

        expect(monobankButton).toBeDisabled();
        expect(privatbankButton).toBeDisabled();
    });

    it('does not call onFileSelect when disabled', () => {
        const mockOnFileSelect = vi.fn();
        render(<FileUploader onFileSelect={mockOnFileSelect} isLoading />);

        const dropzone = screen.getByText(/Завантажити виписку/i).closest('div');
        if (dropzone) {
            fireEvent.click(dropzone);
        }

        expect(mockOnFileSelect).not.toHaveBeenCalled();
    });
});
