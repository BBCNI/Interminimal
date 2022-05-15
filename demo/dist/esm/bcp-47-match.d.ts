export declare type Tag = string;
export declare type Tags = Array<Tag>;
export declare type Range = string;
export declare type Ranges = Array<Range>;
export declare type Check = (tag: Tag, range: Range) => boolean;
/**
 * Lookup (Section 3.4) matches a language priority list consisting of basic
 * language ranges to sets of language tags to find the one exact language tag
 * that best matches the range.
 */
export declare const lookup: (tags: Tags, ranges: Ranges) => string | undefined;
