

export function formatDate(date: Date, length: "long" | "short" = "short"): string
{
    return date.toLocaleDateString('en-US', { weekday: length, month: length, day: 'numeric', year: 'numeric' });
};