export function cleanText(text: string): string {
    return text
        .replace(/<span\s*style\s*=\s*"(color:\s*#ff0000;|color:\s*rgb\(0,\s*0,\s*0\);)">/g, '')
        .replace(/<\/span>/g, '')
        .replace(/<br\s*\/?>/g, '')
        .replace(/<p[^>]*>/g, '') // remove all <p> tags including those with attributes
        .replace(/<\/p>/g, '')    // remove closing </p> tags
        .replace(/\s+/g, '')     // replace multiple spaces with a single space
        .replace(/\b(\d)\s+(\d)\b/g, '$1$2') // remove spaces between single digits
        .trim();
}

export class HttpError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}