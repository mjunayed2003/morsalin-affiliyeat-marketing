export function validateAndFormatUsaPhone(rawPhone) {
    if (!rawPhone || typeof rawPhone !== 'string') {
        return {
            isValid: false,
            formatted: '',
            rawDigits: '',
            error: 'USA phone number is required.',
        };
    }
    const cleaned = rawPhone.trim();
    let digitsOnly = cleaned.replace(/\D/g, '');
    if ((cleaned.startsWith('+1') || cleaned.startsWith('1')) && digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
        digitsOnly = digitsOnly.slice(1);
    }
    if (digitsOnly.length !== 10) {
        return {
            isValid: false,
            formatted: '',
            rawDigits: digitsOnly,
            error: 'Only USA phone numbers are allowed. Please enter a valid 10-digit US phone number (e.g. +1 555-123-4567).',
        };
    }
    const nanpRegex = /^[2-9]\d{2}[2-9]\d{6}$/;
    if (!nanpRegex.test(digitsOnly)) {
        return {
            isValid: false,
            formatted: '',
            rawDigits: digitsOnly,
            error: 'Invalid USA phone number. US area code and exchange code cannot start with 0 or 1.',
        };
    }
    return {
        isValid: true,
        formatted: `+1${digitsOnly}`,
        rawDigits: digitsOnly,
    };
}
export function formatUsaPhoneDisplay(phone) {
    if (!phone)
        return '';
    const digits = phone.replace(/\D/g, '').slice(-10);
    if (digits.length === 10) {
        return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return phone;
}
//# sourceMappingURL=phone.util.js.map