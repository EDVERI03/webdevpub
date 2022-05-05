
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.5' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const SRC = writable("https://tile.loc.gov/storage-services/service/mbrs/ntscrm/00068306/00068306.mp4");
    const POSTER = writable("https://tile.loc.gov/storage-services/service/mbrs/ntscrm/00068306/00068306.jpg");
    const TITLE = writable("placeholder");
    const playerIsActive = writable(false);

    const popUpTitle = writable("Error");
    const popUpDescription = writable("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi felis leo, tincidunt sit amet hendrerit id, malesuada et turpis. Etiam eros elit, commodo vitae erat non, luctus dignissim orci. In molestie in ipsum eu dapibus. Maecenas eget mi tincidunt, egestas lorem ut, egestas ligula. Integer justo urna, porta ut lacus eget, auctor aliquam leo. Nunc congue est dictum pellentesque ornare. In ultrices mi vel sapien tempor euismod. Etiam sed orci euismod, rutrum odio at, rhoncus dolor. Suspendisse a sodales justo, sed sagittis justo. Ut placerat cursus dui id sagittis.");
    const popUpIsActive = writable(false);

    /* eslint-disable no-param-reassign */

    /**
     * Options for customizing ripples
     */
    const defaults = {
      color: 'currentColor',
      class: '',
      opacity: 0.1,
      centered: false,
      spreadingDuration: '.4s',
      spreadingDelay: '0s',
      spreadingTimingFunction: 'linear',
      clearingDuration: '1s',
      clearingDelay: '0s',
      clearingTimingFunction: 'ease-in-out',
    };

    /**
     * Creates a ripple element but does not destroy it (use RippleStop for that)
     *
     * @param {Event} e
     * @param {*} options
     * @returns Ripple element
     */
    function RippleStart(e, options = {}) {
      e.stopImmediatePropagation();
      const opts = { ...defaults, ...options };

      const isTouchEvent = e.touches ? !!e.touches[0] : false;
      // Parent element
      const target = isTouchEvent ? e.touches[0].currentTarget : e.currentTarget;

      // Create ripple
      const ripple = document.createElement('div');
      const rippleStyle = ripple.style;

      // Adding default stuff
      ripple.className = `material-ripple ${opts.class}`;
      rippleStyle.position = 'absolute';
      rippleStyle.color = 'inherit';
      rippleStyle.borderRadius = '50%';
      rippleStyle.pointerEvents = 'none';
      rippleStyle.width = '100px';
      rippleStyle.height = '100px';
      rippleStyle.marginTop = '-50px';
      rippleStyle.marginLeft = '-50px';
      target.appendChild(ripple);
      rippleStyle.opacity = opts.opacity;
      rippleStyle.transition = `transform ${opts.spreadingDuration} ${opts.spreadingTimingFunction} ${opts.spreadingDelay},opacity ${opts.clearingDuration} ${opts.clearingTimingFunction} ${opts.clearingDelay}`;
      rippleStyle.transform = 'scale(0) translate(0,0)';
      rippleStyle.background = opts.color;

      // Positioning ripple
      const targetRect = target.getBoundingClientRect();
      if (opts.centered) {
        rippleStyle.top = `${targetRect.height / 2}px`;
        rippleStyle.left = `${targetRect.width / 2}px`;
      } else {
        const distY = isTouchEvent ? e.touches[0].clientY : e.clientY;
        const distX = isTouchEvent ? e.touches[0].clientX : e.clientX;
        rippleStyle.top = `${distY - targetRect.top}px`;
        rippleStyle.left = `${distX - targetRect.left}px`;
      }

      // Enlarge ripple
      rippleStyle.transform = `scale(${
    Math.max(targetRect.width, targetRect.height) * 0.02
  }) translate(0,0)`;
      return ripple;
    }

    /**
     * Destroys the ripple, slowly fading it out.
     *
     * @param {Element} ripple
     */
    function RippleStop(ripple) {
      if (ripple) {
        ripple.addEventListener('transitionend', (e) => {
          if (e.propertyName === 'opacity') ripple.remove();
        });
        ripple.style.opacity = 0;
      }
    }

    /**
     * @param node {Element}
     */
    var Ripple = (node, _options = {}) => {
      let options = _options;
      let destroyed = false;
      let ripple;
      let keyboardActive = false;
      const handleStart = (e) => {
        ripple = RippleStart(e, options);
      };
      const handleStop = () => RippleStop(ripple);
      const handleKeyboardStart = (e) => {
        if (!keyboardActive && (e.keyCode === 13 || e.keyCode === 32)) {
          ripple = RippleStart(e, { ...options, centered: true });
          keyboardActive = true;
        }
      };
      const handleKeyboardStop = () => {
        keyboardActive = false;
        handleStop();
      };

      function setup() {
        node.classList.add('s-ripple-container');
        node.addEventListener('pointerdown', handleStart);
        node.addEventListener('pointerup', handleStop);
        node.addEventListener('pointerleave', handleStop);
        node.addEventListener('keydown', handleKeyboardStart);
        node.addEventListener('keyup', handleKeyboardStop);
        destroyed = false;
      }

      function destroy() {
        node.classList.remove('s-ripple-container');
        node.removeEventListener('pointerdown', handleStart);
        node.removeEventListener('pointerup', handleStop);
        node.removeEventListener('pointerleave', handleStop);
        node.removeEventListener('keydown', handleKeyboardStart);
        node.removeEventListener('keyup', handleKeyboardStop);
        destroyed = true;
      }

      if (options) setup();

      return {
        update(newOptions) {
          options = newOptions;
          if (options && destroyed) setup();
          else if (!(options || destroyed)) destroy();
        },
        destroy,
      };
    };

    /* eslint-disable */
    // Shamefully ripped from https://github.com/lukeed/uid
    let IDX = 36;
    let HEX = '';
    while (IDX--) HEX += IDX.toString(36);

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* eslint-disable no-param-reassign */

    const themeColors = ['primary', 'secondary', 'success', 'info', 'warning', 'error'];

    /**
     * @param {string} klass
     */
    function formatClass(klass) {
      return klass.split(' ').map((i) => {
        if (themeColors.includes(i)) return `${i}-color`;
        return i;
      });
    }

    function setBackgroundColor(node, text) {
      if (/^(#|rgb|hsl|currentColor)/.test(text)) {
        // This is a CSS hex.
        node.style.backgroundColor = text;
        return false;
      }

      if (text.startsWith('--')) {
        // This is a CSS variable.
        node.style.backgroundColor = `var(${text})`;
        return false;
      }

      const klass = formatClass(text);
      node.classList.add(...klass);
      return klass;
    }

    /**
     * @param node {Element}
     * @param text {string|boolean}
     */
    var BackgroundColor = (node, text) => {
      let klass;
      if (typeof text === 'string') {
        klass = setBackgroundColor(node, text);
      }

      return {
        update(newText) {
          if (klass) {
            node.classList.remove(...klass);
          } else {
            node.style.backgroundColor = null;
          }

          if (typeof newText === 'string') {
            klass = setBackgroundColor(node, newText);
          }
        },
      };
    };

    /* node_modules\svelte-materialify\dist\components\Overlay\Overlay.svelte generated by Svelte v3.46.5 */
    const file$3 = "node_modules\\svelte-materialify\\dist\\components\\Overlay\\Overlay.svelte";

    // (20:0) {#if active}
    function create_if_block$1(ctx) {
    	let div2;
    	let div0;
    	let BackgroundColor_action;
    	let t;
    	let div1;
    	let div2_class_value;
    	let div2_style_value;
    	let div2_intro;
    	let div2_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "s-overlay__scrim svelte-zop6hb");
    			set_style(div0, "opacity", /*opacity*/ ctx[5]);
    			add_location(div0, file$3, 27, 4, 1076);
    			attr_dev(div1, "class", "s-overlay__content svelte-zop6hb");
    			add_location(div1, file$3, 28, 4, 1167);
    			attr_dev(div2, "class", div2_class_value = "s-overlay " + /*klass*/ ctx[0] + " svelte-zop6hb");
    			attr_dev(div2, "style", div2_style_value = "z-index:" + /*index*/ ctx[7] + ";" + /*style*/ ctx[9]);
    			toggle_class(div2, "absolute", /*absolute*/ ctx[8]);
    			add_location(div2, file$3, 20, 2, 912);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(BackgroundColor_action = BackgroundColor.call(null, div0, /*color*/ ctx[6])),
    					listen_dev(div2, "click", /*click_handler*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty & /*opacity*/ 32) {
    				set_style(div0, "opacity", /*opacity*/ ctx[5]);
    			}

    			if (BackgroundColor_action && is_function(BackgroundColor_action.update) && dirty & /*color*/ 64) BackgroundColor_action.update.call(null, /*color*/ ctx[6]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*klass*/ 1 && div2_class_value !== (div2_class_value = "s-overlay " + /*klass*/ ctx[0] + " svelte-zop6hb")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty & /*index, style*/ 640 && div2_style_value !== (div2_style_value = "z-index:" + /*index*/ ctx[7] + ";" + /*style*/ ctx[9])) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (dirty & /*klass, absolute*/ 257) {
    				toggle_class(div2, "absolute", /*absolute*/ ctx[8]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div2_outro) div2_outro.end(1);
    				div2_intro = create_in_transition(div2, /*transition*/ ctx[1], /*inOpts*/ ctx[2]);
    				div2_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div2_intro) div2_intro.invalidate();
    			div2_outro = create_out_transition(div2, /*transition*/ ctx[1], /*outOpts*/ ctx[3]);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div2_outro) div2_outro.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(20:0) {#if active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*active*/ ctx[4] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*active*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*active*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Overlay', slots, ['default']);
    	let { class: klass = '' } = $$props;
    	let { transition = fade } = $$props;
    	let { inOpts = { duration: 250 } } = $$props;
    	let { outOpts = { duration: 250 } } = $$props;
    	let { active = true } = $$props;
    	let { opacity = 0.46 } = $$props;
    	let { color = 'rgb(33, 33, 33)' } = $$props;
    	let { index = 5 } = $$props;
    	let { absolute = false } = $$props;
    	let { style = '' } = $$props;

    	const writable_props = [
    		'class',
    		'transition',
    		'inOpts',
    		'outOpts',
    		'active',
    		'opacity',
    		'color',
    		'index',
    		'absolute',
    		'style'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Overlay> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, klass = $$props.class);
    		if ('transition' in $$props) $$invalidate(1, transition = $$props.transition);
    		if ('inOpts' in $$props) $$invalidate(2, inOpts = $$props.inOpts);
    		if ('outOpts' in $$props) $$invalidate(3, outOpts = $$props.outOpts);
    		if ('active' in $$props) $$invalidate(4, active = $$props.active);
    		if ('opacity' in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ('color' in $$props) $$invalidate(6, color = $$props.color);
    		if ('index' in $$props) $$invalidate(7, index = $$props.index);
    		if ('absolute' in $$props) $$invalidate(8, absolute = $$props.absolute);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		BackgroundColor,
    		klass,
    		transition,
    		inOpts,
    		outOpts,
    		active,
    		opacity,
    		color,
    		index,
    		absolute,
    		style
    	});

    	$$self.$inject_state = $$props => {
    		if ('klass' in $$props) $$invalidate(0, klass = $$props.klass);
    		if ('transition' in $$props) $$invalidate(1, transition = $$props.transition);
    		if ('inOpts' in $$props) $$invalidate(2, inOpts = $$props.inOpts);
    		if ('outOpts' in $$props) $$invalidate(3, outOpts = $$props.outOpts);
    		if ('active' in $$props) $$invalidate(4, active = $$props.active);
    		if ('opacity' in $$props) $$invalidate(5, opacity = $$props.opacity);
    		if ('color' in $$props) $$invalidate(6, color = $$props.color);
    		if ('index' in $$props) $$invalidate(7, index = $$props.index);
    		if ('absolute' in $$props) $$invalidate(8, absolute = $$props.absolute);
    		if ('style' in $$props) $$invalidate(9, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		klass,
    		transition,
    		inOpts,
    		outOpts,
    		active,
    		opacity,
    		color,
    		index,
    		absolute,
    		style,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class Overlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			class: 0,
    			transition: 1,
    			inOpts: 2,
    			outOpts: 3,
    			active: 4,
    			opacity: 5,
    			color: 6,
    			index: 7,
    			absolute: 8,
    			style: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Overlay",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get class() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transition() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transition(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inOpts() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inOpts(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outOpts() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outOpts(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get opacity() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set opacity(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get index() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set index(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get absolute() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set absolute(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Overlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Overlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\VideoPlayer.svelte generated by Svelte v3.46.5 */
    const file$2 = "src\\VideoPlayer.svelte";

    function create_fragment$2(ctx) {
    	let div;
    	let p;
    	let t0;
    	let t1;
    	let button;
    	let i;
    	let t3;
    	let video;
    	let track;
    	let source;
    	let source_src_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			p = element("p");
    			t0 = text(/*videoTITLE*/ ctx[2]);
    			t1 = space();
    			button = element("button");
    			i = element("i");
    			i.textContent = "close";
    			t3 = space();
    			video = element("video");
    			track = element("track");
    			source = element("source");
    			attr_dev(p, "class", "title svelte-16itq10");
    			add_location(p, file$2, 16, 4, 538);
    			attr_dev(i, "class", "material-icons svelte-16itq10");
    			add_location(i, file$2, 18, 8, 685);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "closeButton svelte-16itq10");
    			add_location(button, file$2, 17, 4, 577);
    			attr_dev(track, "kind", "captions");
    			add_location(track, file$2, 21, 8, 818);
    			if (!src_url_equal(source.src, source_src_value = /*videoSCR*/ ctx[0])) attr_dev(source, "src", source_src_value);
    			add_location(source, file$2, 22, 8, 851);
    			video.controls = true;
    			attr_dev(video, "poster", /*videoPOSTER*/ ctx[1]);
    			attr_dev(video, "class", "svelte-16itq10");
    			add_location(video, file$2, 20, 4, 742);
    			attr_dev(div, "class", "border svelte-16itq10");
    			add_location(div, file$2, 15, 0, 512);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p);
    			append_dev(p, t0);
    			append_dev(div, t1);
    			append_dev(div, button);
    			append_dev(button, i);
    			append_dev(div, t3);
    			append_dev(div, video);
    			append_dev(video, track);
    			append_dev(video, source);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Ripple.call(null, button)),
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false),
    					listen_dev(video, "load", /*updateSource*/ ctx[4](), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*videoTITLE*/ 4) set_data_dev(t0, /*videoTITLE*/ ctx[2]);

    			if (dirty & /*videoSCR*/ 1 && !src_url_equal(source.src, source_src_value = /*videoSCR*/ ctx[0])) {
    				attr_dev(source, "src", source_src_value);
    			}

    			if (dirty & /*videoPOSTER*/ 2) {
    				attr_dev(video, "poster", /*videoPOSTER*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $TITLE;
    	let $POSTER;
    	let $SRC;
    	let $playerIsActive;
    	validate_store(TITLE, 'TITLE');
    	component_subscribe($$self, TITLE, $$value => $$invalidate(6, $TITLE = $$value));
    	validate_store(POSTER, 'POSTER');
    	component_subscribe($$self, POSTER, $$value => $$invalidate(7, $POSTER = $$value));
    	validate_store(SRC, 'SRC');
    	component_subscribe($$self, SRC, $$value => $$invalidate(8, $SRC = $$value));
    	validate_store(playerIsActive, 'playerIsActive');
    	component_subscribe($$self, playerIsActive, $$value => $$invalidate(3, $playerIsActive = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VideoPlayer', slots, []);
    	let videoSCR = "https://tile.loc.gov/storage-services/service/mbrs/ntscrm/00068306/00068306.mp4";
    	let videoPOSTER = "https://tile.loc.gov/storage-services/service/mbrs/ntscrm/00068306/00068306.jpg";
    	let videoTITLE = "placeholder";

    	function updateSource() {
    		$$invalidate(0, videoSCR = $SRC);
    		$$invalidate(1, videoPOSTER = $POSTER);
    		$$invalidate(2, videoTITLE = $TITLE);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VideoPlayer> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		set_store_value(playerIsActive, $playerIsActive = false, $playerIsActive);
    	};

    	$$self.$capture_state = () => ({
    		SRC,
    		POSTER,
    		TITLE,
    		playerIsActive,
    		Ripple,
    		videoSCR,
    		videoPOSTER,
    		videoTITLE,
    		updateSource,
    		$TITLE,
    		$POSTER,
    		$SRC,
    		$playerIsActive
    	});

    	$$self.$inject_state = $$props => {
    		if ('videoSCR' in $$props) $$invalidate(0, videoSCR = $$props.videoSCR);
    		if ('videoPOSTER' in $$props) $$invalidate(1, videoPOSTER = $$props.videoPOSTER);
    		if ('videoTITLE' in $$props) $$invalidate(2, videoTITLE = $$props.videoTITLE);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		videoSCR,
    		videoPOSTER,
    		videoTITLE,
    		$playerIsActive,
    		updateSource,
    		click_handler
    	];
    }

    class VideoPlayer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VideoPlayer",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\PopUp.svelte generated by Svelte v3.46.5 */
    const file$1 = "src\\PopUp.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let button;
    	let i;
    	let t1;
    	let div0;
    	let h1;
    	let t2;
    	let t3;
    	let p;
    	let t4;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button = element("button");
    			i = element("i");
    			i.textContent = "close";
    			t1 = space();
    			div0 = element("div");
    			h1 = element("h1");
    			t2 = text(/*$popUpTitle*/ ctx[1]);
    			t3 = space();
    			p = element("p");
    			t4 = text(/*$popUpDescription*/ ctx[2]);
    			attr_dev(i, "class", "material-icons svelte-1ynfglm");
    			add_location(i, file$1, 9, 8, 315);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "closeButton svelte-1ynfglm");
    			add_location(button, file$1, 8, 4, 208);
    			attr_dev(h1, "class", "svelte-1ynfglm");
    			add_location(h1, file$1, 12, 8, 387);
    			attr_dev(p, "class", "svelte-1ynfglm");
    			add_location(p, file$1, 13, 8, 419);
    			attr_dev(div0, "class", "svelte-1ynfglm");
    			add_location(div0, file$1, 11, 4, 372);
    			attr_dev(div1, "class", "mainWindow svelte-1ynfglm");
    			add_location(div1, file$1, 7, 0, 178);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button);
    			append_dev(button, i);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t2);
    			append_dev(div0, t3);
    			append_dev(div0, p);
    			append_dev(p, t4);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Ripple.call(null, button)),
    					listen_dev(button, "click", /*click_handler*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$popUpTitle*/ 2) set_data_dev(t2, /*$popUpTitle*/ ctx[1]);
    			if (dirty & /*$popUpDescription*/ 4) set_data_dev(t4, /*$popUpDescription*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $popUpIsActive;
    	let $popUpTitle;
    	let $popUpDescription;
    	validate_store(popUpIsActive, 'popUpIsActive');
    	component_subscribe($$self, popUpIsActive, $$value => $$invalidate(0, $popUpIsActive = $$value));
    	validate_store(popUpTitle, 'popUpTitle');
    	component_subscribe($$self, popUpTitle, $$value => $$invalidate(1, $popUpTitle = $$value));
    	validate_store(popUpDescription, 'popUpDescription');
    	component_subscribe($$self, popUpDescription, $$value => $$invalidate(2, $popUpDescription = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PopUp', slots, []);
    	let title = "placeholder";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PopUp> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		set_store_value(popUpIsActive, $popUpIsActive = false, $popUpIsActive);
    	};

    	$$self.$capture_state = () => ({
    		Ripple,
    		popUpIsActive,
    		popUpDescription,
    		popUpTitle,
    		title,
    		$popUpIsActive,
    		$popUpTitle,
    		$popUpDescription
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) title = $$props.title;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$popUpIsActive, $popUpTitle, $popUpDescription, click_handler];
    }

    class PopUp extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PopUp",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.5 */

    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (71:2) {#if width >= 450}
    function create_if_block_1(ctx) {
    	let div;
    	let button0;
    	let i0;
    	let t1;
    	let button1;
    	let i1;
    	let t3;
    	let button2;
    	let i2;
    	let t5;
    	let button3;
    	let i3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			i0.textContent = "account_circle";
    			t1 = space();
    			button1 = element("button");
    			i1 = element("i");
    			i1.textContent = "bookmark";
    			t3 = space();
    			button2 = element("button");
    			i2 = element("i");
    			i2.textContent = "remove_red_eye";
    			t5 = space();
    			button3 = element("button");
    			i3 = element("i");
    			i3.textContent = "settings";
    			attr_dev(i0, "class", "material-icons svelte-1ajz32b");
    			add_location(i0, file, 73, 4, 3539);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "navButtons svelte-1ajz32b");
    			add_location(button0, file, 72, 3, 3387);
    			attr_dev(i1, "class", "material-icons svelte-1ajz32b");
    			add_location(i1, file, 76, 4, 3762);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "navButtons svelte-1ajz32b");
    			add_location(button1, file, 75, 3, 3601);
    			attr_dev(i2, "class", "material-icons svelte-1ajz32b");
    			add_location(i2, file, 82, 4, 4381);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "navButtons svelte-1ajz32b");
    			add_location(button2, file, 78, 3, 3818);
    			attr_dev(i3, "class", "material-icons svelte-1ajz32b");
    			add_location(i3, file, 85, 4, 4678);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "navButtons svelte-1ajz32b");
    			add_location(button3, file, 84, 3, 4443);
    			attr_dev(div, "class", "buttonGroup svelte-1ajz32b");
    			add_location(div, file, 71, 2, 3358);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(button0, i0);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			append_dev(button1, i1);
    			append_dev(div, t3);
    			append_dev(div, button2);
    			append_dev(button2, i2);
    			append_dev(div, t5);
    			append_dev(div, button3);
    			append_dev(button3, i3);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Ripple.call(null, button0)),
    					listen_dev(button0, "click", /*click_handler*/ ctx[8], false, false, false),
    					action_destroyer(Ripple.call(null, button1)),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[9], false, false, false),
    					action_destroyer(Ripple.call(null, button2)),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[10], false, false, false),
    					action_destroyer(Ripple.call(null, button3)),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(71:2) {#if width >= 450}",
    		ctx
    	});

    	return block;
    }

    // (92:1) <Overlay class="overlay" active="{$popUpIsActive}">
    function create_default_slot_1(ctx) {
    	let popup;
    	let current;
    	popup = new PopUp({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(popup.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(popup, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(popup.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(popup.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(popup, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(92:1) <Overlay class=\\\"overlay\\\" active=\\\"{$popUpIsActive}\\\">",
    		ctx
    	});

    	return block;
    }

    // (96:1) <Overlay class="overlay" active="{$playerIsActive}">
    function create_default_slot(ctx) {
    	let videoplayer;
    	let current;
    	videoplayer = new VideoPlayer({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(videoplayer.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(videoplayer, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(videoplayer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(videoplayer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(videoplayer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(96:1) <Overlay class=\\\"overlay\\\" active=\\\"{$playerIsActive}\\\">",
    		ctx
    	});

    	return block;
    }

    // (104:5) {#each movies as movie}
    function create_each_block_1(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let t1;
    	let p;
    	let t2_value = /*movie*/ ctx[7].ALT + "";
    	let t2;
    	let mounted;
    	let dispose;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[12](/*movie*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			if (!src_url_equal(img.src, img_src_value = /*movie*/ ctx[7].CARD)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*movie*/ ctx[7].ALT);
    			attr_dev(img, "class", "movie svelte-1ajz32b");
    			add_location(img, file, 107, 6, 5155);
    			attr_dev(div0, "class", "svelte-1ajz32b");
    			add_location(div0, file, 112, 6, 5312);
    			attr_dev(p, "class", "svelte-1ajz32b");
    			add_location(p, file, 113, 6, 5325);
    			attr_dev(div1, "class", "iconContainer svelte-1ajz32b");
    			add_location(div1, file, 105, 5, 5105);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(p, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(img, "click", click_handler_4, false, false, false),
    					action_destroyer(Ripple.call(null, div1))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(104:5) {#each movies as movie}",
    		ctx
    	});

    	return block;
    }

    // (101:2) {#each categories as category}
    function create_each_block(ctx) {
    	let h1;
    	let t0_value = /*category*/ ctx[30] + "";
    	let t0;
    	let t1;
    	let div;
    	let t2;
    	let each_value_1 = /*movies*/ ctx[6];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			attr_dev(h1, "class", "categoryName svelte-1ajz32b");
    			add_location(h1, file, 101, 3, 4990);
    			attr_dev(div, "class", "movieContainer svelte-1ajz32b");
    			add_location(div, file, 102, 4, 5035);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*movies, loadPlayer*/ 80) {
    				each_value_1 = /*movies*/ ctx[6];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, t2);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(101:2) {#each categories as category}",
    		ctx
    	});

    	return block;
    }

    // (122:1) {#if width < 450}
    function create_if_block(ctx) {
    	let div1;
    	let div0;
    	let button0;
    	let i0;
    	let t1;
    	let button1;
    	let i1;
    	let t3;
    	let button2;
    	let i2;
    	let t5;
    	let button3;
    	let i3;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			i0.textContent = "account_circle";
    			t1 = space();
    			button1 = element("button");
    			i1 = element("i");
    			i1.textContent = "bookmark";
    			t3 = space();
    			button2 = element("button");
    			i2 = element("i");
    			i2.textContent = "remove_red_eye";
    			t5 = space();
    			button3 = element("button");
    			i3 = element("i");
    			i3.textContent = "settings";
    			attr_dev(i0, "class", "material-icons svelte-1ajz32b");
    			add_location(i0, file, 126, 5, 5635);
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "navButtons svelte-1ajz32b");
    			add_location(button0, file, 125, 4, 5482);
    			attr_dev(i1, "class", "material-icons svelte-1ajz32b");
    			add_location(i1, file, 129, 5, 5861);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "navButtons svelte-1ajz32b");
    			add_location(button1, file, 128, 4, 5699);
    			attr_dev(i2, "class", "material-icons svelte-1ajz32b");
    			add_location(i2, file, 135, 5, 6480);
    			attr_dev(button2, "type", "button");
    			attr_dev(button2, "class", "navButtons svelte-1ajz32b");
    			add_location(button2, file, 131, 4, 5919);
    			attr_dev(i3, "class", "material-icons svelte-1ajz32b");
    			add_location(i3, file, 138, 5, 6780);
    			attr_dev(button3, "type", "button");
    			attr_dev(button3, "class", "navButtons svelte-1ajz32b");
    			add_location(button3, file, 137, 4, 6544);
    			attr_dev(div0, "class", "buttonGroup svelte-1ajz32b");
    			add_location(div0, file, 124, 3, 5452);
    			attr_dev(div1, "class", "Footer svelte-1ajz32b");
    			add_location(div1, file, 123, 2, 5428);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, i0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(button1, i1);
    			append_dev(div0, t3);
    			append_dev(div0, button2);
    			append_dev(button2, i2);
    			append_dev(div0, t5);
    			append_dev(div0, button3);
    			append_dev(button3, i3);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(Ripple.call(null, button0)),
    					listen_dev(button0, "click", /*click_handler_5*/ ctx[13], false, false, false),
    					action_destroyer(Ripple.call(null, button1)),
    					listen_dev(button1, "click", /*click_handler_6*/ ctx[14], false, false, false),
    					action_destroyer(Ripple.call(null, button2)),
    					listen_dev(button2, "click", /*click_handler_7*/ ctx[15], false, false, false),
    					action_destroyer(Ripple.call(null, button3)),
    					listen_dev(button3, "click", /*click_handler_8*/ ctx[16], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(122:1) {#if width < 450}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let head;
    	let link;
    	let t0;
    	let main;
    	let div0;
    	let h1;
    	let t2;
    	let t3;
    	let overlay0;
    	let t4;
    	let overlay1;
    	let t5;
    	let div1;
    	let t6;
    	let main_resize_listener;
    	let current;
    	let if_block0 = /*width*/ ctx[0] >= 450 && create_if_block_1(ctx);

    	overlay0 = new Overlay({
    			props: {
    				class: "overlay",
    				active: /*$popUpIsActive*/ ctx[1],
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	overlay1 = new Overlay({
    			props: {
    				class: "overlay",
    				active: /*$playerIsActive*/ ctx[2],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*categories*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let if_block1 = /*width*/ ctx[0] < 450 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			head = element("head");
    			link = element("link");
    			t0 = space();
    			main = element("main");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "ROCKBUSTER";
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			create_component(overlay0.$$.fragment);
    			t4 = space();
    			create_component(overlay1.$$.fragment);
    			t5 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "href", "https://fonts.googleapis.com/icon?family=Material+Icons");
    			add_location(link, file, 62, 1, 3145);
    			add_location(head, file, 61, 0, 3137);
    			attr_dev(h1, "class", "title svelte-1ajz32b");
    			add_location(h1, file, 69, 2, 3301);
    			attr_dev(div0, "class", "Header svelte-1ajz32b");
    			add_location(div0, file, 68, 1, 3278);
    			attr_dev(div1, "class", "categoryContainer svelte-1ajz32b");
    			add_location(div1, file, 99, 1, 4922);
    			attr_dev(main, "class", "svelte-1ajz32b");
    			add_render_callback(() => /*main_elementresize_handler*/ ctx[17].call(main));
    			add_location(main, file, 67, 0, 3243);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, head, anchor);
    			append_dev(head, link);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t2);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(main, t3);
    			mount_component(overlay0, main, null);
    			append_dev(main, t4);
    			mount_component(overlay1, main, null);
    			append_dev(main, t5);
    			append_dev(main, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(main, t6);
    			if (if_block1) if_block1.m(main, null);
    			main_resize_listener = add_resize_listener(main, /*main_elementresize_handler*/ ctx[17].bind(main));
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*width*/ ctx[0] >= 450) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			const overlay0_changes = {};
    			if (dirty[0] & /*$popUpIsActive*/ 2) overlay0_changes.active = /*$popUpIsActive*/ ctx[1];

    			if (dirty[1] & /*$$scope*/ 16) {
    				overlay0_changes.$$scope = { dirty, ctx };
    			}

    			overlay0.$set(overlay0_changes);
    			const overlay1_changes = {};
    			if (dirty[0] & /*$playerIsActive*/ 4) overlay1_changes.active = /*$playerIsActive*/ ctx[2];

    			if (dirty[1] & /*$$scope*/ 16) {
    				overlay1_changes.$$scope = { dirty, ctx };
    			}

    			overlay1.$set(overlay1_changes);

    			if (dirty[0] & /*movies, loadPlayer, categories*/ 88) {
    				each_value = /*categories*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*width*/ ctx[0] < 450) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(main, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overlay0.$$.fragment, local);
    			transition_in(overlay1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overlay0.$$.fragment, local);
    			transition_out(overlay1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(head);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			destroy_component(overlay0);
    			destroy_component(overlay1);
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			main_resize_listener();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $popUpIsActive;
    	let $popUpDescription;
    	let $popUpTitle;
    	let $playerIsActive;
    	let $TITLE;
    	let $POSTER;
    	let $SRC;
    	validate_store(popUpIsActive, 'popUpIsActive');
    	component_subscribe($$self, popUpIsActive, $$value => $$invalidate(1, $popUpIsActive = $$value));
    	validate_store(popUpDescription, 'popUpDescription');
    	component_subscribe($$self, popUpDescription, $$value => $$invalidate(18, $popUpDescription = $$value));
    	validate_store(popUpTitle, 'popUpTitle');
    	component_subscribe($$self, popUpTitle, $$value => $$invalidate(19, $popUpTitle = $$value));
    	validate_store(playerIsActive, 'playerIsActive');
    	component_subscribe($$self, playerIsActive, $$value => $$invalidate(2, $playerIsActive = $$value));
    	validate_store(TITLE, 'TITLE');
    	component_subscribe($$self, TITLE, $$value => $$invalidate(20, $TITLE = $$value));
    	validate_store(POSTER, 'POSTER');
    	component_subscribe($$self, POSTER, $$value => $$invalidate(21, $POSTER = $$value));
    	validate_store(SRC, 'SRC');
    	component_subscribe($$self, SRC, $$value => $$invalidate(22, $SRC = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const categories = ["Featured", "Recommended", "All"];
    	const categoryPos = [0, 0, 0];
    	let width;

    	class movie {
    		constructor(SRC, POSTER, ALT, CARD) {
    			this.SRC = SRC;
    			this.POSTER = POSTER;
    			this.ALT = ALT;
    			this.CARD = CARD;
    		}
    	}

    	function loadPlayer(_movieSRC, _moviePOSTER, _movieTITLE) {
    		set_store_value(SRC, $SRC = _movieSRC, $SRC);
    		set_store_value(POSTER, $POSTER = _moviePOSTER, $POSTER);
    		set_store_value(TITLE, $TITLE = _movieTITLE, $TITLE);
    		set_store_value(playerIsActive, $playerIsActive = true, $playerIsActive);
    	}

    	function loadPopUp(_title, _description) {
    		set_store_value(popUpTitle, $popUpTitle = _title, $popUpTitle);
    		set_store_value(popUpDescription, $popUpDescription = _description, $popUpDescription);
    		set_store_value(popUpIsActive, $popUpIsActive = true, $popUpIsActive);
    	}

    	const Popeye = new movie("https://tile.loc.gov/storage-services/service/mbrs/ntscrm/00068306/00068306.mp4", "https://tile.loc.gov/storage-services/service/mbrs/ntscrm/00068306/00068306.jpg", "popeye meets Sindbad", "https://upload.wikimedia.org/wikipedia/commons/4/45/Popeye_Meets_Sinbad.PNG");
    	const ILiveInFear = new movie("https://ia601908.us.archive.org/32/items/i-live-in-fear/I%20LIve%20in%20Fear.mp4", "https://archive.org/download/i-live-in-fear/i-live-in-fear.thumbs/I%20LIve%20in%20Fear_000002.jpg", "I live in fear", "https://m.media-amazon.com/images/M/MV5BY2NjNzdiZWYtNjIyNy00MzUzLTlkZGQtODFlYjM5MDQ3MjcyXkEyXkFqcGdeQXVyMTIyNzY1NzM@._V1_.jpg");
    	const SevenSamurai = new movie("https://ia801905.us.archive.org/10/items/seven-samurai/Seven%20Samurai.ia.mp4", "https://archive.org/download/seven-samurai/seven-samurai.thumbs/Seven%20Samurai_000178.jpg", "Seven Samurai", "https://static.tvtropes.org/pmwiki/pub/images/mpw-3125_9151.jpg");
    	const HouseOnHauntedHill = new movie("https://ia800203.us.archive.org/18/items/house_on_haunted_hill_ipod/house_on_haunted_hill_512kb.mp4", "https://archive.org/download/house_on_haunted_hill_ipod/house_on_haunted_hill_ipod.thumbs/house_on_haunted_hill_000060.jpg", "House on Haunted Hill", "https://upload.wikimedia.org/wikipedia/commons/2/24/House_on_Haunted_Hill.jpg");
    	const NoRegretForOurYouth = new movie("https://ia801909.us.archive.org/0/items/no-regrets-for-our-youth/No%20Regrets%20for%20Our%20Youth.ia.mp4", "https://archive.org/download/no-regrets-for-our-youth/no-regrets-for-our-youth.thumbs/No%20Regrets%20for%20Our%20Youth_001260.jpg", "No Regret for Our Youth", "https://m.media-amazon.com/images/M/MV5BMzI0ZGE2NTItMDRlNC00NTE2LWE0NGItNTYzMzEyNWQxNDQxXkEyXkFqcGdeQXVyMTIyNzY1NzM@._V1_.jpg");
    	const TheMemphisBelle = new movie("https://tile.loc.gov/storage-services/service/mbrs/ntscrm/00009301/00009301.mp4", "https://tile.loc.gov/storage-services/service/mbrs/ntscrm/00009301/00009301.jpg", "The Memphis Belle", "https://upload.wikimedia.org/wikipedia/en/a/a0/MemphisBelleFlyingFortress-poster.jpg");

    	const movies = [
    		Popeye,
    		ILiveInFear,
    		SevenSamurai,
    		HouseOnHauntedHill,
    		NoRegretForOurYouth,
    		TheMemphisBelle
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		loadPopUp("You are not logged in", "You are not going to log in either.");
    	};

    	const click_handler_1 = () => {
    		loadPopUp("Feature not available", "This feature is not available in your region");
    	};

    	const click_handler_2 = () => {
    		loadPopUp("I am living in your walls", `I am living in your walls, I am living in your walls,
			 I am living in your walls, I am living in your walls, I am living in your walls, I am living in your walls, I am living in your walls,
			  I am living in your walls, I am living in your walls, I am living in your walls, I am living in your walls,I am living in your walls,I am living in your walls,
			   I am living in your walls,I am living in your walls,I am living in your walls.`);
    	};

    	const click_handler_3 = () => {
    		loadPopUp("You don't have the right", "O, you don't have the right! You don't have the right. Also, you don't have the right. O, you don't have the right!");
    	};

    	const click_handler_4 = movie => {
    		loadPlayer(movie.SRC, movie.POSTER, movie.ALT);
    	};

    	const click_handler_5 = () => {
    		loadPopUp("You are not logged in", "You are not going to log in either.");
    	};

    	const click_handler_6 = () => {
    		loadPopUp("Feature not available", "This feature is not available in your region");
    	};

    	const click_handler_7 = () => {
    		loadPopUp("I am living in your walls", `I am living in your walls, I am living in your walls,
				I am living in your walls, I am living in your walls, I am living in your walls, I am living in your walls, I am living in your walls,
				I am living in your walls, I am living in your walls, I am living in your walls, I am living in your walls,I am living in your walls,I am living in your walls,
				I am living in your walls,I am living in your walls,I am living in your walls.`);
    	};

    	const click_handler_8 = () => {
    		loadPopUp("You don't have the right", "O, you don't have the right! You don't have the right. Also, you don't have the right. O, you don't have the right!");
    	};

    	function main_elementresize_handler() {
    		width = this.clientWidth;
    		$$invalidate(0, width);
    	}

    	$$self.$capture_state = () => ({
    		VideoPlayer,
    		PopUp,
    		Overlay,
    		Ripple,
    		SRC,
    		POSTER,
    		TITLE,
    		playerIsActive,
    		popUpIsActive,
    		popUpDescription,
    		popUpTitle,
    		categories,
    		categoryPos,
    		width,
    		movie,
    		loadPlayer,
    		loadPopUp,
    		Popeye,
    		ILiveInFear,
    		SevenSamurai,
    		HouseOnHauntedHill,
    		NoRegretForOurYouth,
    		TheMemphisBelle,
    		movies,
    		$popUpIsActive,
    		$popUpDescription,
    		$popUpTitle,
    		$playerIsActive,
    		$TITLE,
    		$POSTER,
    		$SRC
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		width,
    		$popUpIsActive,
    		$playerIsActive,
    		categories,
    		loadPlayer,
    		loadPopUp,
    		movies,
    		movie,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		main_elementresize_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
