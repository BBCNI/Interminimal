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
import React, { createContext, createElement, Children, useContext, Fragment, cloneElement, isValidElement, forwardRef } from "react";
import { parseTemplate } from "./template";
import { LangContext } from "./context";
import { TString } from "./string";
var TContext = createContext(new LangContext());
export var useTranslation = function () { return useContext(TContext); };
export var TranslateLocal = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var ctx = useTranslation().derive(props);
    return React.createElement(TContext.Provider, { value: ctx }, children);
};
export var Translate = function (_a) {
    var children = _a.children, _b = _a.as, as = _b === void 0 ? "div" : _b, props = __rest(_a, ["children", "as"]);
    var ctx = useTranslation().derive(props);
    return (React.createElement(TText, { as: as, lang: ctx.language },
        React.createElement(TContext.Provider, { value: ctx }, children)));
};
// Create a component with the specified tag
var As = forwardRef(function (_a, ref) {
    var as = _a.as, children = _a.children, props = __rest(_a, ["as", "children"]);
    return createElement(as, __assign({ ref: ref }, props), children);
});
As.displayName = "As";
export var TText = forwardRef(function (_a, ref) {
    var children = _a.children, lang = _a.lang, as = _a.as, props = __rest(_a, ["children", "lang", "as"]);
    var ctx = useTranslation();
    if (lang !== ctx.ambience)
        return (React.createElement(TranslateLocal, { ambient: lang },
            React.createElement(As, __assign({ as: as, ref: ref }, props, { lang: lang }), children)));
    return (React.createElement(As, __assign({ as: as, ref: ref }, props), children));
});
TText.displayName = "TText";
export var TFormat = forwardRef(function (_a, ref) {
    var format = _a.format, lang = _a.lang, children = _a.children;
    var clone = function (elt, props) {
        return isValidElement(elt) ? cloneElement(elt, props) : elt;
    };
    var parts = parseTemplate(format);
    // Bail out quickly in the simple case
    if (parts.length === 1 && typeof parts[0] === "string")
        return React.createElement(Fragment, null, parts[0]);
    // Make children into a regular array of nodes
    var params = Children.map(children, function (x) { return x; }) || [];
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
            dict.$$dict[name] = TString.literal(text, lang).dictionary;
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
        return React.createElement(TranslateLocal, { dictionary: dict }, out);
    return React.createElement(Fragment, null, out);
});
TFormat.displayName = "TFormat";
export var T = forwardRef(function (_a, ref) {
    var children = _a.children, tag = _a.tag, text = _a.text, content = _a.content, count = _a.count, _b = _a.as, as = _b === void 0 ? "span" : _b, props = __rest(_a, ["children", "tag", "text", "content", "count", "as"]);
    var ctx = useTranslation();
    if (content) {
        if (tag || text)
            throw new Error("Please don't mix content with tag or text");
        var ts = ctx.translate(content);
        return (React.createElement(TText, __assign({ as: as, ref: ref, lang: ts.language }, ctx.resolveMagicProps(props, ts.language)), ts.toString(count)));
    }
    if (tag || text) {
        var ts = ctx.resolveTranslationProps(tag, text);
        return (React.createElement(TText, __assign({ as: as, lang: ts.language }, ctx.resolveMagicProps(props, ts.language)),
            React.createElement(TFormat, { lang: ts.language, format: ctx.render(ts, count) }, children)));
    }
    return (React.createElement(TText, __assign({ as: as, ref: ref, lang: ctx.defaultLang }, ctx.resolveMagicProps(props)), children));
});
T.displayName = "T";
var boundMap = new Map();
export var tBind = function (as) {
    var bind = function (as) {
        var _a;
        var bound = forwardRef(function (_a, ref) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (React.createElement(T, __assign({ as: as, ref: ref }, props), children));
        });
        var asName = typeof as === "string" ? as : (_a = as.displayName) !== null && _a !== void 0 ? _a : as.name;
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
export var tBindMulti = function (as) { return as.map(tBind); };
