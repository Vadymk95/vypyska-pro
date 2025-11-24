import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BANK_NAMES } from '@/constants';

import { BankSelector } from './BankSelector';

describe('BankSelector', () => {
    it('renders both bank options', () => {
        const mockOnChange = vi.fn();
        render(<BankSelector value={BANK_NAMES.MONOBANK} onChange={mockOnChange} />);

        expect(screen.getByLabelText('Monobank')).toBeInTheDocument();
        expect(screen.getByLabelText('PrivatBank')).toBeInTheDocument();
        expect(screen.getByText('Оберіть банк:')).toBeInTheDocument();
    });

    it('shows Monobank as selected when value is Monobank', () => {
        const mockOnChange = vi.fn();
        render(<BankSelector value={BANK_NAMES.MONOBANK} onChange={mockOnChange} />);

        const monobankRadio = screen.getByLabelText('Monobank') as HTMLInputElement;
        expect(monobankRadio).toBeChecked();
    });

    it('shows PrivatBank as selected when value is PrivatBank', () => {
        const mockOnChange = vi.fn();
        render(<BankSelector value={BANK_NAMES.PRIVATBANK} onChange={mockOnChange} />);

        const privatbankRadio = screen.getByLabelText('PrivatBank') as HTMLInputElement;
        expect(privatbankRadio).toBeChecked();
    });

    it('calls onChange when Monobank is selected', () => {
        const mockOnChange = vi.fn();
        render(<BankSelector value={BANK_NAMES.PRIVATBANK} onChange={mockOnChange} />);

        const monobankRadio = screen.getByLabelText('Monobank');
        fireEvent.click(monobankRadio);

        expect(mockOnChange).toHaveBeenCalledWith(BANK_NAMES.MONOBANK);
    });

    it('calls onChange when PrivatBank is selected', () => {
        const mockOnChange = vi.fn();
        render(<BankSelector value={BANK_NAMES.MONOBANK} onChange={mockOnChange} />);

        const privatbankRadio = screen.getByLabelText('PrivatBank');
        fireEvent.click(privatbankRadio);

        expect(mockOnChange).toHaveBeenCalledWith(BANK_NAMES.PRIVATBANK);
    });

    it('disables radio buttons when disabled prop is true', () => {
        const mockOnChange = vi.fn();
        render(<BankSelector value={BANK_NAMES.MONOBANK} onChange={mockOnChange} disabled />);

        const monobankRadio = screen.getByLabelText('Monobank') as HTMLInputElement;
        const privatbankRadio = screen.getByLabelText('PrivatBank') as HTMLInputElement;

        expect(monobankRadio).toBeDisabled();
        expect(privatbankRadio).toBeDisabled();
    });

    it('does not call onChange when disabled', () => {
        const mockOnChange = vi.fn();
        render(<BankSelector value={BANK_NAMES.MONOBANK} onChange={mockOnChange} disabled />);

        const privatbankRadio = screen.getByLabelText('PrivatBank');
        fireEvent.click(privatbankRadio);

        expect(mockOnChange).not.toHaveBeenCalled();
    });
});
