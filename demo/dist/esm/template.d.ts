export interface TemplatePlaceholder {
    index: number;
    name?: string;
    text?: string;
}
export declare type TemplateToken = string | TemplatePlaceholder;
export declare const stringifyTemplate: (ast: TemplateToken[]) => string;
export declare const parseTemplate: (format: string) => TemplateToken[];
