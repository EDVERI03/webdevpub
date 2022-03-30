var app=function(){"use strict";function t(){}const n=t=>t;function e(t){return t()}function r(){return Object.create(null)}function o(t){t.forEach(e)}function l(t){return"function"==typeof t}function s(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}let c;function u(t,n){return c||(c=document.createElement("a")),c.href=n,t===c.href}function a(n,e,r){n.$$.on_destroy.push(function(n,...e){if(null==n)return t;const r=n.subscribe(...e);return r.unsubscribe?()=>r.unsubscribe():r}(e,r))}const i="undefined"!=typeof window;let f=i?()=>window.performance.now():()=>Date.now(),d=i?t=>requestAnimationFrame(t):t;const m=new Set;function p(t){m.forEach((n=>{n.c(t)||(m.delete(n),n.f())})),0!==m.size&&d(p)}function h(t,n){t.appendChild(n)}function g(t){if(!t)return document;const n=t.getRootNode?t.getRootNode():t.ownerDocument;return n&&n.host?n:t.ownerDocument}function $(t){const n=y("style");return function(t,n){h(t.head||t,n)}(g(t),n),n.sheet}function v(t,n,e){t.insertBefore(n,e||null)}function b(t){t.parentNode.removeChild(t)}function x(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}function y(t){return document.createElement(t)}function w(t){return document.createTextNode(t)}function _(){return w(" ")}function k(){return w("")}function j(t,n,e,r){return t.addEventListener(n,e,r),()=>t.removeEventListener(n,e,r)}function E(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function C(t,n){n=""+n,t.wholeText!==n&&(t.data=n)}function P(t,n){t.value=null==n?"":n}function R(t,n,e,r){null===e?t.style.removeProperty(n):t.style.setProperty(n,e,r?"important":"")}const N=new Map;let A,O=0;function T(t,n,e,r,o,l,s,c=0){const u=16.666/r;let a="{\n";for(let t=0;t<=1;t+=u){const r=n+(e-n)*l(t);a+=100*t+`%{${s(r,1-r)}}\n`}const i=a+`100% {${s(e,1-e)}}\n}`,f=`__svelte_${function(t){let n=5381,e=t.length;for(;e--;)n=(n<<5)-n^t.charCodeAt(e);return n>>>0}(i)}_${c}`,d=g(t),{stylesheet:m,rules:p}=N.get(d)||function(t,n){const e={stylesheet:$(n),rules:{}};return N.set(t,e),e}(d,t);p[f]||(p[f]=!0,m.insertRule(`@keyframes ${f} ${i}`,m.cssRules.length));const h=t.style.animation||"";return t.style.animation=`${h?`${h}, `:""}${f} ${r}ms linear ${o}ms 1 both`,O+=1,f}function z(t,n){const e=(t.style.animation||"").split(", "),r=e.filter(n?t=>t.indexOf(n)<0:t=>-1===t.indexOf("__svelte")),o=e.length-r.length;o&&(t.style.animation=r.join(", "),O-=o,O||d((()=>{O||(N.forEach((t=>{const{stylesheet:n}=t;let e=n.cssRules.length;for(;e--;)n.deleteRule(e);t.rules={}})),N.clear())})))}function D(t){A=t}function L(){if(!A)throw new Error("Function called outside component initialization");return A}const S=[],F=[],M=[],H=[],q=Promise.resolve();let W=!1;function B(t){M.push(t)}const I=new Set;let X,Y=0;function G(){const t=A;do{for(;Y<S.length;){const t=S[Y];Y++,D(t),J(t.$$)}for(D(null),S.length=0,Y=0;F.length;)F.pop()();for(let t=0;t<M.length;t+=1){const n=M[t];I.has(n)||(I.add(n),n())}M.length=0}while(S.length);for(;H.length;)H.pop()();W=!1,I.clear(),D(t)}function J(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(B)}}function K(t,n,e){t.dispatchEvent(function(t,n,e=!1){const r=document.createEvent("CustomEvent");return r.initCustomEvent(t,e,!1,n),r}(`${n?"intro":"outro"}${e}`))}const Q=new Set;let U;function V(){U={r:0,c:[],p:U}}function Z(){U.r||o(U.c),U=U.p}function tt(t,n){t&&t.i&&(Q.delete(t),t.i(n))}function nt(t,n,e,r){if(t&&t.o){if(Q.has(t))return;Q.add(t),U.c.push((()=>{Q.delete(t),r&&(e&&t.d(1),r())})),t.o(n)}}const et={duration:0};function rt(e,r,s,c){let u=r(e,s),a=c?0:1,i=null,h=null,g=null;function $(){g&&z(e,g)}function v(t,n){const e=t.b-a;return n*=Math.abs(e),{a:a,b:t.b,d:e,duration:n,start:t.start,end:t.start+n,group:t.group}}function b(r){const{delay:l=0,duration:s=300,easing:c=n,tick:b=t,css:x}=u||et,y={start:f()+l,b:r};r||(y.group=U,U.r+=1),i||h?h=y:(x&&($(),g=T(e,a,r,s,l,c,x)),r&&b(0,1),i=v(y,s),B((()=>K(e,r,"start"))),function(t){let n;0===m.size&&d(p),new Promise((e=>{m.add(n={c:t,f:e})}))}((t=>{if(h&&t>h.start&&(i=v(h,s),h=null,K(e,i.b,"start"),x&&($(),g=T(e,a,i.b,i.duration,0,c,u.css))),i)if(t>=i.end)b(a=i.b,1-a),K(e,i.b,"end"),h||(i.b?$():--i.group.r||o(i.group.c)),i=null;else if(t>=i.start){const n=t-i.start;a=i.a+i.d*c(n/i.duration),b(a,1-a)}return!(!i&&!h)})))}return{run(t){l(u)?(X||(X=Promise.resolve(),X.then((()=>{X=null}))),X).then((()=>{u=u(),b(t)})):b(t)},end(){$(),i=h=null}}}function ot(t,n){const e=n.token={};function r(t,r,o,l){if(n.token!==e)return;n.resolved=l;let s=n.ctx;void 0!==o&&(s=s.slice(),s[o]=l);const c=t&&(n.current=t)(s);let u=!1;n.block&&(n.blocks?n.blocks.forEach(((t,e)=>{e!==r&&t&&(V(),nt(t,1,1,(()=>{n.blocks[e]===t&&(n.blocks[e]=null)})),Z())})):n.block.d(1),c.c(),tt(c,1),c.m(n.mount(),n.anchor),u=!0),n.block=c,n.blocks&&(n.blocks[r]=c),u&&G()}if((o=t)&&"object"==typeof o&&"function"==typeof o.then){const e=L();if(t.then((t=>{D(e),r(n.then,1,n.value,t),D(null)}),(t=>{if(D(e),r(n.catch,2,n.error,t),D(null),!n.hasCatch)throw t})),n.current!==n.pending)return r(n.pending,0),!0}else{if(n.current!==n.then)return r(n.then,1,n.value,t),!0;n.resolved=t}var o}function lt(t){t&&t.c()}function st(t,n,r,s){const{fragment:c,on_mount:u,on_destroy:a,after_update:i}=t.$$;c&&c.m(n,r),s||B((()=>{const n=u.map(e).filter(l);a?a.push(...n):o(n),t.$$.on_mount=[]})),i.forEach(B)}function ct(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}function ut(t,n){-1===t.$$.dirty[0]&&(S.push(t),W||(W=!0,q.then(G)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function at(n,e,l,s,c,u,a,i=[-1]){const f=A;D(n);const d=n.$$={fragment:null,ctx:null,props:u,update:t,not_equal:c,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(f?f.$$.context:[])),callbacks:r(),dirty:i,skip_bound:!1,root:e.target||f.$$.root};a&&a(d.root);let m=!1;if(d.ctx=l?l(n,e.props||{},((t,e,...r)=>{const o=r.length?r[0]:e;return d.ctx&&c(d.ctx[t],d.ctx[t]=o)&&(!d.skip_bound&&d.bound[t]&&d.bound[t](o),m&&ut(n,t)),e})):[],d.update(),m=!0,o(d.before_update),d.fragment=!!s&&s(d.ctx),e.target){if(e.hydrate){const t=function(t){return Array.from(t.childNodes)}(e.target);d.fragment&&d.fragment.l(t),t.forEach(b)}else d.fragment&&d.fragment.c();e.intro&&tt(n.$$.fragment),st(n,e.target,e.anchor,e.customElement),G()}D(f)}class it{$destroy(){ct(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const ft=[];const dt=function(n,e=t){let r;const o=new Set;function l(t){if(s(n,t)&&(n=t,r)){const t=!ft.length;for(const t of o)t[1](),ft.push(t,n);if(t){for(let t=0;t<ft.length;t+=2)ft[t][0](ft[t+1]);ft.length=0}}}return{set:l,update:function(t){l(t(n))},subscribe:function(s,c=t){const u=[s,c];return o.add(u),1===o.size&&(r=e(l)||t),s(n),()=>{o.delete(u),0===o.size&&(r(),r=null)}}}}();function mt(n){let e,r,l,s;return{c(){e=y("form"),r=y("input"),E(r,"class","svelte-ne4jar"),E(e,"class","svelte-ne4jar")},m(t,o){var c;v(t,e,o),h(e,r),P(r,n[0]),l||(s=[j(r,"input",n[3]),j(e,"submit",(c=n[4],function(t){return t.preventDefault(),c.call(this,t)}))],l=!0)},p(t,[n]){1&n&&r.value!==t[0]&&P(r,t[0])},i:t,o:t,d(t){t&&b(e),l=!1,o(s)}}}function pt(t,n,e){let r,o;async function l(){const t=await fetch(`https://demo.dataverse.org/api/search?q=${o}&per_page=50`),n=await t.json();if("/:FORCEERROR"==o)throw new Error(`FORCED ERROR ; ${n}`);if(t.ok)return n;throw new Error(n)}a(t,dt,(t=>e(1,r=t)));return[o,r,l,function(){o=this.value,e(0,o)},()=>{var t,n;t=dt,r=l(),n=r,t.set(n)}]}class ht extends it{constructor(t){super(),at(this,t,pt,mt,s,{})}}function gt(t,n,e){const r=t.slice();return r[1]=n[e],r}function $t(n){let e;return{c(){e=y("div"),e.innerHTML='<div class="majorbox svelte-1jac42b"><div><p class="svelte-1jac42b">No results?</p> \n            <img src=".\\Parallax_elements\\No_Search_results_big.png" alt="No search results?" style="height:2in"/></div></div>',E(e,"class","item svelte-1jac42b")},m(t,n){v(t,e,n)},p:t,d(t){t&&b(e)}}}function vt(t){let n,e,r=t[0].data.items,o=[];for(let n=0;n<r.length;n+=1)o[n]=bt(gt(t,r,n));return{c(){n=y("div"),e=y("div");for(let t=0;t<o.length;t+=1)o[t].c();E(e,"class","majorbox svelte-1jac42b"),E(n,"class","item svelte-1jac42b")},m(t,r){v(t,n,r),h(n,e);for(let t=0;t<o.length;t+=1)o[t].m(e,null)},p(t,n){if(1&n){let l;for(r=t[0].data.items,l=0;l<r.length;l+=1){const s=gt(t,r,l);o[l]?o[l].p(s,n):(o[l]=bt(s),o[l].c(),o[l].m(e,null))}for(;l<o.length;l+=1)o[l].d(1);o.length=r.length}},d(t){t&&b(n),x(o,t)}}}function bt(t){let n,e,r,o,l,s,c,u,a=t[1].name+"",i=t[1].description+"";return{c(){n=y("div"),e=y("a"),r=w(a),l=_(),s=y("p"),c=w(i),u=_(),E(e,"href",o=t[1].url),E(e,"class","svelte-1jac42b"),E(s,"class","svelte-1jac42b"),E(n,"class","minorbox svelte-1jac42b")},m(t,o){v(t,n,o),h(n,e),h(e,r),h(n,l),h(n,s),h(s,c),h(n,u)},p(t,n){1&n&&a!==(a=t[1].name+"")&&C(r,a),1&n&&o!==(o=t[1].url)&&E(e,"href",o),1&n&&i!==(i=t[1].description+"")&&C(c,i)},d(t){t&&b(n)}}}function xt(n){let e;function r(t,n){return t[0]&&"data"in t[0]&&"items"in t[0].data&&t[0].data.items.length>0?vt:t[0]?$t:void 0}let o=r(n),l=o&&o(n);return{c(){l&&l.c(),e=k()},m(t,n){l&&l.m(t,n),v(t,e,n)},p(t,[n]){o===(o=r(t))&&l?l.p(t,n):(l&&l.d(1),l=o&&o(t),l&&(l.c(),l.m(e.parentNode,e)))},i:t,o:t,d(t){l&&l.d(t),t&&b(e)}}}function yt(t,n,e){let{json:r}=n;return t.$$set=t=>{"json"in t&&e(0,r=t.json)},[r]}class wt extends it{constructor(t){super(),at(this,t,yt,xt,s,{json:0})}}function _t(t,n,e){const r=t.slice();return r[3]=n[e],r}function kt(t){let n,e,r;return{c(){n=y("img"),R(n,"transform","translate(0,"+-t[0]*t[3]*Et/(t[1].length-1)+"px)"),u(n.src,e=t[1][t[3]])||E(n,"src",e),E(n,"alt",r="parallax layer "+t[3]),E(n,"class","svelte-5x7vhw")},m(t,e){v(t,n,e)},p(t,e){1&e&&R(n,"transform","translate(0,"+-t[0]*t[3]*Et/(t[1].length-1)+"px)")},d(t){t&&b(n)}}}function jt(n){let e,r,o,l,s,c,u=!1,a=()=>{u=!1};B(n[2]);let i=[...Array(n[1].length).keys()],f=[];for(let t=0;t<i.length;t+=1)f[t]=kt(_t(n,i,t));return{c(){r=y("div");for(let t=0;t<f.length;t+=1)f[t].c();o=_(),l=y("div"),E(l,"class","foreground svelte-5x7vhw"),R(l,"transform","translate(0,"+(360-3*n[0]*Et/(n[1].length-1))+"px"),E(r,"class","main svelte-5x7vhw")},m(t,i){v(t,r,i);for(let t=0;t<f.length;t+=1)f[t].m(r,null);h(r,o),h(r,l),s||(c=j(window,"scroll",(()=>{u=!0,clearTimeout(e),e=setTimeout(a,100),n[2]()})),s=!0)},p(t,[n]){if(1&n&&!u&&(u=!0,clearTimeout(e),scrollTo(window.pageXOffset,t[0]),e=setTimeout(a,100)),3&n){let e;for(i=[...Array(t[1].length).keys()],e=0;e<i.length;e+=1){const l=_t(t,i,e);f[e]?f[e].p(l,n):(f[e]=kt(l),f[e].c(),f[e].m(r,o))}for(;e<f.length;e+=1)f[e].d(1);f.length=i.length}1&n&&R(l,"transform","translate(0,"+(360-3*t[0]*Et/(t[1].length-1))+"px")},i:t,o:t,d(t){t&&b(r),x(f,t),s=!1,c()}}}let Et=.6;function Ct(t,n,e){let r;return[r,[".\\Parallax_elements\\Parallax_night_layer1.png",".\\Parallax_elements\\Parallax_night_layer2.png",".\\Parallax_elements\\Parallax_night_layer3.png",".\\Parallax_elements\\Parallax_night_layer4.png"],function(){e(0,r=window.pageYOffset)}]}class Pt extends it{constructor(t){super(),at(this,t,Ct,jt,s,{})}}function Rt(n){let e;return{c(){e=y("div"),e.innerHTML='<div class="svelte-1t6x846"></div><div class="svelte-1t6x846"></div><div class="svelte-1t6x846"></div><div class="svelte-1t6x846"></div>',E(e,"class","lds-ellipsis svelte-1t6x846")},m(t,n){v(t,e,n)},p:t,i:t,o:t,d(t){t&&b(e)}}}class Nt extends it{constructor(t){super(),at(this,t,null,Rt,s,{})}}function At(t,{delay:e=0,duration:r=400,easing:o=n}={}){const l=+getComputedStyle(t).opacity;return{delay:e,duration:r,easing:o,css:t=>"opacity: "+t*l}}function Ot(t){let n,e,r,o,l,s,c;return{c(){n=y("p"),n.textContent="Not for long.",r=_(),o=y("img"),E(n,"class","svelte-f86nel"),u(o.src,l=".\\Parallax_elements\\Happy.png")||E(o,"src",".\\Parallax_elements\\Happy.png"),E(o,"alt",":D")},m(t,e){v(t,n,e),v(t,r,e),v(t,o,e),c=!0},i(t){c||(B((()=>{e||(e=rt(n,At,{},!0)),e.run(1)})),B((()=>{s||(s=rt(o,At,{},!0)),s.run(1)})),c=!0)},o(t){e||(e=rt(n,At,{},!1)),e.run(0),s||(s=rt(o,At,{},!1)),s.run(0),c=!1},d(t){t&&b(n),t&&e&&e.end(),t&&b(r),t&&b(o),t&&s&&s.end()}}}function Tt(t){let n,e,r,o,l,s,c=t[0]&&Ot();return{c(){n=y("div"),e=y("button"),e.textContent="I'm Feeling Lucky!",r=_(),c&&c.c(),E(e,"class","svelte-f86nel")},m(u,a){v(u,n,a),h(n,e),h(n,r),c&&c.m(n,null),o=!0,l||(s=j(e,"click",t[1]),l=!0)},p(t,[e]){t[0]?c?1&e&&tt(c,1):(c=Ot(),c.c(),tt(c,1),c.m(n,null)):c&&(V(),nt(c,1,1,(()=>{c=null})),Z())},i(t){o||(tt(c),o=!0)},o(t){nt(c),o=!1},d(t){t&&b(n),c&&c.d(),l=!1,s()}}}function zt(t,n,e){let r=!1;return[r,()=>{e(0,r=!0)}]}class Dt extends it{constructor(t){super(),at(this,t,zt,Tt,s,{})}}function Lt(t){let n,e,r,o,l;return o=new ht({}),{c(){n=y("div"),e=y("h1"),e.textContent="Wayfinder",r=_(),lt(o.$$.fragment),E(e,"class","logoAlt svelte-k13la7"),E(n,"class","topbar svelte-k13la7")},m(t,s){v(t,n,s),h(n,e),h(n,r),st(o,n,null),l=!0},i(t){l||(tt(o.$$.fragment,t),l=!0)},o(t){nt(o.$$.fragment,t),l=!1},d(t){t&&b(n),ct(o)}}}function St(t){let n,e,r,o,l,s,c,u,a;return s=new ht({}),u=new Dt({}),{c(){n=y("div"),e=y("p"),e.textContent=" ",r=_(),o=y("h1"),o.textContent="Wayfinder",l=_(),lt(s.$$.fragment),c=_(),lt(u.$$.fragment),E(e,"class","svelte-k13la7"),E(o,"class","logo svelte-k13la7"),E(n,"class","front svelte-k13la7")},m(t,i){v(t,n,i),h(n,e),h(n,r),h(n,o),h(n,l),st(s,n,null),h(n,c),st(u,n,null),a=!0},i(t){a||(tt(s.$$.fragment,t),tt(u.$$.fragment,t),a=!0)},o(t){nt(s.$$.fragment,t),nt(u.$$.fragment,t),a=!1},d(t){t&&b(n),ct(s),ct(u)}}}function Ft(n){let e;return{c(){e=y("p"),e.textContent="An error occured, get fucked i guess ¯\\_(ツ)_/¯",E(e,"class","svelte-k13la7")},m(t,n){v(t,e,n)},p:t,i:t,o:t,d(t){t&&b(e)}}}function Mt(t){let n,e,r=t[0]&&Ht(t);return{c(){r&&r.c(),n=k()},m(t,o){r&&r.m(t,o),v(t,n,o),e=!0},p(t,e){t[0]?r?(r.p(t,e),1&e&&tt(r,1)):(r=Ht(t),r.c(),tt(r,1),r.m(n.parentNode,n)):r&&(V(),nt(r,1,1,(()=>{r=null})),Z())},i(t){e||(tt(r),e=!0)},o(t){nt(r),e=!1},d(t){r&&r.d(t),t&&b(n)}}}function Ht(t){let n,e,r,o;const l=[Wt,qt],s=[];function c(t,n){return t[1]>=1230?0:1}return n=c(t),e=s[n]=l[n](t),{c(){e.c(),r=k()},m(t,e){s[n].m(t,e),v(t,r,e),o=!0},p(t,o){let u=n;n=c(t),n===u?s[n].p(t,o):(V(),nt(s[u],1,1,(()=>{s[u]=null})),Z(),e=s[n],e?e.p(t,o):(e=s[n]=l[n](t),e.c()),tt(e,1),e.m(r.parentNode,r))},i(t){o||(tt(e),o=!0)},o(t){nt(e),o=!1},d(t){s[n].d(t),t&&b(r)}}}function qt(t){let n,e,r;return e=new wt({props:{json:t[5]}}),{c(){n=y("div"),lt(e.$$.fragment),E(n,"class","mainboxALT svelte-k13la7")},m(t,o){v(t,n,o),st(e,n,null),r=!0},p(t,n){const r={};4&n&&(r.json=t[5]),e.$set(r)},i(t){r||(tt(e.$$.fragment,t),r=!0)},o(t){nt(e.$$.fragment,t),r=!1},d(t){t&&b(n),ct(e)}}}function Wt(t){let n,e,r,o,l,s,c;return e=new Pt({}),o=new wt({props:{json:t[5]}}),s=new Pt({}),{c(){n=y("div"),lt(e.$$.fragment),r=_(),lt(o.$$.fragment),l=_(),lt(s.$$.fragment),E(n,"class","mainbox svelte-k13la7")},m(t,u){v(t,n,u),st(e,n,null),h(n,r),st(o,n,null),h(n,l),st(s,n,null),c=!0},p(t,n){const e={};4&n&&(e.json=t[5]),o.$set(e)},i(t){c||(tt(e.$$.fragment,t),tt(o.$$.fragment,t),tt(s.$$.fragment,t),c=!0)},o(t){nt(e.$$.fragment,t),nt(o.$$.fragment,t),nt(s.$$.fragment,t),c=!1},d(t){t&&b(n),ct(e),ct(o),ct(s)}}}function Bt(n){let e,r;return e=new Nt({}),e.$on("load",n[3]()),{c(){lt(e.$$.fragment)},m(t,n){st(e,t,n),r=!0},p:t,i(t){r||(tt(e.$$.fragment,t),r=!0)},o(t){nt(e.$$.fragment,t),r=!1},d(t){ct(e,t)}}}function It(t){let n,e,r,o,l,s,c,u;B(t[4]);const a=[St,Lt],i=[];function f(t,n){return t[0]?1:0}e=f(t),r=i[e]=a[e](t);let d={ctx:t,current:null,token:null,hasCatch:!0,pending:Bt,then:Mt,catch:Ft,value:5,blocks:[,,,]};return ot(l=t[2],d),{c(){n=y("main"),r.c(),o=_(),d.block.c(),E(n,"class","svelte-k13la7")},m(r,l){v(r,n,l),i[e].m(n,null),h(n,o),d.block.m(n,d.anchor=null),d.mount=()=>n,d.anchor=null,s=!0,c||(u=j(window,"resize",t[4]),c=!0)},p(s,[c]){let u=e;e=f(t=s),e!==u&&(V(),nt(i[u],1,1,(()=>{i[u]=null})),Z(),r=i[e],r||(r=i[e]=a[e](t),r.c()),tt(r,1),r.m(n,o)),d.ctx=t,4&c&&l!==(l=t[2])&&ot(l,d)||function(t,n,e){const r=n.slice(),{resolved:o}=t;t.current===t.then&&(r[t.value]=o),t.current===t.catch&&(r[t.error]=o),t.block.p(r,e)}(d,t,c)},i(t){s||(tt(r),tt(d.block),s=!0)},o(t){nt(r);for(let t=0;t<3;t+=1){nt(d.blocks[t])}s=!1},d(t){t&&b(n),i[e].d(),d.block.d(),d.token=null,d=null,c=!1,u()}}}function Xt(t,n,e){let r;a(t,dt,(t=>e(2,r=t)));let o,l=!1;return[l,o,r,function(){e(0,l=!0)},function(){e(1,o=window.outerWidth)}]}return new class extends it{constructor(t){super(),at(this,t,Xt,It,s,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
