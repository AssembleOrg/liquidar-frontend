export const formatCuit = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 10) return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 10)}-${numbers.slice(10, 11)}`;
};

export const cleanCuit = (value: string): string => {
    return value.replace(/\D/g, '');
};