/**
 * @flow strict
 */

type Node = {
  id: number;
  sortIndex: number;
  ...
}

// In Flow, `...` in an object type is an object with at least a set of properties,
// but potentially other, unknown ones.