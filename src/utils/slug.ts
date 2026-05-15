export function slugify(input: string): string {
    const filename = input.split(/[\\/]/).pop() ?? input;
    const baseName = filename.replace(/\.[^.]+$/, '');

    return baseName
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}
