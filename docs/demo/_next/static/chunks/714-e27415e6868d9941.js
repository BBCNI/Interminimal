(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[714],{4559:function(t,n,r){"use strict";r.d(n,{T:function(){return q},mb:function(){return A},vN:function(){return D},fh:function(){return N},Me:function(){return y},Hk:function(){return U},A3:function(){return P},Y:function(){return V},hY:function(){return J},$G:function(){return _}});var e=r(7294),a=function(t){return"string"===typeof t?t.replace(/([%\[\]])/g,"%$1"):"%".concat(t.index)+("text"in t?"[".concat(t.text,"]"):"")},i={},o=function(t){return/%/.test(t)?i[t]=i[t]||function(t){var n=t.split(/(%\d+|%%|%\[|%\]|\[|\]|%)/).filter((function(t){return t.length})),r=function(t){for(var e=[],i=function(t){e.length&&"string"===typeof e[e.length-1]?e[e.length-1]+=t:e.push(t)};;){var o=n.shift();if(t&&o===t)break;if(!o)break;var c=o.match(/^%(\d+|.)$/);if(c){var u=c[1];if(!/^\d+$/.test(u)){i(u);continue}var l={index:Number(u)};n.length&&"["===n[0]&&(n.shift(),l.name=o,l.text=r("]").map(a).join("")),e.push(l)}else i(o)}return e};return r()}(t):[t]},c=r(4596),u=r.n(c),l=(r(1966),r(7097),function(t,n,r){if(r||2===arguments.length)for(var e,a=0,i=n.length;a<i;a++)!e&&a in n||(e||(e=Array.prototype.slice.call(n,0,a)),e[a]=n[a]);return t.concat(e||Array.prototype.slice.call(n))}),f=new WeakMap,s=new WeakMap,g=function(t,n,r){var e=f.get(t);if(!e)throw new Error("No parent!");return n===t[0]?d(e,l([n],r,!0)):g(e,n,r.concat(t[0]))},h=function(t,n){return f.set(t,n),Object.freeze(t)},p=function(t,n){if(!n.length)return t;var r=l([],n,!0),e=r.pop(),a=function(t){var n=s.get(t);return n||s.set(t,n={}),n}(t),i=a[e]&&a[e].deref();if(i)return p(i,r);var o=t.includes(e)?g(t,e,[]):h([e].concat(t),t);return a[e]=new WeakRef(o),p(o,r)},d=function(t,n){return p(y(t),n)},v=h([]),y=function(t){return f.has(t)?t:p(v,t)},m=function(t,n,r){if(r||2===arguments.length)for(var e,a=0,i=n.length;a<i;a++)!e&&a in n||(e||(e=Array.prototype.slice.call(n,0,a)),e[a]=n[a]);return t.concat(e||Array.prototype.slice.call(n))},b=function(t){if(t.length>35)throw new Error("BCP 47 language tag too long");var n=t.lastIndexOf("-");return n<0?[t]:n>2&&"-"===t.charAt(n-2)?b(t.slice(0,n-2)).concat(t):b(t.slice(0,n)).concat(t)},w=function(t){if(0===t.length)throw new Error("Empty thing");var n=t[0],r=t.slice(1);return r.length?{lang:n,children:[w(r)]}:{lang:n,children:[]}},j=function(t){if(t.length<2)return t;var n,r,e=t[0],a=t[1],i=t.slice(2);return e.lang===a.lang&&e.children.length?j(m([(n=e,r=a,{lang:n.lang,children:j(m(m([],n.children,!0),r.children,!0))})],i,!0)):m([e],j(m([a],i,!0)),!0)},O=function(t){return m(m([],x(t.children),!0),[t.lang],!1)},x=function(t){return t.flatMap(O)},E=new WeakMap,k=function(t){var n=E.get(t);if(n)return n;var r=function(t){return y(x(j(t.map(b).map(w))))}(t);return E.set(t,r),r},P=function(t){return k(y(t))},T=function(t){return t.toLowerCase()},$=new Map,L=function(t){try{return new Intl.Locale(t).toString()}catch(n){}},N=function(t){if($.has(t))return $.get(t);var n=L(t);return $.set(t,n),n};var S=function(){return S=Object.assign||function(t){for(var n,r=1,e=arguments.length;r<e;r++)for(var a in n=arguments[r])Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a]);return t},S.apply(this,arguments)},A=function(){var t=function(t,n){this.dict=t,this.lang=n};return t.cast=function(n,r){if(e=n,null!=(a=t)&&"undefined"!==typeof Symbol&&a[Symbol.hasInstance]?a[Symbol.hasInstance](e):e instanceof a)return r?n.toLang([r]):n;var e,a,i=new this(n);return r?i.toLang([r]):i},t.literal=function(t,n){var r;return this.cast(((r={})[n]=t,r),n)},Object.defineProperty(t.prototype,"language",{get:function(){var t=this.lang;if(!t)throw new Error("This TString must have a language");return t},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"dictionary",{get:function(){return this.dict},enumerable:!1,configurable:!0}),t.prototype.toString=function(t){var n=this.language,r=this.dict[n];return"string"===typeof r?r:r[new Intl.PluralRules(n).select(null!==t&&void 0!==t?t:1)]||""},t.prototype.toLang=function(n){var r,e=this.lang,a=this.dict,i=n[0];if(i===e)return this;if(i in a)return new t(a,i);var o=Object.keys(a);if(o.length>1){var c=function(t,n){var r=new Set(t.map(T));return P(y(n)).find((function(t){return r.has(T(t))}))}(o,n);if(c)return c===e?this:new t(a,c)}if("*"in a)return new t(S(S({},a),((r={})[i]=a["*"],r)),i);if(e)return this;if(o.length)return new t(a,o[0]);throw new Error("No translations available")},t}(),C=function(){return C=Object.assign||function(t){for(var n,r=1,e=arguments.length;r<e;r++)for(var a in n=arguments[r])Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a]);return t},C.apply(this,arguments)},I=function(t,n){var r={};for(var e in t)Object.prototype.hasOwnProperty.call(t,e)&&n.indexOf(e)<0&&(r[e]=t[e]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(e=Object.getOwnPropertySymbols(t);a<e.length;a++)n.indexOf(e[a])<0&&Object.prototype.propertyIsEnumerable.call(t,e[a])&&(r[e[a]]=t[e[a]])}return r},M=function(){var t=function(t){void 0===t&&(t={}),this.defaultLang="en",this.stack=v,this.tagCache={};var n=t.lang,r=t.dictionary,e=I(t,["lang","dictionary"]);r&&function(t){if(!("$$dict"in t))throw new Error("Invalid dictionary (missing $$dict key)")}(r);var a=u()(n).filter(Boolean);Object.assign(this,C(C({},e),{dictionary:r}));var i=this.parent?this.parent.stack:d(v,[this.defaultLang]);this.stack=d(i,a)};return Object.defineProperty(t.prototype,"languages",{get:function(){return this.stack},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"search",{get:function(){return P(this.stack)},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"language",{get:function(){return this.stack[0]},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"ambience",{get:function(){return this.ambient||this.language},enumerable:!1,configurable:!0}),t.prototype.derive=function(n){var r=this,e=this,a=(e.dictionary,e.tagCache,e.stack,I(e,["dictionary","tagCache","stack"]));return new t(C(C(C({},a),function(t){var e=t.dictionaryFromTag,a=I(t,["dictionaryFromTag"]);if(!e)return a;if(n.dictionary)throw new Error("dictionary and dictionaryFromTag both found");return C({dictionary:r.resolveDictionary(e)},a)}(function(t){var n=t.defaultLang,r=I(t,["defaultLang"]);if(!n)return r;var e=r.lang,a=I(r,["lang"]);return C({defaultLang:n,lang:u()(e||[]).concat(n)},a)}(n))),{parent:this}))},t.prototype.translate=function(t){return this.resolve(t).toLang(this.stack)},t.prototype.translateTextAndProps=function(t,n,r){void 0===n&&(n={});n.lang;var e=I(n,["lang"]),a=this.translate(t),i=this.render(a,r);return a.language!==this.ambience?{str:i,props:C(C({},e),{lang:a.language})}:{str:i,props:e}},t.prototype.castString=function(t){return"string"===typeof t?A.literal(t,this.defaultLang):A.cast(t)},t.prototype.resolve=function(t){if(Array.isArray(t)){if(1!==t.length)throw new Error("A tag must be an array of length 1");return this.resolveTag(t[0])}return this.castString(t)},t.prototype.lookupTag=function(t){var n=this,r=this.tagCache;return r[t]=r[t]||function(){var r=n,e=r.parent,a=r.dictionary;if(a){var i=a.$$dict;if(i&&t in i)return i[t]}if(e)return e.lookupTag(t)}()},t.prototype.hasTag=function(t){return!!this.lookupTag(t)},t.prototype.findTag=function(t){var n=this.lookupTag(t);if(n)return n;throw new Error("No translation for ".concat(t))},t.prototype.resolveTag=function(t){var n=this.findTag(t);if("$$dict"in n)throw new Error("".concat(t," is a dictionary"));return this.castString(n)},t.prototype.resolveDictionary=function(t){var n=this.findTag(t);if("$$dict"in n)return n;throw new Error("".concat(t," is not a dictionary"))},t.prototype.resolveLocales=function(t){return d(this.stack,t)},t.prototype.resolveMagicProps=function(t,n){var r=this,e=n?this.resolveLocales([n]):this.stack,a=Object.entries(t).map((function(t){var n=t[0],a=t[1],i=function(t){var n=t.match(/^t-(.+)$/);if(n)return n[1]}(n);return i?[i,r.render(r.resolve(a).toLang(e))]:[n,a]}));return Object.fromEntries(a)},t.prototype.render=function(t,n){var r=this,e=this.resolveLocales([t.language]);return t.toString(n).split(/(%%|%\{[^%]+?\})/).map((function(t){return(a=t.match(/^%\{(.+)\}$/))?r.resolveTag(a[1]).toLang(e).toString(n):t;var a})).join("")},t}(),R=function(){return R=Object.assign||function(t){for(var n,r=1,e=arguments.length;r<e;r++)for(var a in n=arguments[r])Object.prototype.hasOwnProperty.call(n,a)&&(t[a]=n[a]);return t},R.apply(this,arguments)},F=function(t,n){var r={};for(var e in t)Object.prototype.hasOwnProperty.call(t,e)&&n.indexOf(e)<0&&(r[e]=t[e]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(e=Object.getOwnPropertySymbols(t);a<e.length;a++)n.indexOf(e[a])<0&&Object.prototype.propertyIsEnumerable.call(t,e[a])&&(r[e[a]]=t[e[a]])}return r},W=(0,e.createContext)(new M),_=function(){return(0,e.useContext)(W)},B=function(t){var n=t.children,r=F(t,["children"]),a=_().derive(r);return e.createElement(W.Provider,{value:a},n)},D=function(t){var n=t.children,r=t.as,a=void 0===r?"div":r,i=F(t,["children","as"]),o=_().derive(i);return e.createElement(H,{as:a,lang:o.language},e.createElement(W.Provider,{value:o},n))},G=(0,e.forwardRef)((function(t,n){var r=t.as,a=t.children,i=F(t,["as","children"]);return(0,e.createElement)(r,R({ref:n},i),a)}));G.displayName="As";var H=(0,e.forwardRef)((function(t,n){var r=t.children,a=t.lang,i=t.as,o=F(t,["children","lang","as"]);return a!==_().ambience?e.createElement(B,{ambient:a},e.createElement(G,R({as:i,ref:n},o,{lang:a}),r)):e.createElement(G,R({as:i,ref:n},o),r)}));H.displayName="TText";var Y=(0,e.forwardRef)((function(t,n){var r=t.format,a=t.lang,i=t.children,c=o(r);if(1===c.length&&"string"===typeof c[0])return e.createElement(e.Fragment,null,c[0]);var u=e.Children.toArray(i);var l=new Set(u.map((function(t,n){return n+1}))),f={$$dict:{}},s=c.map((function(t){if("string"===typeof t)return t;var r=t.index,i=t.name,o=t.text;if(i&&o&&(f.$$dict[i]=A.literal(o,a).dictionary),r<1||r>u.length)throw new Error("Arg out of range %".concat(r," (1..").concat(u.length," are valid)"));if(!l.has(r))throw new Error("Already using arg %".concat(r));return l.delete(r),n&&1===r?function(t,n){if((0,e.isValidElement)(t))return(0,e.cloneElement)(t,n)}(u[r-1],{ref:n}):u[r-1]}));return Object.keys(f.$$dict).length?e.createElement(B,{dictionary:f},s):e.createElement(e.Fragment,null,s)}));Y.displayName="TFormat";var q=(0,e.forwardRef)((function(t,n){var r=t.children,a=t.tag,i=t.text,o=t.content,c=t.count,u=t.as,l=void 0===u?"span":u,f=F(t,["children","tag","text","content","count","as"]),s=_();if(o){0;var g=s.translate(o);return e.createElement(H,R({as:l,lang:g.language},s.resolveMagicProps(f,g.language)),g.toString(c))}if(a||i){g=function(t,n,r){return function(){if(r)return t.resolve(r);if(n)return t.resolve([n]);throw new Error("No text or tag")}().toLang(t.languages)}(s,a,i);return e.createElement(H,R({as:l,lang:g.language},s.resolveMagicProps(f,g.language)),e.createElement(Y,{ref:n,lang:g.language,format:s.render(g,c)},r))}return e.createElement(H,R({as:l,lang:s.defaultLang},s.resolveMagicProps(f)),r)}));q.displayName="T";var z=new Map,V=function(t){var n=z.get(t);return n||z.set(t,n=function(t){var n=(0,e.forwardRef)((function(n,r){var a=n.children,i=F(n,["children"]);return e.createElement(q,R({as:t,ref:r},i),a)})),r="string"===typeof t?t:t.displayName;return r&&(n.displayName="T".concat(r),Object.defineProperty(n,"name",{value:n.displayName})),n}(t)),n},J=function(t){return t.map(V)},K=function(t){var n=t.match(/(\S*?)\s*;\s*(.*)/);if(n){var r=n[1],e=n[2].match(/^q=(\d+(?:\.\d+)?)$/i);if(e){var a=Number(e[1]);if(a>=0&&a<=1)return[a,r]}return[-1,""]}return[1,t]},Q=function(t){var n=L(t);return n?[n]:[]},U=function(t){return y(t.split(/\s*,\s*/).map(K).filter((function(t){return t[0]>=0})).sort((function(t,n){return function(t,n){return t<n?-1:t>n?1:0}(n[0],t[0])})).map((function(t){return t[1]})).flatMap(Q))}},7097:function(t,n,r){"use strict";var e;"object"===typeof(e=function(){switch(!0){case"object"===typeof globalThis&&!!globalThis:return globalThis;case"object"===typeof self&&!!self:return self;case!!window:return window;case"object"===typeof r.g&&!!r.g:return r.g;case"function"===typeof Function:return Function("return this")()}return null}())&&e&&"undefined"===typeof e.WeakRef&&(e.WeakRef=function(t){var n=function(n){t.set(this,n)};return n.prototype.deref=function(){return t.get(this)},n}(new WeakMap))},7093:function(t,n,r){"use strict";r.d(n,{y:function(){return u}});var e=r(5893),a=r(1664),i=r.n(a),o=r(6825),c=r.n(o),u=function(){return(0,e.jsxs)("ul",{className:c().links,children:[(0,e.jsx)("li",{children:(0,e.jsx)(i(),{href:"/",children:(0,e.jsx)("a",{children:"Demo"})})}),(0,e.jsx)("li",{children:(0,e.jsx)(i(),{href:"/calculator",children:(0,e.jsx)("a",{children:"Calculator"})})}),(0,e.jsx)("li",{children:(0,e.jsx)(i(),{href:"https://github.com/BBCNI/Interminimal/blob/main/demo",children:(0,e.jsx)("a",{children:"Demo App Source"})})}),(0,e.jsx)("li",{children:(0,e.jsx)(i(),{href:"https://bbcni.github.io/Interminimal/",children:(0,e.jsx)("a",{children:"API Documentation"})})}),(0,e.jsx)("li",{children:(0,e.jsx)(i(),{href:"https://github.com/BBCNI/Interminimal",children:(0,e.jsx)("a",{children:"GitHub"})})}),(0,e.jsx)("li",{children:(0,e.jsx)(i(),{href:"https://www.npmjs.com/package/interminimal",children:(0,e.jsx)("a",{children:"NPM"})})})]})}},6825:function(t){t.exports={links:"Links_links__o6GWE"}}}]);