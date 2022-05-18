"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[559],{4559:function(t,n,e){e.d(n,{T:function(){return D},mb:function(){return x},vN:function(){return I},Y:function(){return z},hY:function(){return G},$G:function(){return R}});var r=e(7294),a=function(t){return"string"===typeof t?t.replace(/([%\[\]])/g,"%$1"):"%".concat(t.index)+("text"in t?"[".concat(t.text,"]"):"")},i={},o=function(t){return/%/.test(t)?i[t]=i[t]||function(t){var n=t.split(/(%\d+|%%|%\[|%\]|\[|\]|%)/).filter((function(t){return t.length})),e=function(t){for(var r=[],i=function(t){r.length&&"string"===typeof r[r.length-1]?r[r.length-1]+=t:r.push(t)};;){var o=n.shift();if(t&&o===t)break;if(!o)break;var c=o.match(/^%(\d+|.)$/);if(c){var u=c[1];if(!/^\d+$/.test(u)){i(u);continue}var l={index:Number(u)};n.length&&"["===n[0]&&(n.shift(),l.name=o,l.text=e("]").map(a).join("")),r.push(l)}else i(o)}return r};return e()}(t):[t]},c=e(4596),u=e.n(c),l=(e(1966),e(7097),function(t,n,e){if(e||2===arguments.length)for(var r,a=0,i=n.length;a<i;a++)!r&&a in n||(r||(r=Array.prototype.slice.call(n,0,a)),r[a]=n[a]);return t.concat(r||Array.prototype.slice.call(n))}),f=new WeakMap,s=new WeakMap,g=function(t,n,e){var r=f.get(t);if(!r)throw new Error("No parent!");return n===t[0]?d(r,l([n],e,!0)):g(r,n,e.concat(t[0]))},p=function(t,n){return f.set(t,n),Object.freeze(t)},h=function(t,n){if(!n.length)return t;var e=l([],n,!0),r=e.pop(),a=function(t){var n=s.get(t);return n||s.set(t,n={}),n}(t),i=a[r]&&a[r].deref();if(i)return h(i,e);var o=t.includes(r)?g(t,r,[]):p([r].concat(t),t);return a[r]=new WeakRef(o),h(o,e)},d=function(t,n){return h(y(t),n)},v=p([]),y=function(t){return f.has(t)?t:h(v,t)},m=function(t,n,e){if(e||2===arguments.length)for(var r,a=0,i=n.length;a<i;a++)!r&&a in n||(r||(r=Array.prototype.slice.call(n,0,a)),r[a]=n[a]);return t.concat(r||Array.prototype.slice.call(n))},w=function(t){if(t.length>35)throw new Error("BCP 47 language tag too long");var n=t.lastIndexOf("-");return n<0?[t]:n>2&&"-"===t.charAt(n-2)?w(t.slice(0,n-2)).concat(t):w(t.slice(0,n)).concat(t)},b=function(t){if(0===t.length)throw new Error("Empty thing");var n=t[0],e=t.slice(1);return e.length?{lang:n,children:[b(e)]}:{lang:n,children:[]}},O=function(t){if(t.length<2)return t;var n,e,r=t[0],a=t[1],i=t.slice(2);return r.lang===a.lang&&r.children.length?O(m([(n=r,e=a,{lang:n.lang,children:O(m(m([],n.children,!0),e.children,!0))})],i,!0)):m([r],O(m([a],i,!0)),!0)},E=function(t){return m(m([],j(t.children),!0),[t.lang],!1)},j=function(t){return t.flatMap(E)},k=function(t){return t.toLowerCase()},T=new WeakMap,P=function(t){var n=T.get(t);if(n)return n;var e=function(t){return y(j(O(t.map(w).map(b))))}(t);return T.set(t,e),e};new Map;var $=function(){return $=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var a in n=arguments[e])Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a]);return t},$.apply(this,arguments)},x=function(){var t=function(t,n){this.dict=t,this.lang=n};return t.cast=function(n,e){if(r=n,null!=(a=t)&&"undefined"!==typeof Symbol&&a[Symbol.hasInstance]?a[Symbol.hasInstance](r):r instanceof a)return e?n.toLang([e]):n;var r,a,i=new this(n);return e?i.toLang([e]):i},t.literal=function(t,n){var e;return this.cast(((e={})[n]=t,e),n)},Object.defineProperty(t.prototype,"language",{get:function(){var t=this.lang;if(!t)throw new Error("This TString must have a language");return t},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"dictionary",{get:function(){return this.dict},enumerable:!1,configurable:!0}),t.prototype.toString=function(t){var n=this.language,e=this.dict[n];return"string"===typeof e?e:e[new Intl.PluralRules(n).select(null!==t&&void 0!==t?t:1)]||""},t.prototype.toLang=function(n){var e,r=this.lang,a=this.dict,i=n[0];if(i===r)return this;if(i in a)return new t(a,i);var o=Object.keys(a);if(o.length>1){var c=function(t,n){var e=new Set(t.map(k));return P(y(n)).find((function(t){return e.has(k(t))}))}(o,n);if(c)return c===r?this:new t(a,c)}if("*"in a)return new t($($({},a),((e={})[i]=a["*"],e)),i);if(r)return this;if(o.length)return new t(a,o[0]);throw new Error("No translations available")},t}(),L=function(){return L=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var a in n=arguments[e])Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a]);return t},L.apply(this,arguments)},S=function(t,n){var e={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&n.indexOf(r)<0&&(e[r]=t[r]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(t);a<r.length;a++)n.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(t,r[a])&&(e[r[a]]=t[r[a]])}return e},N=function(){var t=function(t){void 0===t&&(t={}),this.defaultLang="en",this.stack=v,this.tagCache={};var n=t.lang,e=t.dictionary,r=S(t,["lang","dictionary"]);if(e&&!("$$dict"in e))throw new Error("Invalid dictionary (missing $$dict key)");var a=u()(n).filter(Boolean);Object.assign(this,L(L({},r),{dictionary:e}));var i=this.parent?this.parent.stack:d(v,[this.defaultLang]);this.stack=d(i,a)};return Object.defineProperty(t.prototype,"languages",{get:function(){return this.stack},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"language",{get:function(){return this.stack[0]},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"ambience",{get:function(){return this.ambient||this.language},enumerable:!1,configurable:!0}),t.prototype.derive=function(n){var e=this,r=this,a=(r.dictionary,r.tagCache,r.stack,S(r,["dictionary","tagCache","stack"]));return new t(L(L(L({},a),function(t){var r=t.dictionaryFromTag,a=S(t,["dictionaryFromTag"]);if(!r)return a;if(n.dictionary)throw new Error("dictionary and dictionaryFromTag both found");return L({dictionary:e.resolveDictionary(r)},a)}(function(t){var n=t.defaultLang,e=S(t,["defaultLang"]);if(!n)return e;var r=e.lang,a=S(e,["lang"]);return L({defaultLang:n,lang:u()(r||[]).concat(n)},a)}(n))),{parent:this}))},t.prototype.translate=function(t){return this.resolve(t).toLang(this.stack)},t.prototype.translateTextAndProps=function(t,n,e){void 0===n&&(n={});n.lang;var r=S(n,["lang"]),a=this.translate(t),i=this.render(a,e);return a.language!==this.ambience?{str:i,props:L(L({},r),{lang:a.language})}:{str:i,props:r}},t.prototype.castString=function(t){return"string"===typeof t?x.literal(t,this.defaultLang):x.cast(t)},t.prototype.resolve=function(t){if(Array.isArray(t)){if(1!==t.length)throw new Error("A tag must be an array of length 1");return this.resolveTag(t[0])}return this.castString(t)},t.prototype.lookupTag=function(t){var n=this,e=this.tagCache;return e[t]=e[t]||function(){var e=n,r=e.parent,a=e.dictionary;if(a){var i=a.$$dict;if(i&&t in i)return i[t]}if(r)return r.lookupTag(t)}()},t.prototype.hasTag=function(t){return!!this.lookupTag(t)},t.prototype.findTag=function(t){var n=this.lookupTag(t);if(n)return n;throw new Error("No translation for ".concat(t))},t.prototype.resolveTag=function(t){var n=this.findTag(t);if("$$dict"in n)throw new Error("".concat(t," is a dictionary"));return this.castString(n)},t.prototype.resolveDictionary=function(t){var n=this.findTag(t);if("$$dict"in n)return n;throw new Error("".concat(t," is not a dictionary"))},t.prototype.resolveLocales=function(t){return d(this.stack,t)},t.prototype.resolveMagicProps=function(t,n){var e=this,r=n?this.resolveLocales([n]):this.stack,a=Object.entries(t).map((function(t){var n=t[0],a=t[1],i=function(t){var n=t.match(/^t-(.+)$/);if(n)return n[1]}(n);return i?[i,e.render(e.resolve(a).toLang(r))]:[n,a]}));return Object.fromEntries(a)},t.prototype.render=function(t,n){var e=this,r=this.resolveLocales([t.language]);return t.toString(n).split(/(%%|%\{[^%]+?\})/).map((function(t){return(a=t.match(/^%\{(.+)\}$/))?e.resolveTag(a[1]).toLang(r).toString(n):t;var a})).join("")},t}(),A=function(){return A=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var a in n=arguments[e])Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a]);return t},A.apply(this,arguments)},C=function(t,n){var e={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&n.indexOf(r)<0&&(e[r]=t[r]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(r=Object.getOwnPropertySymbols(t);a<r.length;a++)n.indexOf(r[a])<0&&Object.prototype.propertyIsEnumerable.call(t,r[a])&&(e[r[a]]=t[r[a]])}return e},M=(0,r.createContext)(new N),R=function(){return(0,r.useContext)(M)},F=function(t){var n=t.children,e=C(t,["children"]),a=R().derive(e);return r.createElement(M.Provider,{value:a},n)},I=function(t){var n=t.children,e=t.as,a=void 0===e?"div":e,i=C(t,["children","as"]),o=R().derive(i);return r.createElement(_,{as:a,lang:o.language},r.createElement(M.Provider,{value:o},n))},W=(0,r.forwardRef)((function(t,n){var e=t.as,a=t.children,i=C(t,["as","children"]);return(0,r.createElement)(e,A({ref:n},i),a)}));W.displayName="As";var _=(0,r.forwardRef)((function(t,n){var e=t.children,a=t.lang,i=t.as,o=C(t,["children","lang","as"]);return a!==R().ambience?r.createElement(F,{ambient:a},r.createElement(W,A({as:i,ref:n},o,{lang:a}),e)):r.createElement(W,A({as:i,ref:n},o),e)}));_.displayName="TText";var B=(0,r.forwardRef)((function(t,n){var e=t.format,a=t.lang,i=t.children,c=o(e);if(1===c.length&&"string"===typeof c[0])return r.createElement(r.Fragment,null,c[0]);var u=r.Children.toArray(i);var l=new Set(u.map((function(t,n){return n+1}))),f={$$dict:{}},s=c.map((function(t){if("string"===typeof t)return t;var e=t.index,i=t.name,o=t.text;if(i&&o&&(f.$$dict[i]=x.literal(o,a).dictionary),e<1||e>u.length)throw new Error("Arg out of range %".concat(e," (1..").concat(u.length," are valid)"));if(!l.has(e))throw new Error("Already using arg %".concat(e));return l.delete(e),n&&1===e?function(t,n){if((0,r.isValidElement)(t))return(0,r.cloneElement)(t,n)}(u[e-1],{ref:n}):u[e-1]}));return Object.keys(f.$$dict).length?r.createElement(F,{dictionary:f},s):r.createElement(r.Fragment,null,s)}));B.displayName="TFormat";var D=(0,r.forwardRef)((function(t,n){var e=t.children,a=t.tag,i=t.text,o=t.content,c=t.count,u=t.as,l=void 0===u?"span":u,f=C(t,["children","tag","text","content","count","as"]),s=R();if(o){0;var g=s.translate(o);return r.createElement(_,A({as:l,lang:g.language},s.resolveMagicProps(f,g.language)),g.toString(c))}if(a||i){g=function(t,n,e){return function(){if(e)return t.resolve(e);if(n)return t.resolve([n]);throw new Error("No text or tag")}().toLang(t.languages)}(s,a,i);return r.createElement(_,A({as:l,lang:g.language},s.resolveMagicProps(f,g.language)),r.createElement(B,{ref:n,lang:g.language,format:s.render(g,c)},e))}return r.createElement(_,A({as:l,lang:s.defaultLang},s.resolveMagicProps(f)),e)}));D.displayName="T";var Y=new Map,z=function(t){var n=Y.get(t);return n||Y.set(t,n=function(t){var n=(0,r.forwardRef)((function(n,e){var a=n.children,i=C(n,["children"]);return r.createElement(D,A({as:t,ref:e},i),a)})),e="string"===typeof t?t:t.displayName;return e&&(n.displayName="T".concat(e),Object.defineProperty(n,"name",{value:n.displayName})),n}(t)),n},G=function(t){return t.map(z)}},7097:function(t,n,e){var r;"object"===typeof(r=function(){switch(!0){case"object"===typeof globalThis&&!!globalThis:return globalThis;case"object"===typeof self&&!!self:return self;case!!window:return window;case"object"===typeof e.g&&!!e.g:return e.g;case"function"===typeof Function:return Function("return this")()}return null}())&&r&&"undefined"===typeof r.WeakRef&&(r.WeakRef=function(t){var n=function(n){t.set(this,n)};return n.prototype.deref=function(){return t.get(this)},n}(new WeakMap))}}]);