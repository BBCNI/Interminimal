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
exports.tBindMulti = exports.tBind = exports.T = exports.TFormat = exports.TText = exports.As = exports.Translate = exports.TranslateLocal = exports.useTranslation = void 0;
var react_1 = __importStar(require("react"));
var template_1 = require("./template");
var context_1 = require("./context");
var string_1 = require("./string");
var TContext = (0, react_1.createContext)(new context_1.LangContext());
var useTranslation = function () { return (0, react_1.useContext)(TContext); };
exports.useTranslation = useTranslation;
var TranslateLocal = function (_a) {
    var children = _a.children, props = __rest(_a, ["children"]);
    var ctx = (0, exports.useTranslation)().derive(props);
    return react_1.default.createElement(TContext.Provider, { value: ctx }, children);
};
exports.TranslateLocal = TranslateLocal;
var Translate = function (_a) {
    var children = _a.children, _b = _a.as, as = _b === void 0 ? "div" : _b, props = __rest(_a, ["children", "as"]);
    var ctx = (0, exports.useTranslation)().derive(props);
    return (react_1.default.createElement(exports.TText, { as: as, lang: ctx.language },
        react_1.default.createElement(TContext.Provider, { value: ctx }, children)));
};
exports.Translate = Translate;
// Create a component with the specified tag
exports.As = (0, react_1.forwardRef)(function (_a, ref) {
    var as = _a.as, children = _a.children, props = __rest(_a, ["as", "children"]);
    return (0, react_1.createElement)(as, __assign({ ref: ref }, props), children);
});
exports.As.displayName = "As";
exports.TText = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, lang = _a.lang, _b = _a.as, as = _b === void 0 ? "span" : _b, props = __rest(_a, ["children", "lang", "as"]);
    var ctx = (0, exports.useTranslation)();
    console.log("in TText ambience is ".concat(ctx.ambience, " and lang is ").concat(lang));
    if (lang !== ctx.ambience)
        return (react_1.default.createElement(exports.TranslateLocal, { ambient: lang },
            react_1.default.createElement(exports.As, __assign({ as: as, ref: ref }, props, { lang: lang }), children)));
    return (react_1.default.createElement(exports.As, __assign({ as: as, ref: ref }, props), children));
});
exports.TText.displayName = "TText";
exports.TFormat = (0, react_1.forwardRef)(function (_a, ref) {
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
    var params = react_1.Children.map(children, function (x) { return x; });
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
exports.TFormat.displayName = "TFormat";
var noRef = function (ref) {
    if (ref)
        throw new Error("Can't pass ref");
};
exports.T = (0, react_1.forwardRef)(function (_a, ref) {
    var children = _a.children, tag = _a.tag, text = _a.text, content = _a.content, count = _a.count, _b = _a.as, as = _b === void 0 ? "span" : _b, props = __rest(_a, ["children", "tag", "text", "content", "count", "as"]);
    var ctx = (0, exports.useTranslation)();
    if (content) {
        if (process.env.NODE_ENV !== "production") {
            if (tag || text)
                throw new Error("Please don't mix content with tag or text");
            noRef(ref);
        }
        var ts = ctx.translate(content);
        return (react_1.default.createElement(exports.TText, __assign({ as: as, lang: ts.language }, ctx.resolveMagicProps(props, ts.language)), ts.toString(count)));
    }
    if (tag || text) {
        var ts = ctx.resolveTranslationProps(tag, text);
        return (react_1.default.createElement(exports.TText, __assign({ as: as, lang: ts.language }, ctx.resolveMagicProps(props, ts.language)),
            react_1.default.createElement(exports.TFormat, { ref: ref, lang: ts.language, format: ctx.render(ts, count) }, children)));
    }
    if (process.env.NODE_ENV !== "production")
        noRef(ref);
    return (react_1.default.createElement(exports.TText, __assign({ as: as, lang: ctx.defaultLang }, ctx.resolveMagicProps(props)), children));
});
exports.T.displayName = "T";
var boundMap = new Map();
var tBind = function (as) {
    var bind = function (as) {
        var bound = (0, react_1.forwardRef)(function (_a, ref) {
            var children = _a.children, props = __rest(_a, ["children"]);
            return (react_1.default.createElement(exports.T, __assign({ as: as, ref: ref }, props), children));
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
var tBindMulti = function (as) { return as.map(exports.tBind); };
exports.tBindMulti = tBindMulti;
