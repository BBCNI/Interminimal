(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{8312:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(4186)}])},9749:function(e,t,n){"use strict";function r(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,i,a=[],o=!0,l=!1;try{for(n=n.call(e);!(o=(r=n.next()).done)&&(a.push(r.value),!t||a.length!==t);o=!0);}catch(c){l=!0,i=c}finally{try{o||null==n.return||n.return()}finally{if(l)throw i}}return a}}(e,t)||l(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(e){return function(e){if(Array.isArray(e))return r(e)}(e)||function(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||l(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(e,t){if(e){if("string"===typeof e)return r(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?r(e,t):void 0}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){var t=e.src,n=e.sizes,r=e.unoptimized,l=void 0!==r&&r,c=e.priority,s=void 0!==c&&c,m=e.loading,p=e.lazyRoot,w=void 0===p?null:p,_=e.lazyBoundary,I=void 0===_?"200px":_,k=e.className,N=e.quality,P=e.width,C=e.height,L=e.style,T=e.objectFit,R=e.objectPosition,D=e.onLoadingComplete,q=e.placeholder,B=void 0===q?"empty":q,G=e.blurDataURL,H=b(e,["src","sizes","unoptimized","priority","loading","lazyRoot","lazyBoundary","className","quality","width","height","style","objectFit","objectPosition","onLoadingComplete","placeholder","blurDataURL"]),M=u.useContext(g.ImageConfigContext),W=u.useMemo((function(){var e=v||M||f.imageConfigDefault,t=o(e.deviceSizes).concat(o(e.imageSizes)).sort((function(e,t){return e-t})),n=e.deviceSizes.sort((function(e,t){return e-t}));return y({},e,{allSizes:t,deviceSizes:n})}),[M]),F=H,U=n?"responsive":"intrinsic";"layout"in F&&(F.layout&&(U=F.layout),delete F.layout);var $=z;if("loader"in F){if(F.loader){var V=F.loader;$=function(e){e.config;var t=b(e,["config"]);return V(t)}}delete F.loader}var Y="";if(function(e){return"object"===typeof e&&(S(e)||function(e){return void 0!==e.src}(e))}(t)){var K=S(t)?t.default:t;if(!K.src)throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ".concat(JSON.stringify(K)));if(G=G||K.blurDataURL,Y=K.src,(!U||"fill"!==U)&&(C=C||K.height,P=P||K.width,!K.height||!K.width))throw new Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ".concat(JSON.stringify(K)))}t="string"===typeof t?t:Y;var Q=A(P),J=A(C),X=A(N),Z=!s&&("lazy"===m||"undefined"===typeof m);(t.startsWith("data:")||t.startsWith("blob:"))&&(l=!0,Z=!1);x.has(t)&&(Z=!1);var ee,te=a(u.useState(!1),2),ne=te[0],re=te[1],ie=a(h.useIntersection({rootRef:w,rootMargin:I,disabled:!Z}),3),ae=ie[0],oe=ie[1],le=ie[2],ce=!Z||oe,se={boxSizing:"border-box",display:"block",overflow:"hidden",width:"initial",height:"initial",background:"none",opacity:1,border:0,margin:0,padding:0},ue={boxSizing:"border-box",display:"block",width:"initial",height:"initial",background:"none",opacity:1,border:0,margin:0,padding:0},de=!1,fe={position:"absolute",top:0,left:0,bottom:0,right:0,boxSizing:"border-box",padding:0,border:"none",margin:"auto",display:"block",width:0,height:0,minWidth:"100%",maxWidth:"100%",minHeight:"100%",maxHeight:"100%",objectFit:T,objectPosition:R};0;0;var he=Object.assign({},L,"raw"===U?{}:fe),ge="blur"!==B||ne?{}:{filter:"blur(20px)",backgroundSize:T||"cover",backgroundImage:'url("'.concat(G,'")'),backgroundPosition:R||"0% 0%"};if("fill"===U)se.display="block",se.position="absolute",se.top=0,se.left=0,se.bottom=0,se.right=0;else if("undefined"!==typeof Q&&"undefined"!==typeof J){var me=J/Q,pe=isNaN(me)?"100%":"".concat(100*me,"%");"responsive"===U?(se.display="block",se.position="relative",de=!0,ue.paddingTop=pe):"intrinsic"===U?(se.display="inline-block",se.position="relative",se.maxWidth="100%",de=!0,ue.maxWidth="100%",ee="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%27".concat(Q,"%27%20height=%27").concat(J,"%27/%3e")):"fixed"===U&&(se.display="inline-block",se.position="relative",se.width=Q,se.height=J)}else 0;var ye={src:j,srcSet:void 0,sizes:void 0};ce&&(ye=O({config:W,src:t,unoptimized:l,layout:U,width:Q,quality:X,sizes:n,loader:$}));var be=t;0;var ve,xe="imagesrcset",je="imagesizes";xe="imageSrcSet",je="imageSizes";var we=(i(ve={},xe,ye.srcSet),i(ve,je,ye.sizes),ve),Se=u.default.useLayoutEffect,Oe=u.useRef(D),Ae=u.useRef(t);u.useEffect((function(){Oe.current=D}),[D]),Se((function(){Ae.current!==t&&(le(),Ae.current=t)}),[le,t]);var ze=y({isLazy:Z,imgAttributes:ye,heightInt:J,widthInt:Q,qualityInt:X,layout:U,className:k,imgStyle:he,blurStyle:ge,loading:m,config:W,unoptimized:l,placeholder:B,loader:$,srcString:be,onLoadingCompleteRef:Oe,setBlurComplete:re,setIntersection:ae,isVisible:ce},F);return u.default.createElement(u.default.Fragment,null,"raw"===U?u.default.createElement(E,Object.assign({},ze)):u.default.createElement("span",{style:se},de?u.default.createElement("span",{style:ue},ee?u.default.createElement("img",{style:{display:"block",maxWidth:"100%",width:"initial",height:"initial",background:"none",opacity:1,border:0,margin:0,padding:0},alt:"","aria-hidden":!0,src:ee}):null):null,u.default.createElement(E,Object.assign({},ze))),s?u.default.createElement(d.default,null,u.default.createElement("link",Object.assign({key:"__nimg-"+ye.src+ye.srcSet+ye.sizes,rel:"preload",as:"image",href:ye.srcSet?void 0:ye.src},we))):null)};var c,s,u=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)if(Object.prototype.hasOwnProperty.call(e,n)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,n):{};r.get||r.set?Object.defineProperty(t,n,r):t[n]=e[n]}return t.default=e,t}(n(7294)),d=(c=n(3121))&&c.__esModule?c:{default:c},f=n(139),h=n(9246),g=n(8730),m=(n(670),n(2700));function p(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function y(e){for(var t=arguments,n=function(n){var r=null!=t[n]?t[n]:{},i=Object.keys(r);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(r).filter((function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable})))),i.forEach((function(t){p(e,t,r[t])}))},r=1;r<arguments.length;r++)n(r);return e}function b(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}s={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image/",loader:"custom",experimentalLayoutRaw:!1};var v={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image/",loader:"custom",experimentalLayoutRaw:!1},x=new Set,j=(new Map,"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");var w=new Map([["default",function(e){var t=e.config,n=e.src,r=e.width,i=e.quality;0;if(n.endsWith(".svg")&&!t.dangerouslyAllowSVG)return n;return"".concat(m.normalizePathTrailingSlash(t.path),"?url=").concat(encodeURIComponent(n),"&w=").concat(r,"&q=").concat(i||75)}],["imgix",function(e){var t=e.config,n=e.src,r=e.width,i=e.quality,a=new URL("".concat(t.path).concat(I(n))),o=a.searchParams;o.set("auto",o.get("auto")||"format"),o.set("fit",o.get("fit")||"max"),o.set("w",o.get("w")||r.toString()),i&&o.set("q",i.toString());return a.href}],["cloudinary",function(e){var t=e.config,n=e.src,r=e.width,i=e.quality,a=["f_auto","c_limit","w_"+r,"q_"+(i||"auto")].join(",")+"/";return"".concat(t.path).concat(a).concat(I(n))}],["akamai",function(e){var t=e.config,n=e.src,r=e.width;return"".concat(t.path).concat(I(n),"?imwidth=").concat(r)}],["custom",function(e){var t=e.src;throw new Error('Image with src "'.concat(t,'" is missing "loader" prop.')+"\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader")}]]);function S(e){return void 0!==e.default}function O(e){var t=e.config,n=e.src,r=e.unoptimized,i=e.layout,a=e.width,l=e.quality,c=e.sizes,s=e.loader;if(r)return{src:n,srcSet:void 0,sizes:void 0};var u=function(e,t,n,r){var i=e.deviceSizes,a=e.allSizes;if(r&&("fill"===n||"responsive"===n||"raw"===n)){for(var l,c=/(^|\s)(1?\d?\d)vw/g,s=[];l=c.exec(r);l)s.push(parseInt(l[2]));if(s.length){var u,d=.01*(u=Math).min.apply(u,o(s));return{widths:a.filter((function(e){return e>=i[0]*d})),kind:"w"}}return{widths:a,kind:"w"}}return"number"!==typeof t||"fill"===n||"responsive"===n?{widths:i,kind:"w"}:{widths:o(new Set([t,2*t].map((function(e){return a.find((function(t){return t>=e}))||a[a.length-1]})))),kind:"x"}}(t,a,i,c),d=u.widths,f=u.kind,h=d.length-1;return{sizes:c||"w"!==f?c:"100vw",srcSet:d.map((function(e,r){return"".concat(s({config:t,src:n,quality:l,width:e})," ").concat("w"===f?e:r+1).concat(f)})).join(", "),src:s({config:t,src:n,quality:l,width:d[h]})}}function A(e){return"number"===typeof e?e:"string"===typeof e?parseInt(e,10):void 0}function z(e){var t,n=(null===(t=e.config)||void 0===t?void 0:t.loader)||"default",r=w.get(n);if(r)return r(e);throw new Error('Unknown "loader" found in "next.config.js". Expected: '.concat(f.VALID_LOADERS.join(", "),". Received: ").concat(n))}function _(e,t,n,r,i,a){e&&e.src!==j&&e["data-loaded-src"]!==t&&(e["data-loaded-src"]=t,("decode"in e?e.decode():Promise.resolve()).catch((function(){})).then((function(){if(e.parentNode&&(x.add(t),"blur"===r&&a(!0),null===i||void 0===i?void 0:i.current)){var n=e.naturalWidth,o=e.naturalHeight;i.current({naturalWidth:n,naturalHeight:o})}})))}var E=function(e){var t=e.imgAttributes,n=e.heightInt,r=e.widthInt,i=e.qualityInt,a=e.layout,o=e.className,l=e.imgStyle,c=e.blurStyle,s=e.isLazy,d=e.placeholder,f=e.loading,h=e.srcString,g=e.config,m=e.unoptimized,p=e.loader,v=e.onLoadingCompleteRef,x=e.setBlurComplete,j=e.setIntersection,w=e.onLoad,S=e.onError,A=(e.isVisible,b(e,["imgAttributes","heightInt","widthInt","qualityInt","layout","className","imgStyle","blurStyle","isLazy","placeholder","loading","srcString","config","unoptimized","loader","onLoadingCompleteRef","setBlurComplete","setIntersection","onLoad","onError","isVisible"]));return u.default.createElement(u.default.Fragment,null,u.default.createElement("img",Object.assign({},A,t,"raw"===a?{height:n,width:r}:{},{decoding:"async","data-nimg":a,className:o,style:y({},l,c),ref:u.useCallback((function(e){j(e),(null===e||void 0===e?void 0:e.complete)&&_(e,h,0,d,v,x)}),[j,h,a,d,v,x]),onLoad:function(e){_(e.currentTarget,h,0,d,v,x),w&&w(e)},onError:function(e){"blur"===d&&x(!0),S&&S(e)}})),(s||"blur"===d)&&u.default.createElement("noscript",null,u.default.createElement("img",Object.assign({},A,O({config:g,src:h,unoptimized:m,layout:a,width:r,quality:i,sizes:t.sizes,loader:p}),"raw"===a?{height:n,width:r}:{},{decoding:"async","data-nimg":a,style:l,className:o,loading:f||"lazy"}))))};function I(e){return"/"===e[0]?e.slice(1):e}("function"===typeof t.default||"object"===typeof t.default&&null!==t.default)&&(Object.assign(t.default,t),e.exports=t.default)},4186:function(e,t,n){"use strict";n.r(t),n.d(t,{__N_SSG:function(){return L}});var r=n(5893),i=n(9008),a=n.n(i),o=n(5675),l=n.n(o),c=n(1664),s=n.n(c),u=n(7294),d=n(4559),f=n(7093),h=n(7160),g=n.n(h);function m(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function p(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function y(){return y=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},y.apply(this,arguments)}function b(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){p(e,t,n[t])}))}return e}function v(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function x(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,i,a=[],o=!0,l=!1;try{for(n=n.call(e);!(o=(r=n.next()).done)&&(a.push(r.value),!t||a.length!==t);o=!0);}catch(c){l=!0,i=c}finally{try{o||null==n.return||n.return()}finally{if(l)throw i}}return a}}(e,t)||function(e,t){if(!e)return;if("string"===typeof e)return m(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return m(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var j={$$dict:{site:{"*":"Interminimal",fr:"Chose internationale"},one:{en:"One",fr:"Un",de:"Ein",cy:"Un"},two:{en:"Two",fr:"Deux",de:"Zwei",cy:"Dau"},three:{en:"Three"},en:{en:"English",fr:"Anglais"},"en-GB":{"en-GB":"British"},fr:{fr:"Fran\xe7ais"},de:{en:"German",fr:"Allemand",de:"Deutsch"},cy:{en:"Welsh",cy:"Cymraeg"},cat:{en:"cat",de:"Katze",cy:"cath"},colour:{"en-GB":"colour",en:"color"},cats:{en:{one:"%1 cat",other:"%1 cats"},de:{one:"%1 Katze",other:"%1 Katzen"},cy:{zero:"%1 cathod",one:"%1 gath",two:"%1 gath",few:"%1 cath",many:"%1 chath",other:"%1 cath"}},silly:{en:"Top level %1[Level one %1[Level two] and %2[also level two with %1[level three]]]",fr:"Niveau sup\xe9rieur %1[Niveau un %1[Niveau deux] et %2[aussi niveau deux avec %1[niveau trois]]]",de:"Oberste Ebene %1[Ebene eins %1[Ebene zwei] und %2[auch Ebene zwei mit %1[Ebene drei]]]",cy:"Lefel uchaf %1[Lefel un %1[Lefel dau] a %2[hefyd lefel dau gyda %1[lefel tri]]]"},madness:{$$dict:{site:{en:"Or maybe something else",fr:"Ou peut-\xeatre autre chose"}}},"h.siteName":{en:"It's Called",fr:"C'est Appel\xe9"},"h.someCats":{en:"Some Cats",fr:"Quelques Chats",cy:"Rhai Cathod"}}},w=function(e){var t=e.date,n=v(e,["date"]),i=(0,d.$G)(),a=new Intl.DateTimeFormat(i.languages,n),o=a.resolvedOptions().locale,l=d.mb.literal(a.format(t),o);return(0,r.jsx)(d.T,{text:l})},S=function(e){var t=e.children,n=v(e,["children"]),i=(0,d.$G)(),a=new Intl.ListFormat(i.languages,n),o=a.resolvedOptions().locale,l=Array.from({length:u.Children.count(t)},(function(e,t){return"%".concat(t+1)})),c=d.mb.literal(a.format(l),o);return(0,r.jsx)(d.T,{text:c,children:t})},O=function(e){var t=y({},e),n=(0,u.useState)(null),i=n[0],a=n[1];return(0,u.useEffect)((function(){var e=function(){return a(new Date)},t=setInterval(e,500);return e(),function(){return clearInterval(t)}}),[]),i?(0,r.jsx)(w,b({date:i},t)):null},A=function(e){var t=e.children;return(0,r.jsxs)(r.Fragment,{children:["[",t,"]"]})},z=function(e){var t=e.text,n=v(e,["text"]),i=(0,d.$G)().translateTextAndProps(t,n),o=i.str,l=i.props;return(0,r.jsx)(a(),{children:(0,r.jsx)("title",b({},l,{children:o}))})},_=function(e,t){var n=(0,u.useState)(e);return{lang:n[0],setLang:n[1],label:t}},E=function(e,t,n){return[_(e,"one"),_(t,"two"),_(n,"three")]},I=["en-GB","en","fr","de","cy"],k=function(e){var t=e.label,n=e.state,i=x((0,d.hY)(["option"]),1)[0];return(0,r.jsxs)("label",{children:[(0,r.jsx)(d.T,{text:t}),": ",(0,r.jsx)("select",{value:n.lang,onChange:function(e){e.preventDefault(),n.setLang(e.target.value)},children:I.map((function(e){return(0,r.jsx)(i,{value:e,tag:e},e)}))})]})},N=function(){var e=(0,d.$G)();return(0,r.jsx)("p",{children:(0,r.jsx)(S,{children:e.languages.map((function(t){return e.hasTag(t)?(0,r.jsx)(d.T,{tag:t},t):(0,r.jsx)(d.T,{text:t},t)}))})})},P=function(e){var t=e.src,n=e.width;return"".concat(t,"/").concat(n,"/").concat(Math.round(9*n/16))},C=function(e){var t=e.greeting,n=e.message,i=e.info,a=e.nested,o=e.state,c=x((0,d.hY)(["li","div","h2","p"]),4),f=c[0],h=c[1],m=c[2],p=c[3],y=(0,d.Y)(l()),b=(0,d.Y)(A);return(0,r.jsx)("div",{children:(0,r.jsxs)(d.vN,{lang:o.map((function(e){return e.lang})),children:[o.map((function(e){return(0,r.jsxs)(u.Fragment,{children:[(0,r.jsx)(k,{label:[e.label],state:e})," "]},e.label)})),(0,r.jsx)(m,{text:"Languages"}),(0,r.jsx)(N,{}),(0,r.jsx)(m,{text:"Time"}),(0,r.jsx)("div",{className:g().clock,children:(0,r.jsx)(O,{dateStyle:"full",timeStyle:"full"})}),(0,r.jsx)(m,{text:"Phrases"}),(0,r.jsxs)("ul",{children:[(0,r.jsx)(f,{text:"Always English"}),(0,r.jsx)(f,{text:t}),(0,r.jsx)(f,{text:n}),(0,r.jsx)(f,{text:{en:"Where is the spinach? (%{site})",fr:"O\xf9 sont les \xe9pinards? (%{site})"}})]}),(0,r.jsx)(m,{text:"Info"}),(0,r.jsxs)(p,{text:i,children:[(0,r.jsx)(d.T,{tag:"one"}),(0,r.jsx)(d.T,{tag:"two"})]}),(0,r.jsx)(p,{tag:"colour"}),(0,r.jsxs)(p,{text:a,children:[(0,r.jsx)(s(),{href:"https://github.com/BBCNI/Interminimal",passHref:!0,children:(0,r.jsx)(d.T,{as:"a",tag:"%1"})}),(0,r.jsx)(d.T,{as:"i",tag:"%2"})]}),(0,r.jsx)(p,{tag:"silly",children:(0,r.jsxs)(b,{tag:"%1",children:[(0,r.jsx)(b,{tag:"%1"}),(0,r.jsx)(b,{tag:"%2",children:(0,r.jsx)(b,{tag:"%1"})})]})}),(0,r.jsx)(m,{tag:"h.someCats"}),(0,r.jsx)("figure",{className:g().cat,children:(0,r.jsx)(y,{"t-alt":["cat"],width:"512",height:"288",loader:P,src:"http://placekitten.com/g"})}),[0,1,1.5,2,3,6,42].map((function(e,t){return(0,r.jsx)(h,{tag:"cats",count:e,children:String(e)},t)})),(0,r.jsx)(m,{tag:"h.siteName"}),(0,r.jsx)(d.T,{tag:"site"}),(0,r.jsx)(d.vN,{dictionaryFromTag:"madness",children:(0,r.jsx)(d.T,{tag:"site"})})]})})},L=!0;t.default=function(e){var t=E("de","en","fr"),n=E("en","de","fr"),i=E("fr","de","en-GB");return(0,r.jsx)(d.vN,{dictionary:j,children:(0,r.jsxs)("div",{className:g().container,children:[(0,r.jsxs)(a(),{children:[(0,r.jsx)("meta",{name:"description",content:"Minimal i18n"}),(0,r.jsx)("link",{rel:"icon",href:"/favicon.ico"})]}),(0,r.jsx)(z,{text:["site"]}),(0,r.jsxs)("main",{className:g().main,children:[(0,r.jsx)("h1",{className:g().title,children:"Interminimal Demo"}),(0,r.jsx)(f.y,{}),(0,r.jsxs)("div",{className:g().blocks,children:[(0,r.jsx)(C,b({},e,{state:t,lang:"de"})),(0,r.jsx)(C,b({},e,{state:n,lang:"en"})),(0,r.jsx)(C,b({},e,{state:i,lang:"fr"}))]})]})]})})}},7160:function(e){e.exports={container:"Home_container__bCOhY",main:"Home_main__nLjiQ",blocks:"Home_blocks__2d4yo",cat:"Home_cat__ojHrA",clock:"Home_clock__yrr_f",code:"Home_code__suPER"}},5675:function(e,t,n){e.exports=n(9749)}},function(e){e.O(0,[106,714,774,888,179],(function(){return t=8312,e(e.s=t);var t}));var t=e.O();_N_E=t}]);