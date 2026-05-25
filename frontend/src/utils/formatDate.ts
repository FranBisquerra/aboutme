export function formatDate(dateStr: string | null): string {
    if (!dateStr) return 'Present'
    const [year, month] = dateStr.split('-').map(Number)
    return new Date(year, month - 1).toLocaleDateString('en-GB', {month: 'short', year: 'numeric'})
}
