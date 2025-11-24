import type { FC } from 'react';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { BANK_DISPLAY_NAMES, BANK_NAMES } from '@/constants';
import type { BankType } from '@/constants';

interface BankSelectorProps {
    value: BankType;
    onChange: (bank: BankType) => void;
    disabled?: boolean;
}

export const BankSelector: FC<BankSelectorProps> = ({ value, onChange, disabled = false }) => {
    return (
        <div className="flex flex-col gap-3 mb-6">
            <Label className="text-sm text-muted-foreground font-medium text-center">
                Оберіть банк:
            </Label>
            <RadioGroup
                value={value}
                onValueChange={(val) => onChange(val as BankType)}
                disabled={disabled}
                className="flex gap-6 justify-center"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value={BANK_NAMES.MONOBANK} id="monobank" />
                    <Label htmlFor="monobank" className="text-sm font-medium cursor-pointer">
                        {BANK_DISPLAY_NAMES[BANK_NAMES.MONOBANK]}
                    </Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value={BANK_NAMES.PRIVATBANK} id="privatbank" />
                    <Label htmlFor="privatbank" className="text-sm font-medium cursor-pointer">
                        {BANK_DISPLAY_NAMES[BANK_NAMES.PRIVATBANK]}
                    </Label>
                </div>
            </RadioGroup>
        </div>
    );
};
