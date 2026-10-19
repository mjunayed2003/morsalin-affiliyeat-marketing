/**
 * USA Phone Validation and Formatting for Next.js Frontend
 * Complies with North American Numbering Plan (NANP, Country Code +1)
 */

export function validateUsaPhone(rawPhone: string): {
  isValid: boolean;
  formattedE164: string;
  displayFormatted: string;
  error?: string;
} {
  if (!rawPhone || !rawPhone.trim()) {
    return {
      isValid: false,
      formattedE164: '',
      displayFormatted: '',
      error: 'USA phone number is required.',
    };
  }

  const cleaned = rawPhone.trim();
  let digits = cleaned.replace(/\D/g, '');

  // Strip leading 1 if 11 digits
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) {
    return {
      isValid: false,
      formattedE164: '',
      displayFormatted: '',
      error: 'Please enter a complete 10-digit USA phone number.',
    };
  }

  // NANP check: first digit of area code and exchange code must be [2-9]
  const nanpRegex = /^[2-9]\d{2}[2-9]\d{6}$/;
  if (!nanpRegex.test(digits)) {
    return {
      isValid: false,
      formattedE164: '',
      displayFormatted: '',
      error: 'Invalid USA number. Area code and exchange code cannot start with 0 or 1.',
    };
  }

  const display = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return {
    isValid: true,
    formattedE164: `+1${digits}`,
    displayFormatted: display,
  };
}

export function formatUsaPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  
  // Remove leading 1 if user typed country code
  const usDigits = digits.length > 10 && digits.startsWith('1') ? digits.slice(1) : digits;
  const trimmed = usDigits.slice(0, 10);

  if (trimmed.length === 0) return '';
  if (trimmed.length <= 3) return `(${trimmed}`;
  if (trimmed.length <= 6) return `(${trimmed.slice(0, 3)}) ${trimmed.slice(3)}`;
  return `(${trimmed.slice(0, 3)}) ${trimmed.slice(3, 6)}-${trimmed.slice(6)}`;
}
