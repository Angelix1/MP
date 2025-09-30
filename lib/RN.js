/* ---------- runtime helpers ---------- */

export function isIterable(arg) {
    return arg != null && typeof arg[Symbol.iterator] === "function";
}

export function isNonNullObject(arg) {
    return arg !== null && typeof arg === "object";
}

export function isElement(arg) {
    return isNonNullObject(arg) && "type" in arg;
}

export function isElementWithChildren(arg) {
    return "children" in arg.props;
}

export function isProviderType(arg) {
    return "_context" in arg;
}

export function isForwardRefType(arg) {
    return "render" in arg;
}

export function isMemoType(arg) {
    return "type" in arg;
}

/* ---------- get a readable name for any React component ---------- */
export function getComponentNameFromType(type) {
    if (typeof type === "symbol")
        return Symbol.keyFor(type) || null;
    if (typeof type === "function")
        return type.displayName || type.name || null;
    if (isProviderType(type))
        return type._context.displayName || null;
    if (type.displayName)
        return type.displayName;
    if (isForwardRefType(type))
        return type.render.displayName || type.render.name || null;
    if (isMemoType(type))
        return getComponentNameFromType(type.type);
    return null;
}

/* ---------- search tree for an ELEMENT that matches ---------- */
export function findElementInTree(tree, filter, maxDepth = 200) {
    if (isNonNullObject(tree)) {
        if (isIterable(tree)) {
            if (maxDepth > 0) {
                for (const node of tree) {
                    const found = findElementInTree(node, filter, maxDepth - 1);
                    if (found) return found;
                }
            }
        } else {
            if (filter(tree)) return tree;
            if (isElementWithChildren(tree))
                return findElementInTree(tree.props.children, filter, maxDepth - 1);
        }
    }
    return null;
}

/* ---------- search tree for a PARENT whose children match ---------- */
export function findParentInTree(tree, filter, maxDepth = 200) {
    if (isNonNullObject(tree)) {
        if (isIterable(tree)) {
            if (maxDepth > 0) {
                for (const node of tree) {
                    const found = findParentInTree(node, filter, maxDepth - 1);
                    if (found) return found;
                }
            }
        } else if (isElementWithChildren(tree)) {
            if (filter(tree.props.children)) return tree;
            return findParentInTree(tree.props.children, filter, maxDepth - 1);
        }
    }
    return null;
}