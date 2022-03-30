
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35731/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
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
        flushing = false;
        seen_callbacks.clear();
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
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function each(items, fn) {
        let str = '';
        for (let i = 0; i < items.length; i += 1) {
            str += fn(items[i], i);
        }
        return str;
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
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.1' }, detail), true));
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

    class Clock {
        constructor(hour, minute){
            if (hour >= 24 || hour <= 0) {
                throw RangeError("hour value must be >= 0 and < 24")
            } else if (minute >= 60 || minute <= 0) {
                throw RangeError("minute value must be >= 0 and < 60");
            }

            this.hour = hour;
            this.minute = minute;

            this.alarmIsActive = false;
            this.alarmHour = null;
            this.alarmMinute = null;
            this.alarmRinging = false;
            this.revolutions = {hour:0, minute:0};
        }

        tick() {
            this.minute++;
            if (this.minute >= 60) {
                this.correctMinute();
            }
            console.log(`${this.formatNumber(this.hour)}:${this.formatNumber(this.minute)}`);
            if(this.alarmIsActive == true) {
                if (this.alarmHour == this.hour && this.alarmMinute == this.minute) {
                    this.alarmRinging = true;
                }
            }
        }

        correctMinute() {
            this.minute = 0;
            this.hour++;
            this.revolutions.minute++;
            if (this.hour >= 24) {
                this.correctHour();
            }
        }

        correctHour() {
            this.hour = 0; 
            this.revolutions.hour++;
        }

        formatNumber(num) {
            if (num < 10) {
                return `0${num}`;
            } else {
                return num;
            }
        }

        setAlarm(alarmHour, alarmMinute) {
            this.alarmHour = alarmHour;
            this.alarmMinute = alarmMinute;
            this.alarmIsActive = true;
        }
        
        deactivateAlarm() {
            this.alarmIsActive = false;
        }

        activateAlarm() {
            this.alarmIsActive = true; 
        }

        get time() {
            return `${this.formatNumber(this.hour)}:${this.formatNumber(this.minute)}`
        }

        set alarm(alarm) {
            this._alarm = alarm;
            let fields = alarm.split(":");
            this.setAlarm(fields[0], fields[1]);
        }

        get alarm() {
            return this._alarm
        }
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

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function tick_spring(ctx, last_value, current_value, target_value) {
        if (typeof current_value === 'number' || is_date(current_value)) {
            // @ts-ignore
            const delta = target_value - current_value;
            // @ts-ignore
            const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
            const spring = ctx.opts.stiffness * delta;
            const damper = ctx.opts.damping * velocity;
            const acceleration = (spring - damper) * ctx.inv_mass;
            const d = (velocity + acceleration) * ctx.dt;
            if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
                return target_value; // settled
            }
            else {
                ctx.settled = false; // signal loop to keep ticking
                // @ts-ignore
                return is_date(current_value) ?
                    new Date(current_value.getTime() + d) : current_value + d;
            }
        }
        else if (Array.isArray(current_value)) {
            // @ts-ignore
            return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
        }
        else if (typeof current_value === 'object') {
            const next_value = {};
            for (const k in current_value) {
                // @ts-ignore
                next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
            }
            // @ts-ignore
            return next_value;
        }
        else {
            throw new Error(`Cannot spring ${typeof current_value} values`);
        }
    }
    function spring(value, opts = {}) {
        const store = writable(value);
        const { stiffness = 0.15, damping = 0.8, precision = 0.01 } = opts;
        let last_time;
        let task;
        let current_token;
        let last_value = value;
        let target_value = value;
        let inv_mass = 1;
        let inv_mass_recovery_rate = 0;
        let cancel_task = false;
        function set(new_value, opts = {}) {
            target_value = new_value;
            const token = current_token = {};
            if (value == null || opts.hard || (spring.stiffness >= 1 && spring.damping >= 1)) {
                cancel_task = true; // cancel any running animation
                last_time = now();
                last_value = new_value;
                store.set(value = target_value);
                return Promise.resolve();
            }
            else if (opts.soft) {
                const rate = opts.soft === true ? .5 : +opts.soft;
                inv_mass_recovery_rate = 1 / (rate * 60);
                inv_mass = 0; // infinite mass, unaffected by spring forces
            }
            if (!task) {
                last_time = now();
                cancel_task = false;
                task = loop(now => {
                    if (cancel_task) {
                        cancel_task = false;
                        task = null;
                        return false;
                    }
                    inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
                    const ctx = {
                        inv_mass,
                        opts: spring,
                        settled: true,
                        dt: (now - last_time) * 60 / 1000
                    };
                    const next_value = tick_spring(ctx, last_value, value, target_value);
                    last_time = now;
                    last_value = value;
                    store.set(value = next_value);
                    if (ctx.settled) {
                        task = null;
                    }
                    return !ctx.settled;
                });
            }
            return new Promise(fulfil => {
                task.promise.then(() => {
                    if (token === current_token)
                        fulfil();
                });
            });
        }
        const spring = {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe,
            stiffness,
            damping,
            precision
        };
        return spring;
    }

    /* src\App.svelte generated by Svelte v3.44.1 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (72:2) {#if mainClock.alarmRinging}
    function create_if_block(ctx) {
    	let p;
    	let t1;
    	let audio;
    	let source;
    	let source_src_value;
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Dwayne makes me ROCK solid!";
    			t1 = space();
    			audio = element("audio");
    			source = element("source");
    			t2 = text("\n\t\t\t\t\tYour browser sucks!");
    			attr_dev(p, "class", "black svelte-blqp0y");
    			add_location(p, file, 72, 3, 2669);
    			if (!src_url_equal(source.src, source_src_value = "Vine-boom-sound-effect.mp3")) attr_dev(source, "src", source_src_value);
    			attr_dev(source, "type", "audio/mpeg");
    			add_location(source, file, 77, 4, 2753);
    			audio.autoplay = true;
    			add_location(audio, file, 76, 3, 2732);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, audio, anchor);
    			append_dev(audio, source);
    			append_dev(audio, t2);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(audio);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(72:2) {#if mainClock.alarmRinging}",
    		ctx
    	});

    	return block;
    }

    // (105:4) {#each [0,5,10,15,20,25,30,35,40,45,50,55] as minutes}
    function create_each_block_4(ctx) {
    	let line;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "mark svelte-blqp0y");
    			attr_dev(line, "y1", "65");
    			attr_dev(line, "y2", "70");
    			attr_dev(line, "transform", "rotate(" + 30 * /*minutes*/ ctx[18] + ")");
    			add_location(line, file, 105, 5, 3417);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(105:4) {#each [0,5,10,15,20,25,30,35,40,45,50,55] as minutes}",
    		ctx
    	});

    	return block;
    }

    // (131:5) {#each [0,5,10,15,20,25,30,35,40,45,50,55] as minutes}
    function create_each_block_3(ctx) {
    	let line;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "mark svelte-blqp0y");
    			attr_dev(line, "y1", "75");
    			attr_dev(line, "y2", "80");
    			attr_dev(line, "transform", "rotate(" + 30 * /*minutes*/ ctx[18] + ")");
    			add_location(line, file, 131, 6, 4039);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(131:5) {#each [0,5,10,15,20,25,30,35,40,45,50,55] as minutes}",
    		ctx
    	});

    	return block;
    }

    // (141:5) {#each aMins as minutes}
    function create_each_block_2(ctx) {
    	let line;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "markAlt svelte-blqp0y");
    			attr_dev(line, "y1", "70");
    			attr_dev(line, "y2", "75");
    			attr_dev(line, "transform", "rotate(" + 6 * /*minutes*/ ctx[18] + ")");
    			add_location(line, file, 141, 5, 4243);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(141:5) {#each aMins as minutes}",
    		ctx
    	});

    	return block;
    }

    // (173:5) {#each [1,2,3,4] as num}
    function create_each_block_1(ctx) {
    	let line;

    	const block = {
    		c: function create() {
    			line = svg_element("line");
    			attr_dev(line, "class", "mark svelte-blqp0y");
    			attr_dev(line, "y1", "65");
    			attr_dev(line, "y2", "67");
    			attr_dev(line, "transform", "rotate(" + 6 * (/*num*/ ctx[4] + /*minutes*/ ctx[18]) + ")");
    			add_location(line, file, 173, 6, 5204);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(173:5) {#each [1,2,3,4] as num}",
    		ctx
    	});

    	return block;
    }

    // (166:3) {#each [0,5,10,15,20,25,30,35,40,45,50,55] as minutes}
    function create_each_block(ctx) {
    	let line;
    	let each_1_anchor;
    	let each_value_1 = [1, 2, 3, 4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < 4; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			line = svg_element("line");

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			attr_dev(line, "class", "markAlt svelte-blqp0y");
    			attr_dev(line, "y1", "65");
    			attr_dev(line, "y2", "70");
    			attr_dev(line, "transform", "rotate(" + 30 * /*minutes*/ ctx[18] + ")");
    			add_location(line, file, 166, 5, 5069);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, line, anchor);

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(line);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(166:3) {#each [0,5,10,15,20,25,30,35,40,45,50,55] as minutes}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let link;
    	let t0;
    	let main;
    	let img;
    	let img_src_value;
    	let t1;
    	let div0;
    	let h1;
    	let t3;
    	let h2;
    	let t4;
    	let t5_value = /*mainClock*/ ctx[1].time + "";
    	let t5;
    	let t6;
    	let button0;
    	let t8;
    	let button1;
    	let t10;
    	let input;
    	let t11;
    	let t12;
    	let div1;
    	let p0;
    	let t13_value = /*mainClock*/ ctx[1].time + "";
    	let t13;
    	let t14;
    	let div2;
    	let p1;
    	let t16;
    	let div6;
    	let div3;
    	let t18;
    	let button2;
    	let t20;
    	let p2;
    	let t22;
    	let div4;
    	let svg0;
    	let circle0;
    	let g0;
    	let line0;
    	let g0_transform_value;
    	let g1;
    	let line1;
    	let g1_transform_value;
    	let t23;
    	let svg1;
    	let circle1;
    	let g2;
    	let g2_transform_value;
    	let g3;
    	let g3_transform_value;
    	let circle2;
    	let line2;
    	let t24;
    	let svg2;
    	let rect0;
    	let rect0_height_value;
    	let rect0_width_value;
    	let rect1;
    	let t25;
    	let p3;
    	let t27;
    	let div5;
    	let svg3;
    	let image;
    	let g4;
    	let line3;
    	let g4_transform_value;
    	let g5;
    	let line4;
    	let g5_transform_value;
    	let circle3;
    	let mounted;
    	let dispose;
    	let if_block = /*mainClock*/ ctx[1].alarmRinging && create_if_block(ctx);
    	let each_value_4 = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    	validate_each_argument(each_value_4);
    	let each_blocks_3 = [];

    	for (let i = 0; i < 12; i += 1) {
    		each_blocks_3[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	let each_value_3 = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    	validate_each_argument(each_value_3);
    	let each_blocks_2 = [];

    	for (let i = 0; i < 12; i += 1) {
    		each_blocks_2[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	let each_value_2 = /*aMins*/ ctx[6];
    	validate_each_argument(each_value_2);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_1[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 12; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			main = element("main");
    			img = element("img");
    			t1 = space();
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Dwayne";
    			t3 = space();
    			h2 = element("h2");
    			t4 = text("Time spent looking at the rock: ");
    			t5 = text(t5_value);
    			t6 = space();
    			button0 = element("button");
    			button0.textContent = "I love the rock!";
    			t8 = space();
    			button1 = element("button");
    			button1.textContent = "I hate the rock!";
    			t10 = space();
    			input = element("input");
    			t11 = space();
    			if (if_block) if_block.c();
    			t12 = space();
    			div1 = element("div");
    			p0 = element("p");
    			t13 = text(t13_value);
    			t14 = space();
    			div2 = element("div");
    			p1 = element("p");
    			p1.textContent = " ";
    			t16 = space();
    			div6 = element("div");
    			div3 = element("div");
    			div3.textContent = " ";
    			t18 = space();
    			button2 = element("button");
    			button2.textContent = "Reset alarm";
    			t20 = space();
    			p2 = element("p");
    			p2.textContent = "Boring, regular clocks:";
    			t22 = space();
    			div4 = element("div");
    			svg0 = svg_element("svg");
    			circle0 = svg_element("circle");

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks_3[i].c();
    			}

    			g0 = svg_element("g");
    			line0 = svg_element("line");
    			g1 = svg_element("g");
    			line1 = svg_element("line");
    			t23 = space();
    			svg1 = svg_element("svg");
    			circle1 = svg_element("circle");
    			g2 = svg_element("g");

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks_2[i].c();
    			}

    			g3 = svg_element("g");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			circle2 = svg_element("circle");
    			line2 = svg_element("line");
    			t24 = space();
    			svg2 = svg_element("svg");
    			rect0 = svg_element("rect");
    			rect1 = svg_element("rect");
    			t25 = space();
    			p3 = element("p");
    			p3.textContent = "Cool, amazing, Dwayne \"The Clock\" Johnson:";
    			t27 = space();
    			div5 = element("div");
    			svg3 = svg_element("svg");
    			image = svg_element("image");

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks[i].c();
    			}

    			g4 = svg_element("g");
    			line3 = svg_element("line");
    			g5 = svg_element("g");
    			line4 = svg_element("line");
    			circle3 = svg_element("circle");
    			document.title = "THE ROCK - Official unofficial fanpage";
    			attr_dev(link, "rel", "icon");
    			attr_dev(link, "type", "image/png");
    			attr_dev(link, "href", "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/0c19ce27560309.5636716486e19.png");
    			add_location(link, file, 52, 1, 1912);
    			if (!src_url_equal(img.src, img_src_value = /*backImg*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "rock svelte-blqp0y");
    			attr_dev(img, "alt", "The face of god.");
    			add_location(img, file, 57, 1, 2071);
    			attr_dev(h1, "class", "black svelte-blqp0y");
    			add_location(h1, file, 59, 2, 2152);
    			attr_dev(h2, "class", "black svelte-blqp0y");
    			add_location(h2, file, 60, 2, 2184);
    			attr_dev(button0, "class", "button svelte-blqp0y");
    			add_location(button0, file, 62, 2, 2259);
    			attr_dev(button1, "class", "button svelte-blqp0y");
    			add_location(button1, file, 65, 2, 2386);
    			attr_dev(input, "class", "input svelte-blqp0y");
    			attr_dev(input, "placeholder", "XX:XX (alarm)");
    			add_location(input, file, 68, 2, 2553);
    			attr_dev(div0, "class", "box svelte-blqp0y");
    			add_location(div0, file, 58, 1, 2132);
    			attr_dev(p0, "class", "timerText svelte-blqp0y");
    			add_location(p0, file, 84, 2, 2893);
    			attr_dev(div1, "class", "clockBox svelte-blqp0y");
    			add_location(div1, file, 83, 1, 2868);
    			add_location(p1, file, 90, 2, 2975);
    			attr_dev(div2, "class", "spacer svelte-blqp0y");
    			add_location(div2, file, 89, 1, 2952);
    			add_location(div3, file, 98, 2, 3081);
    			attr_dev(button2, "class", "button svelte-blqp0y");
    			add_location(button2, file, 99, 2, 3101);
    			attr_dev(p2, "class", "black svelte-blqp0y");
    			add_location(p2, file, 100, 2, 3198);
    			attr_dev(circle0, "r", "10");
    			attr_dev(circle0, "class", "clockBorder svelte-blqp0y");
    			add_location(circle0, file, 103, 4, 3308);
    			attr_dev(line0, "class", "mark svelte-blqp0y");
    			attr_dev(line0, "y1", "10");
    			attr_dev(line0, "y2", "64");
    			add_location(line0, file, 113, 5, 3584);
    			attr_dev(g0, "transform", g0_transform_value = "rotate(" + (6 * /*mainClock*/ ctx[1].minute - 180) + ")");
    			add_location(g0, file, 112, 4, 3529);
    			attr_dev(line1, "class", "mark svelte-blqp0y");
    			attr_dev(line1, "y1", "10");
    			attr_dev(line1, "y2", "32");
    			add_location(line1, file, 120, 5, 3738);
    			attr_dev(g1, "transform", g1_transform_value = "rotate(" + (0.5 * /*mainClock*/ ctx[1].minute + 30 * /*mainClock*/ ctx[1].hour - 180) + ")");
    			add_location(g1, file, 119, 4, 3655);
    			attr_dev(svg0, "viewBox", "-150 -150 300 300");
    			add_location(svg0, file, 102, 3, 3269);
    			attr_dev(circle1, "r", "80");
    			attr_dev(circle1, "class", "clockBorder svelte-blqp0y");
    			add_location(circle1, file, 128, 4, 3857);
    			attr_dev(g2, "transform", g2_transform_value = "rotate(" + (0.5 * /*$sTime*/ ctx[2].minute + 30 * /*$rTime*/ ctx[3].hour) + ")");
    			add_location(g2, file, 129, 4, 3906);
    			attr_dev(g3, "transform", g3_transform_value = "rotate(" + 6 * /*$rTime*/ ctx[3].minute + ")");
    			add_location(g3, file, 139, 4, 4166);
    			attr_dev(circle2, "r", "70");
    			attr_dev(circle2, "class", "clockBorder svelte-blqp0y");
    			attr_dev(circle2, "id", "blueBorder");
    			add_location(circle2, file, 149, 4, 4372);
    			attr_dev(line2, "class", "mark svelte-blqp0y");
    			attr_dev(line2, "y1", "-64");
    			attr_dev(line2, "y2", "0");
    			add_location(line2, file, 150, 4, 4437);
    			attr_dev(svg1, "viewBox", "-150 -150 300 300");
    			add_location(svg1, file, 127, 3, 3818);
    			attr_dev(rect0, "x", "-50");
    			attr_dev(rect0, "y", "-50");
    			attr_dev(rect0, "height", rect0_height_value = 100 - /*$sTime*/ ctx[2].minute * 1.6);
    			attr_dev(rect0, "width", rect0_width_value = 100 - /*$sTime*/ ctx[2].hour * 4.1);
    			attr_dev(rect0, "class", "clockFill svelte-blqp0y");
    			add_location(rect0, file, 157, 4, 4542);
    			attr_dev(rect1, "x", "-50");
    			attr_dev(rect1, "y", "-50");
    			attr_dev(rect1, "height", "100");
    			attr_dev(rect1, "width", "100");
    			attr_dev(rect1, "class", "clockBorder svelte-blqp0y");
    			add_location(rect1, file, 158, 4, 4657);
    			attr_dev(svg2, "viewBox", "-150 -150 300 300");
    			add_location(svg2, file, 156, 3, 4504);
    			attr_dev(div4, "class", "divrow svelte-blqp0y");
    			add_location(div4, file, 101, 2, 3245);
    			attr_dev(p3, "class", "black svelte-blqp0y");
    			add_location(p3, file, 161, 2, 4745);
    			attr_dev(image, "href", "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/0c19ce27560309.5636716486e19.png");
    			attr_dev(image, "width", "200");
    			attr_dev(image, "height", "100");
    			attr_dev(image, "x", "-100");
    			attr_dev(image, "y", "-50");
    			add_location(image, file, 164, 3, 4857);
    			attr_dev(line3, "class", "mark svelte-blqp0y");
    			attr_dev(line3, "y1", "0");
    			attr_dev(line3, "y2", "64");
    			add_location(line3, file, 181, 5, 5385);
    			attr_dev(g4, "transform", g4_transform_value = "rotate(" + (6 * /*$rTime*/ ctx[3].minute - 180) + ")");
    			add_location(g4, file, 180, 4, 5333);
    			attr_dev(line4, "class", "markAlt svelte-blqp0y");
    			attr_dev(line4, "y1", "32");
    			attr_dev(line4, "y2", "0");
    			add_location(line4, file, 188, 5, 5513);
    			attr_dev(g5, "transform", g5_transform_value = "rotate(" + (0.5 * /*$rTime*/ ctx[3].minute - 180) + ")");
    			add_location(g5, file, 187, 4, 5455);
    			attr_dev(circle3, "r", "1");
    			attr_dev(circle3, "class", "clockFill svelte-blqp0y");
    			attr_dev(circle3, "id", "blue");
    			add_location(circle3, file, 194, 4, 5586);
    			attr_dev(svg3, "viewBox", "-150 -150 300 300");
    			add_location(svg3, file, 163, 3, 4820);
    			add_location(div5, file, 162, 2, 4811);
    			attr_dev(div6, "class", "box svelte-blqp0y");
    			add_location(div6, file, 95, 1, 3005);
    			attr_dev(main, "class", "svelte-blqp0y");
    			add_location(main, file, 55, 0, 2062);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, img);
    			append_dev(main, t1);
    			append_dev(main, div0);
    			append_dev(div0, h1);
    			append_dev(div0, t3);
    			append_dev(div0, h2);
    			append_dev(h2, t4);
    			append_dev(h2, t5);
    			append_dev(div0, t6);
    			append_dev(div0, button0);
    			append_dev(div0, t8);
    			append_dev(div0, button1);
    			append_dev(div0, t10);
    			append_dev(div0, input);
    			set_input_value(input, /*mainClock*/ ctx[1].alarm);
    			append_dev(div0, t11);
    			if (if_block) if_block.m(div0, null);
    			append_dev(main, t12);
    			append_dev(main, div1);
    			append_dev(div1, p0);
    			append_dev(p0, t13);
    			append_dev(main, t14);
    			append_dev(main, div2);
    			append_dev(div2, p1);
    			append_dev(main, t16);
    			append_dev(main, div6);
    			append_dev(div6, div3);
    			append_dev(div6, t18);
    			append_dev(div6, button2);
    			append_dev(div6, t20);
    			append_dev(div6, p2);
    			append_dev(div6, t22);
    			append_dev(div6, div4);
    			append_dev(div4, svg0);
    			append_dev(svg0, circle0);

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks_3[i].m(svg0, null);
    			}

    			append_dev(svg0, g0);
    			append_dev(g0, line0);
    			append_dev(svg0, g1);
    			append_dev(g1, line1);
    			append_dev(div4, t23);
    			append_dev(div4, svg1);
    			append_dev(svg1, circle1);
    			append_dev(svg1, g2);

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks_2[i].m(g2, null);
    			}

    			append_dev(svg1, g3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(g3, null);
    			}

    			append_dev(svg1, circle2);
    			append_dev(svg1, line2);
    			append_dev(div4, t24);
    			append_dev(div4, svg2);
    			append_dev(svg2, rect0);
    			append_dev(svg2, rect1);
    			append_dev(div6, t25);
    			append_dev(div6, p3);
    			append_dev(div6, t27);
    			append_dev(div6, div5);
    			append_dev(div5, svg3);
    			append_dev(svg3, image);

    			for (let i = 0; i < 12; i += 1) {
    				each_blocks[i].m(svg3, null);
    			}

    			append_dev(svg3, g4);
    			append_dev(g4, line3);
    			append_dev(svg3, g5);
    			append_dev(g5, line4);
    			append_dev(svg3, circle3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[11], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[12], false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[13]),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[14], false, false, false),
    					listen_dev(div6, "mouseenter", /*mouseEnter*/ ctx[9], false, false, false),
    					listen_dev(div6, "mouseleave", /*mouseExit*/ ctx[10], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*backImg*/ 1 && !src_url_equal(img.src, img_src_value = /*backImg*/ ctx[0])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*mainClock*/ 2 && t5_value !== (t5_value = /*mainClock*/ ctx[1].time + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*mainClock*/ 2 && input.value !== /*mainClock*/ ctx[1].alarm) {
    				set_input_value(input, /*mainClock*/ ctx[1].alarm);
    			}

    			if (/*mainClock*/ ctx[1].alarmRinging) {
    				if (if_block) ; else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*mainClock*/ 2 && t13_value !== (t13_value = /*mainClock*/ ctx[1].time + "")) set_data_dev(t13, t13_value);

    			if (dirty & /*mainClock*/ 2 && g0_transform_value !== (g0_transform_value = "rotate(" + (6 * /*mainClock*/ ctx[1].minute - 180) + ")")) {
    				attr_dev(g0, "transform", g0_transform_value);
    			}

    			if (dirty & /*mainClock*/ 2 && g1_transform_value !== (g1_transform_value = "rotate(" + (0.5 * /*mainClock*/ ctx[1].minute + 30 * /*mainClock*/ ctx[1].hour - 180) + ")")) {
    				attr_dev(g1, "transform", g1_transform_value);
    			}

    			if (dirty & /*$sTime, $rTime*/ 12 && g2_transform_value !== (g2_transform_value = "rotate(" + (0.5 * /*$sTime*/ ctx[2].minute + 30 * /*$rTime*/ ctx[3].hour) + ")")) {
    				attr_dev(g2, "transform", g2_transform_value);
    			}

    			if (dirty & /*aMins*/ 64) {
    				each_value_2 = /*aMins*/ ctx[6];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_2(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(g3, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_2.length;
    			}

    			if (dirty & /*$rTime*/ 8 && g3_transform_value !== (g3_transform_value = "rotate(" + 6 * /*$rTime*/ ctx[3].minute + ")")) {
    				attr_dev(g3, "transform", g3_transform_value);
    			}

    			if (dirty & /*$sTime*/ 4 && rect0_height_value !== (rect0_height_value = 100 - /*$sTime*/ ctx[2].minute * 1.6)) {
    				attr_dev(rect0, "height", rect0_height_value);
    			}

    			if (dirty & /*$sTime*/ 4 && rect0_width_value !== (rect0_width_value = 100 - /*$sTime*/ ctx[2].hour * 4.1)) {
    				attr_dev(rect0, "width", rect0_width_value);
    			}

    			if (dirty & /*$rTime*/ 8 && g4_transform_value !== (g4_transform_value = "rotate(" + (6 * /*$rTime*/ ctx[3].minute - 180) + ")")) {
    				attr_dev(g4, "transform", g4_transform_value);
    			}

    			if (dirty & /*$rTime*/ 8 && g5_transform_value !== (g5_transform_value = "rotate(" + (0.5 * /*$rTime*/ ctx[3].minute - 180) + ")")) {
    				attr_dev(g5, "transform", g5_transform_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(link);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
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
    	let $sTime;
    	let $rTime;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let timer = 0;

    	let URLs = [
    		"https://quotepark.com/media/authors/dwayne-johnson.jpeg",
    		"https://upload.wikimedia.org/wikipedia/commons/e/e2/Intercontinental_Champion_THE_ROCK.jpg",
    		"https://live.staticflickr.com/3372/3630750300_f1cd14cdc3_b.jpg",
    		"https://upload.wikimedia.org/wikipedia/commons/f/f5/Dwayne_The_Rock_Johnson_street_Tribeca_2009_portrait.jpg",
    		"https://upload.wikimedia.org/wikipedia/commons/1/11/Dwayne_%27The_Rock%27_Johnson_2016.jpg",
    		"https://upload.wikimedia.org/wikipedia/commons/b/ba/The_Rock_Axxess_2002.jpg",
    		"https://bookstr.com/wp-content/uploads/2019/08/BuNjVTEIQAAgcgG.jpg",
    		"https://live.staticflickr.com/7007/6735111477_280bc8a5fc_b.jpg",
    		"https://upload.wikimedia.org/wikipedia/commons/5/59/Dwayne_Johnson_2018.jpg"
    	];

    	let num = 0;
    	let backImg = URLs[num];
    	let mainClock = new Clock();
    	mainClock.minute = 0;
    	mainClock.hour = 0;
    	let rockWatching = false;
    	const aMins = [...Array(61).keys()];

    	let sTime = spring(
    		{
    			minute: mainClock.minute,
    			hour: mainClock.hour
    		},
    		{ stiffness: 0.1, damping: 0.5 }
    	);

    	validate_store(sTime, 'sTime');
    	component_subscribe($$self, sTime, value => $$invalidate(2, $sTime = value));

    	let rTime = spring(
    		{
    			"minute": mainClock.minute + mainClock.revolutions.minute * 60,
    			"hour": mainClock.hour + mainClock.revolutions.hour * 24
    		},
    		{ stiffness: 0.1, damping: 0.5 }
    	);

    	validate_store(rTime, 'rTime');
    	component_subscribe($$self, rTime, value => $$invalidate(3, $rTime = value));
    	const mouseEnter = () => rockWatching = true;
    	const mouseExit = () => rockWatching = false;

    	function tick() {
    		timer++;
    		mainClock.tick();
    		$$invalidate(1, mainClock);

    		sTime.set({
    			"minute": mainClock.minute,
    			"hour": mainClock.hour
    		});

    		rTime.set({
    			"minute": mainClock.minute + mainClock.revolutions.minute * 60,
    			"hour": mainClock.hour + mainClock.revolutions.hour * 60
    		});
    	}

    	setInterval(tick, 1000);
    	timer = timer;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(4, num = (num + 1) % URLs.length);
    		$$invalidate(0, backImg = URLs[num]);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(0, backImg = "https://c.tenor.com/kHcmsxlKHEAAAAAM/rock-one-eyebrow-raised-rock-staring.gif");
    	};

    	function input_input_handler() {
    		mainClock.alarm = this.value;
    		$$invalidate(1, mainClock);
    	}

    	const click_handler_2 = () => {
    		$$invalidate(1, mainClock.alarmRinging = false, mainClock);
    	};

    	$$self.$capture_state = () => ({
    		Clock,
    		spring,
    		each,
    		timer,
    		URLs,
    		num,
    		backImg,
    		mainClock,
    		rockWatching,
    		aMins,
    		sTime,
    		rTime,
    		mouseEnter,
    		mouseExit,
    		tick,
    		$sTime,
    		$rTime
    	});

    	$$self.$inject_state = $$props => {
    		if ('timer' in $$props) timer = $$props.timer;
    		if ('URLs' in $$props) $$invalidate(5, URLs = $$props.URLs);
    		if ('num' in $$props) $$invalidate(4, num = $$props.num);
    		if ('backImg' in $$props) $$invalidate(0, backImg = $$props.backImg);
    		if ('mainClock' in $$props) $$invalidate(1, mainClock = $$props.mainClock);
    		if ('rockWatching' in $$props) rockWatching = $$props.rockWatching;
    		if ('sTime' in $$props) $$invalidate(7, sTime = $$props.sTime);
    		if ('rTime' in $$props) $$invalidate(8, rTime = $$props.rTime);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		backImg,
    		mainClock,
    		$sTime,
    		$rTime,
    		num,
    		URLs,
    		aMins,
    		sTime,
    		rTime,
    		mouseEnter,
    		mouseExit,
    		click_handler,
    		click_handler_1,
    		input_input_handler,
    		click_handler_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

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
    	props: {
    		name: '>:('
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
