var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function c(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function u(t){t.parentNode.removeChild(t)}let s;function a(t){s=t}const i=[],f=[],l=[],d=[],p=Promise.resolve();let h=!1;function $(t){l.push(t)}const m=new Set;let g=0;function b(){const t=s;do{for(;g<i.length;){const t=i[g];g++,a(t),y(t.$$)}for(a(null),i.length=0,g=0;f.length;)f.pop()();for(let t=0;t<l.length;t+=1){const n=l[t];m.has(n)||(m.add(n),n())}l.length=0}while(i.length);for(;d.length;)d.pop()();h=!1,m.clear(),a(t)}function y(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach($)}}const _=new Set;function x(t,n){-1===t.$$.dirty[0]&&(i.push(t),h||(h=!0,p.then(b)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function v(c,i,f,l,d,p,h,m=[-1]){const g=s;a(c);const y=c.$$={fragment:null,ctx:null,props:p,update:t,not_equal:d,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(i.context||(g?g.$$.context:[])),callbacks:e(),dirty:m,skip_bound:!1,root:i.target||g.$$.root};h&&h(y.root);let v=!1;if(y.ctx=f?f(c,i.props||{},((t,n,...e)=>{const o=e.length?e[0]:n;return y.ctx&&d(y.ctx[t],y.ctx[t]=o)&&(!y.skip_bound&&y.bound[t]&&y.bound[t](o),v&&x(c,t)),n})):[],y.update(),v=!0,o(y.before_update),y.fragment=!!l&&l(y.ctx),i.target){if(i.hydrate){const t=function(t){return Array.from(t.childNodes)}(i.target);y.fragment&&y.fragment.l(t),t.forEach(u)}else y.fragment&&y.fragment.c();i.intro&&((k=c.$$.fragment)&&k.i&&(_.delete(k),k.i(w))),function(t,e,c,u){const{fragment:s,on_mount:a,on_destroy:i,after_update:f}=t.$$;s&&s.m(e,c),u||$((()=>{const e=a.map(n).filter(r);i?i.push(...e):o(e),t.$$.on_mount=[]})),f.forEach($)}(c,i.target,i.anchor,i.customElement),b()}var k,w;a(g)}function k(n){let e;return{c(){var t,n,o,r;t="main",e=document.createElement(t),e.innerHTML='<a href="/webdevpub/Clock/">Dwayne &quot;The Rock&quot; Johnsson Fansite</a> \n\t<a href="/webdevpub/Search/">Wayfinder Search</a>',n=e,o="class",null==(r="svelte-6hvrco")?n.removeAttribute(o):n.getAttribute(o)!==r&&n.setAttribute(o,r)},m(t,n){!function(t,n,e){t.insertBefore(n,e||null)}(t,e,n)},p:t,i:t,o:t,d(t){t&&u(e)}}}return new class extends class{$destroy(){!function(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),v(this,t,null,k,c,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map