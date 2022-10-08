/**
 * Language type for syntax highlight
 */
export interface HighlightLanguage {
    /**
     * Name of the language
     *
     * The name to be used for the class name,
     * e.g. `class="language-typescript"`
     */
    name: string;
    /**
     * Extension of the language
     *
     * The file extension, which will be used for the
     * class name, e.g. `class="ext-ts"`
     */
    ext: string;
    /**
     * Aliases that point to this language
     *
     * Do not conflict with other languages
     */
    aliases: string[];
}
export declare const languageBash: HighlightLanguage;
export declare const languageCsharp: HighlightLanguage;
export declare const languageDocker: HighlightLanguage;
export declare const languageFsharp: HighlightLanguage;
export declare const languageJavascript: HighlightLanguage;
export declare const languageKotlin: HighlightLanguage;
export declare const languageMarkdown: HighlightLanguage;
export declare const languagePython: HighlightLanguage;
export declare const languageRuby: HighlightLanguage;
export declare const languageRust: HighlightLanguage;
export declare const languageStylus: HighlightLanguage;
export declare const languageTypescript: HighlightLanguage;
export declare const languageYaml: HighlightLanguage;
