var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import castArray from "lodash/castArray";
import { TString } from "./string";
import { localeRoot, resolveLocales } from "./resolveLocale";
import { searchOrder } from "./searchOrder";
import { checkDictionary, isDictionary, nextDict, rootDict } from "./dictionary";
/**
 * A language context. All translation takes place inside a context and contexts
 * nest to allow their configuration to be modified. Normally you'll get a context
 * using the [[`useTranslation`]] hook.
 *
 * @category LangContext
 */
var LangContext = /** @class */ (function () {
    /**
     * Create a new LangContext. Normally you won't need to do this; the root
     * context is initialised by _Interminimal_ and child contexts are created
     * using [[`derive`]]. In React use the [[`useTranslation`]] to get the active
     * [[`LangContext`]].
     *
     * @param props initial properties for this context
     */
    function LangContext(props) {
        if (props === void 0) { props = {}; }
        /**
         * The default language for this context. Used for any non-translated content.
         */
        this.defaultLang = "en";
        /** @ignore */
        this.stack = localeRoot;
        /**
         * Whether to pass ambient language down the context stack.
         */
        this.retainAmbience = false;
        var lang = props.lang, dictionary = props.dictionary, rest = __rest(props, ["lang", "dictionary"]);
        Object.assign(this, __assign({}, rest));
        var baseDict = this.parent ? this.parent.dictionary : rootDict;
        if (dictionary) {
            if (process.env.NODE_ENV !== "production")
                checkDictionary(dictionary);
            this.dictionary = nextDict.next(baseDict, dictionary);
        }
        else {
            this.dictionary = baseDict;
        }
        var lastStack = this.parent
            ? this.parent.stack
            : resolveLocales(localeRoot, [this.defaultLang]);
        this.stack = resolveLocales(lastStack, castArray(lang).filter(Boolean));
    }
    Object.defineProperty(LangContext.prototype, "languages", {
        /**
         * Get the language preference stack for this context. The `languages`
         * array is always normalised - duplicates are removed.
         *
         * ```typescript
         * const ctx = new LangContext({ lang: "cy", defaultLang: "en" });
         * expect(ctx.languages).toEqual(["cy", "en"]);
         *
         * const ctx2 = ctx.derive({ lang: "de", defaultLang: "fr" });
         * expect(ctx2.languages).toEqual(["de", "fr", "cy", "en"]);
         *
         * // "en" de-duplicated from languages
         * const ctx3 = ctx2.derive({ lang: "en" });
         * expect(ctx3.languages).toEqual(["en", "de", "fr", "cy"]);
         *
         * // Start from scratch with an explicit lang stack
         * const ctx4 = new LangContext({ lang: ["en", "de", "fr", "cy"] });
         *
         * // All equivalent stacks are the same object
         * expect(ctx4.languages).toBe(ctx3.languages);
         * ```
         *
         * Equivalent language arrays are always the same object. This makes
         * it possible to use `languages` in e.g. `React.useMemo()` to
         * perform expensive operations only when the language stack changes.
         *
         */
        get: function () {
            return this.stack;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LangContext.prototype, "search", {
        /**
         * The context's language expanded for searching. The expansion of a
         * particular language stack is canonicalised and cached - different
         * contexts with the same [[`languages`]] will have the same `search`
         * property too.
         *
         * ```typescript
         * const ctx = new LangContext({
         *   lang: ["en-GB-x-foo", "en-US", "fr-CA", "de-AT"]
         * });
         * // Search path expands and groups tags
         * console.log(ctx.search);
         * // [
         * //   "en-GB-x-foo",
         * //   "en-GB",
         * //   "en-US",
         * //   "en",
         * //   "fr-CA",
         * //   "fr",
         * //   "de-AT",
         * //   "de"
         * // ]
         * ```
         *
         * The rules for tag expansion are slightly subtle. Notice in the
         * example above that "en" is only injected after both "en-GB"
         * and "en-US".
         */
        get: function () {
            return searchOrder(this.stack);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LangContext.prototype, "language", {
        /**
         * The current language. This is the same as the first element of the [[`languages`]] array.
         */
        get: function () {
            return this.stack[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LangContext.prototype, "ambience", {
        /**
         * The ambient language. This is defined in contexts which can't match the desired language
         * so that a `lang=` attribute can be added to nested elements
         */
        get: function () {
            return this.ambient || this.language;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Create a new context nested below this one overriding any properties as desired.
     *
     * ```typescript
     * const root = new LangContext({ lang: ["en-GB"], defaultLang: "en" });
     * const welsh = root.derive({ lang: "cy" });
     * console.log(welsh.languages); // ['cy', 'en-GB', 'en']
     * ```
     *
     * @param props properties to override
     * @returns a nested context
     */
    LangContext.prototype.derive = function (props) {
        var _this = this;
        // Handle dictionaryFromTag
        var trDFT = function (_a) {
            var dictionaryFromTag = _a.dictionaryFromTag, rest = __rest(_a, ["dictionaryFromTag"]);
            if (!dictionaryFromTag)
                return rest;
            if (props.dictionary)
                throw new Error("dictionary and dictionaryFromTag both found");
            return __assign({ dictionary: _this.resolveDictionary(dictionaryFromTag) }, rest);
        };
        var trDL = function (_a) {
            var defaultLang = _a.defaultLang, rest = __rest(_a, ["defaultLang"]);
            if (!defaultLang)
                return rest;
            var lang = rest.lang, other = __rest(rest, ["lang"]);
            return __assign({ defaultLang: defaultLang, lang: castArray(lang || []).concat(defaultLang) }, other);
        };
        var _a = this, dictionary = _a.dictionary, stack = _a.stack, rest = __rest(_a, ["dictionary", "stack"]);
        return new LangContext(__assign(__assign(__assign({}, rest), trDFT(trDL(props))), { parent: this }));
    };
    /**
     * Resolve a `[tag]`, string, TString, fat string and translate it according
     * to this context's languages.
     *
     * @param text the thing to translate
     * @returns a TString with the best language match selected
     */
    LangContext.prototype.translate = function (text) {
        return this.resolve(text).toLang(this.stack);
    };
    /**
     * This is a convenience method which may be useful when wrapping components
     * that don't work well with _Interminimal_. For example here's how we can set
     * the page title using NextJS's `Head` component.
     *
     * ```typescript
     * // Inject page title into a NextJS <Head> component. We have to do the
     * // translation explicitly because we can't nest a T inside a Head
     * // Use this component *outside* of any other <Head></Head>
     * const TTitle: ComponentType<TTitleProps> = ({ text, ...rest }) => {
     *   // Translate text and props
     *   const { str, props } = useTranslation().translateTextAndProps(text, rest);
     *   return (
     *     <Head>
     *       <title {...props}>{str}</title>
     *     </Head>
     *   );
     * };
     * ```
     *
     * @param text the text to translate
     * @param props a React style props object
     * @param count how many of a thing we have for pluralisation
     * @returns an object `{ str, props }` containing the translated text and properties.
     */
    // Convenience method: given a TString (or [tag]) and a props object, translate the
    // string into the current language and update the props' lang attribute as
    // appropriate
    LangContext.prototype.translateTextAndProps = function (text, _a, count) {
        if (_a === void 0) { _a = {}; }
        var lang = _a.lang, props = __rest(_a, ["lang"]);
        var ts = this.translate(text);
        var str = this.render(ts, count);
        if (ts.language !== this.ambience)
            return { str: str, props: __assign(__assign({}, props), { lang: ts.language }) };
        return { str: str, props: props };
    };
    /**
     * Turn something stringy into a TString. A plain string turns into a TString
     * with its language set to [[`defaultLang`]].
     *
     * @param text a string, TString or fat string
     * @returns a TString that represents `text`
     */
    LangContext.prototype.castString = function (text) {
        if (typeof text === "string")
            return TString.literal(text, this.defaultLang);
        return TString.cast(text);
    };
    /**
     * Resolve a text property which can be
     *
     * * a single element array containing the name of a tag
     * * an existing TString or TFatString
     * * a plain string
     *
     * Tags are resolved against the dictionary chain. Plain strings
     * are converted into a TString with the context's [[`defaultLang`]].
     *
     * @param text `[tag]`, a TString or a plain JS string
     * @returns a `TString` containing the translation
     */
    LangContext.prototype.resolve = function (text) {
        if (Array.isArray(text)) {
            if (text.length !== 1)
                throw new Error("A tag must be an array of length 1");
            return this.resolveTag(text[0]);
        }
        return this.castString(text);
    };
    /** @ignore */
    LangContext.prototype.lookupTag = function (tag) {
        return this.dictionary.$$dict[tag];
    };
    /**
     * Check whether this context can resolve a particular tag. Use it to guard
     * translation tags which might be missing.
     *
     * @param tag the dictionary tag to check
     * @returns true if `tag` can be resolved
     */
    LangContext.prototype.hasTag = function (tag) {
        return !!this.lookupTag(tag);
    };
    /** @ignore */
    LangContext.prototype.findTag = function (tag) {
        var hit = this.lookupTag(tag);
        if (hit)
            return hit;
        throw new Error("No translation for ".concat(tag));
    };
    /** @ignore */
    LangContext.prototype.resolveTag = function (tag) {
        var it = this.findTag(tag);
        if (isDictionary(it))
            throw new Error("".concat(tag, " is a dictionary"));
        return this.castString(it);
    };
    /** @ignore */
    LangContext.prototype.resolveDictionary = function (tag) {
        var it = this.findTag(tag);
        if (!isDictionary(it))
            throw new Error("".concat(tag, " is not a dictionary"));
        return it;
    };
    /**
     * Get a new language stack that prepends languages to the context's stack.
     *
     * ```typescript
     * const ctx = new LangContext({lang:"en"});
     * console.log(ctx.resolveLocales(["cy"])); // ["cy", "en"]
     * ```
     *
     * @param langs languages to prepend to context's stack
     * @returns a language array that prepends `langs` to the context's stack
     */
    LangContext.prototype.resolveLocales = function (langs) {
        return resolveLocales(this.stack, langs);
    };
    /**
     * Translate a React style props object by replacing any `t-foo` properties with
     * `foo` containing translated text. The value of any `t-*` properties should be
     * capable of being resolved by [[`resolve`]].
     *
     * @param props a properties object to translate
     * @param lang an additional language to add to the context's stack
     * @returns a new props object with `t-*` entries translated
     */
    LangContext.prototype.resolveMagicProps = function (props, lang) {
        var _this = this;
        var mapMagic = function (k) {
            var m = k.match(/^t-(.+)$/);
            if (m)
                return m[1];
        };
        var search = lang ? this.resolveLocales([lang]) : this.stack;
        var pairs = Object.entries(props).map(function (_a) {
            var _b = __read(_a, 2), k = _b[0], v = _b[1];
            var nk = mapMagic(k);
            if (nk)
                return [nk, _this.render(_this.resolve(v).toLang(search))];
            return [k, v];
        });
        return Object.fromEntries(pairs);
    };
    /**
     * Convert a [[`TString`]] to a string expanding any `%{tag}` expansions. Expansions
     * are recursively looked up in the dictionary chain. Any `%` that isn't part of
     * a tag expansion should be escaped as `%%`
     *
     * @param ts the string to render
     * @param count the number of things in case of pluralisation
     * @returns a string with any `%{tag}` references resolved.
     */
    LangContext.prototype.render = function (ts, count) {
        var _this = this;
        var stack = this.resolveLocales([ts.language]);
        return ts
            .toString(count)
            .split(/(%%|%\{[^%]+?\})/)
            .map(function (tok) {
            return (function (match) {
                return match
                    ? _this.resolveTag(match[1]).toLang(stack).toString(count)
                    : tok;
            })(tok.match(/^%\{(.+)\}$/));
        })
            .join("");
    };
    return LangContext;
}());
export { LangContext };
