export function cleanText(text: string): string {
    if (typeof text !== 'string') {
        return '';
    }

    return text
        .replace(/<span\s*style\s*=\s*"(color:\s*#ff0000;|color:\s*rgb\(0,\s*0,\s*0\);)">/gi, '')
        .replace(/<\/span>/gi, '')
        .replace(/<br\s*\/?>/gi, ', ') // replace <br> tags with commas
        .replace(/<th[^>]*>/gi, '') // remove all <th> tags including those with attributes
        .replace(/<\/th>/gi, '')    // remove closing </th> tags
        .replace(/<td[^>]*>/gi, '') // remove all <td> tags including those with attributes
        .replace(/<\/td>/gi, '')    // remove closing </td> tags
        .replace(/\s+/g, ' ') // replace multiple spaces with a single space
        .replace(/\b(\d)\s+(\d)\b/g, '$1$2') // combine digits separated by spaces
        .trim();
}
export class HttpError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}