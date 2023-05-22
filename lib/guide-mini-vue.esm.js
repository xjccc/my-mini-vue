var extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val === 'object';
};
var hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };
var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
var camelize = function (str) {
    return str.replace(/-(\w)/g, function (_, c) {
        return c ? c.toUpperCase() : '';
    });
};
var toHandlerKey = function (str) {
    return str ? 'on' + capitalize(str) : '';
};

//
var targetMap = new Map();
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}

var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key) {
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        var res = Reflect.get(target, key);
        if (shallow) {
            return res;
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        var res = Reflect.set(target, key, value);
        trigger(target, key);
        return res;
    };
}
var mutableHandlers = {
    get: get,
    set: set
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key, value) {
        console.warn("target: ".concat(target, ", key: ").concat(key, ", value: ").concat(value, " is readonly"));
        return true;
    }
};
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
});

function reactive(raw) {
    return createActiveObject(raw, mutableHandlers);
}
function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers);
}
function createActiveObject(raw, baseHandlers) {
    if (!isObject(raw)) {
        console.warn("target ".concat(raw, " \u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61"));
    }
    return new Proxy(raw, baseHandlers);
}

function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    console.log('emit function', event);
    // instance.props -> emit event
    var props = instance.props;
    // TPP ?
    // 先去写一个特定行为 -> 重构成通用行为
    // 传入add -> Add
    // add-foo -> addFoo
    var handlerName = toHandlerKey(camelize(event));
    var handler = props[handlerName];
    handler && handler.apply(void 0, args);
}

function initProps(instance, rawProps) {
    instance.props = rawProps || {};
    // attrs
}

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
    $slots: function (i) { return i.slots; }
};
var PublicInstanceProxyHandler = {
    // ctx
    get: function (_a, key) {
        var instance = _a._;
        // setupState
        var setupState = instance.setupState, props = instance.props;
        if (key in setupState) {
            return setupState[key];
        }
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function initSlots(instance, children) {
    // slots
    var vnode = instance.vnode;
    console.log(vnode, vnode.shapeFlag, 16 /* ShapeFlags.SLOT_CHILDREN */, 222, (vnode.shapFlag & 16 /* ShapeFlags.SLOT_CHILDREN */));
    // 添加slots判断 崩了？
    if (vnode.shapFlag & 16 /* ShapeFlags.SLOT_CHILDREN */) {
        nomalizeObjectSlots(children, instance.slots);
    }
}
function nomalizeObjectSlots(children, slots) {
    var _loop_1 = function (key) {
        var value = children[key];
        // slot
        slots[key] = function (props) { return nomalizeSlotValue(value(props)); };
    };
    for (var key in children) {
        _loop_1(key);
    }
}
function nomalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        emit: function (event) { }
    };
    component.emit = emit.bind(null, component);
    return component;
}
function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    var Component = instance.type;
    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandler);
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    // function Object
    // TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) ;
    instance.render = Component.render;
}

function render(vnode, container) {
    // 调用patch方法
    patch(vnode, container);
}
function patch(vnode, container) {
    // 处理组件
    // 判断是不是element类型
    // 是element应该处理element
    // 如何区分是element、还是component？
    // ShapeFlags
    // vnode -> flag
    var shapeFlag = vnode.shapeFlag;
    if (shapeFlag & 1 /* ShapeFlags.ELEMENT */) {
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        // 组件就应该处理组件类型
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    // 初始化
    mountElement(vnode, container);
    // 更新
}
function mountElement(vnode, container) {
    var el = (vnode.el = document.createElement(vnode.type));
    // string \ array 类型的vnode.children
    var children = vnode.children, shapeFlag = vnode.shapeFlag;
    if (shapeFlag & 4 /* ShapeFlags.TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ShapeFlags.ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    // props -> attribute
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
        // 具体click逻辑 -> 通用
        // on + event name
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            var event_1 = key.slice(2).toLowerCase();
            el.addEventListener(event_1, val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) { return patch(v, container); });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    var instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
    // 所有element mounted 之后，进行el
    initialVNode.el = subTree.el;
}

function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        shapeFlag: getShapeFlag(type),
        el: null
    };
    // children
    if (typeof children === 'string') {
        vnode.shapeFlag |= 4 /* ShapeFlags.TEXT_CHILDREN */;
    }
    if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ShapeFlags.ARRAY_CHILDREN */;
    }
    // slots children 组件 + children object
    if (vnode.shapeFlag & 2 /* ShapeFlags.STATEFUL_COMPONENT */) {
        console.log(children, vnode, 333);
        if (typeof children === 'object') {
            vnode.shapeFlag |= 16 /* ShapeFlags.SLOT_CHILDREN */;
        }
    }
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === 'string' ? 1 /* ShapeFlags.ELEMENT */ : 2 /* ShapeFlags.STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // 先转换为vnode
            // 所有操作都会基于虚拟节点
            // component -> vnode
            var vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    // 创建虚拟节点
    var slot = slots[name];
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode('div', {}, slot(props));
        }
    }
}

export { createApp, h, renderSlots };
