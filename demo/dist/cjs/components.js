"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.tBind = exports.T = exports.TText = exports.As = exports.Translate = exports.TranslateLocal = exports.useTranslation = void 0;
var react_1 = __importStar(require("react"));
var template_1 = require("./template");
var context_1 = require("./context");
var string_1 = require("./string");
var TContext = (0, react_1.createContext)(new context_1.LangContext());
/**
 * Hook that gets the currently active translation context. Here's an example
 * of a component that wraps the `Intl.DateTimeFormat` API using the translation
 * context.
 *
 * ```typescript
 * const TDateFormat: ComponentType<{ date: Date }> = ({ date }) => {
 *   // Get the context
 *   const ctx = useTranslation();
 *   // Use context's languages stack to find a format for our locale
 *   const dtf = new Intl.DateTimeFormat(ctx.languages);
 *   // Find out which language was matched...
 *   const { locale } = dtf.resolvedOptions();
 *   const ts = TString.literal(dtf.format(date), locale);
 *   return <T text={ts} />;
 * };
 * ```
 *
 * @returns the active translation context
 * @category Hooks
 */
var useTranslation = function () { return (0, react_1.useContext)(TContext); };
exports.useTranslation = useTranslation;
/**
 * Wrap components in a nested [[`LangContext`]]. Used to override settings in
 * the context. For example we can add an additional dictionary.
 *
 * ```typescript
 * const Miscount = ({ children }: { children: ReactNode }) => {
 *   // pretend one is three
 *   const dict = { $$dict: { one: { en: "three" } } };
 *   return <TranslateLocal dictionary={dict}>{children}</TranslateLocal>;
 * };
 * ```
 * @category Components
 */
var TranslateLocal = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var ctx = (0, exports.useTranslation)().derive(props);
    return react_1.default.createElement(TContext.Provider, { value: ctx }, children);
};
exports.TranslateLocal = TranslateLocal;
/**
 * Wrap components in a nested [[`LangContext`]] that establishes a new
 * language stack. By default any children will be wrapped in a `div` with
 * a `lang=` property that indicates the language of the wrapped content.
 *
 * Within this context any content which can't be translated into the requested
 * languages will have it's own `lang=` property to reflect the fact that it
 * is in a different language than expected.
 *
 * ```typescript
 * // Renders as <div lang="cy">....</div>
 * const Welsh: ComponentType<{ children: ReactNode }> = ({ children }) => (
 *   <Translate lang="cy">{children}</Translate>
 * );
 *
 * // Renders as <section lang="cy">....</section>
 * const WelshSection: ComponentType<{ children: ReactNode }> = ({ children }) => (
 *   <Translate as="section" lang="cy">
 *     {children}
 *   </Translate>
 * );
 * ```
 *
 * Unlike [[`TranslateLocal`]] `Translate` always wraps the translated
 * content in an element with a `lang=` property.
 *
 * @category Components
 */
var Translate = function (_a) {
    var as = _a.as, children = _a.children, props = __rest(_a, ["as", "children"]);
    var ctx = (0, exports.useTranslation)().derive(props);
    return (react_1.default.createElement(exports.TText, { as: as || "div", lang: ctx.language },
        react_1.default.createElement(TContext.Provider, { value: ctx }, children)));
};
exports.Translate = Translate;
exports.As = (0, react_1.forwardRef)(function (_a, ref) {
    var as = _a.as, children = _a.children, rest = __rest(_a, ["as", "children"]);
    var Component = as || "span";
    return (react_1.default.createElement(Component, __assign({}, rest, { ref: ref }), children));
});
exports.As.displayName = "As";
exports.TText = (0, react_1.forwardRef)(function (_a, ref) {
    var as = _a.as, lang = _a.lang, children = _a.children, props = __rest(_a, ["as", "lang", "children"]);
    var ctx = (0, exports.useTranslation)();
    if (lang !== ctx.ambience) {
        var ctxProps = ctx.retainAmbience ? { lang: lang } : { ambient: lang };
        return (react_1.default.createElement(exports.TranslateLocal, __assign({}, ctxProps),
            react_1.default.createElement(exports.As, __assign({ as: as || "span", ref: ref }, props, { lang: lang }), children)));
    }
    return (react_1.default.createElement(exports.As, __assign({ as: as || "span", ref: ref }, props), children));
});
exports.TText.displayName = "TText";
var TFormat = (0, react_1.forwardRef)(function (_a, ref) {
    var format = _a.format, lang = _a.lang, children = _a.children;
    var clone = function (elt, props) {
        if ((0, react_1.isValidElement)(elt))
            return (0, react_1.cloneElement)(elt, props);
        if (process.env.NODE_ENV !== "production")
            throw new Error("Can't add props to a non-element");
    };
    var parts = (0, template_1.parseTemplate)(format);
    // Bail out quickly in the simple case
    if (parts.length === 1 && typeof parts[0] === "string")
        return react_1.default.createElement(react_1.Fragment, null, parts[0]);
    // Make children into a regular array of nodes
    var params = react_1.Children.toArray(children);
    if (process.env.NODE_ENV !== "production")
        if (ref && params.length !== 1)
            // Passing a ref is a special case which only allows
            // a single child
            throw new Error("Can only forward refs to single children");
    // Set of available indexes
    var avail = new Set(params.map(function (_x, i) { return i + 1; }));
    var dict = { $$dict: {} };
    // Output nodes
    var out = parts.map(function (part) {
        if (typeof part === "string")
            return part;
        var index = part.index, name = part.name, text = part.text;
        if (name && text)
            dict.$$dict[name] = string_1.TString.literal(text, lang).dictionary;
        if (index < 1 || index > params.length)
            throw new Error("Arg out of range %".concat(index, " (1..").concat(params.length, " are valid)"));
        if (!avail.has(index))
            throw new Error("Already using arg %".concat(index));
        // Mark it used
        avail.delete(index);
        // If we're passing a ref clone it in. Only do this to the first
        // parameter. This check pretty redundant - there's a check above
        // that enforces singularity in the ref passed case.
        if (ref && index === 1)
            return clone(params[index - 1], { ref: ref });
        return params[index - 1];
    });
    if (process.env.NODE_ENV !== "production")
        if (avail.size)
            throw new Error("Unused args: ".concat(avail));
    if (Object.keys(dict.$$dict).length)
        return react_1.default.createElement(exports.TranslateLocal, { dictionary: dict }, out);
    return react_1.default.createElement(react_1.Fragment, null, out);
});
TFormat.displayName = "TFormat";
function resolveTranslationProps(ctx, tag, text) {
    var r = function () {
        if (process.env.NODE_ENV !== "production")
            if (tag && text)
                throw new Error("Got both tag and text");
        if (text)
            return ctx.resolve(text);
        if (tag)
            return ctx.resolve([tag]);
        // istanbul ignore next - can't happen
        throw new Error("No text or tag");
    };
    return r().toLang(ctx.languages);
}
var noRef = function (ref) {
    if (ref)
        throw new Error("Can't pass ref");
};
/**
 * A wrapper for content that should be translated. It attempts to translate
 * the content you give it according to the active [[`LangContext`]]. It can
 * translate content looked up in the translation dictionary and fat strings
 * (or [[`TString`]]s).
 *
 * It can optionally perform template substitution on the translated text,
 * allowing child components to render portions of the translated text
 * with arbitrary wrappers.
 *
 * By default translated text is wrapped in a `span`. Render a different
 * element using the `as` property.
 *
 * If the wrapped content can't be translated into the context's preferred
 * language it will have a `lang=` property specifying its actual language.
 *
 * The simplest usage is to render translatable content without template
 * substition:
 *
 * ```typescript
 * // Render multilingual content
 * const hi = { en: "Hello", de: "Hallo", fr: "Bonjour" };
 * return <T content={hi} />;
 * // fr: <span>Bonjour</span>
 * ```
 *
 * Template substitution allows you to build whole component trees from a
 * translated string:
 *
 * ```typescript
 * const info = {
 *   en: "Here's a %1[useful link] and here's some %2[italic text]",
 *   fr: "Voici %2[du texte en italique] et un %1[lien utile]",
 *   de: "Hier ist ein %1[nützlicher Link] und hier ein %2[kursiver Text]"
 * };
 * return (
 *   <T as="div" text={info}>
 *     <T as="a" tag="%1" href="/" />
 *     <T as="i" tag="%2" />
 *   </T>
 * );
 * // fr:
 * //   <div>
 * //     Voici <i>du texte en italique</i> et un <a href="/">lien utile</a>
 * //   </div>
 * ```
 *
 * You can also look up and translate dictionary tags:
 *
 * ```typescript
 * // Same as the previous example if `info` is in the dictionary
 * return (
 *   <T as="div" tag="info">
 *     <T as="a" tag="%1" href="/" />
 *     <T as="i" tag="%2" />
 *   </T>
 * );
 * ```
 *
 * See [Using T](/Interminimal/index.html#using-t) for more examples.
 *
 * @category Components
 */
exports.T = (0, react_1.forwardRef)(function (_a, ref) {
    var as = _a.as, tag = _a.tag, text = _a.text, content = _a.content, count = _a.count, children = _a.children, props = __rest(_a, ["as", "tag", "text", "content", "count", "children"]);
    var ctx = (0, exports.useTranslation)();
    if (content) {
        if (process.env.NODE_ENV !== "production") {
            if (tag || text)
                throw new Error("Please don't mix content with tag or text");
            noRef(ref);
        }
        var ts = ctx.translate(content);
        return (react_1.default.createElement(exports.TText, __assign({ as: as || "span", lang: ts.language }, ctx.resolveMagicProps(props, ts.language)), ts.toString(count)));
    }
    if (tag || text) {
        var ts = resolveTranslationProps(ctx, tag, text);
        return (react_1.default.createElement(exports.TText, __assign({ as: as || "span", lang: ts.language }, ctx.resolveMagicProps(props, ts.language)),
            react_1.default.createElement(TFormat, { ref: ref, lang: ts.language, format: ctx.render(ts, count) }, children)));
    }
    if (process.env.NODE_ENV !== "production")
        noRef(ref);
    return (react_1.default.createElement(exports.TText, __assign({ as: as || "span", lang: ctx.defaultLang }, ctx.resolveMagicProps(props)), children));
});
exports.T.displayName = "T";
var boundMap = new Map();
/**
 * Create a new component that behaves like `<T>` but with a different default
 * `as` element.
 *
 * ```typescript
 * const Toption = tBind("option");
 * // later
 * return <Toption value="1" tag="one" />
 * ```
 *
 * It's also possible to wrap React components.
 *
 * ```typescript
 * const TImage = tBind(Image as FunctionComponent);
 * ```
 *
 * The need for the cast is ugly. Not sure how to fix that. PRs welcome...
 *
 * The generated components are cached - so whenever you call `tBind("p")` you
 * will get the same component.
 *
 * @category Utilities
 */
//  Type '{ as: C; ref: ForwardedRef<ReactElement<any, string | JSXElementConstructor<any>>>; } & Omit<TProps<C>, "children"> & { ...; }'
//    is not assignable to type 'IntrinsicAttributes & { tag?: string | undefined; text?: TextPropType | undefined; content?: TextPropType | undefined; count?: number | undefined; } & AsProperty<...> & { ...; } & Omit<...> & { ...; }'.
//  Type '{ as: C; ref: ForwardedRef<ReactElement<any, string | JSXElementConstructor<any>>>; } & Omit<TProps<C>, "children"> & { ...; }'
//    is not assignable to type 'Omit<PropsWithoutRef<ComponentProps<C>>, "text" | "as" | "content" | "tag" | "count">'.ts(2322)
var tBind = function (as) {
    var bind = function (as) {
        var bound = (0, react_1.forwardRef)(function (_a, ref) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (
            // @ts-ignore hmm...
            react_1.default.createElement(exports.T, __assign({ as: as, ref: ref }, props), children));
        });
        var asName = typeof as === "string" ? as : as.displayName;
        if (asName) {
            bound.displayName = "T".concat(asName);
            Object.defineProperty(bound, "name", { value: bound.displayName });
        }
        return bound;
    };
    var bound = boundMap.get(as);
    if (!bound)
        boundMap.set(as, (bound = bind(as)));
    return bound;
};
exports.tBind = tBind;
