/**
 * @flow
 */

export type ReactEmpty = null | void | boolean;

// It represents renderable empty values: These are values that React considers valid for rendering
// but don't produce any actual DOM nodes. In flow, void represents for the type of `undefined`.
// It helps distinguish between "nothing to render" and other renderable types like strings, numbers
// elements etc.