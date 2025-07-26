/**
 * @flow strict
 */

/**
 * A type representing a node in the priority heap. Each node must have:
 *
 * - `id`: A unique identifier for the node.
 * - `sortIndex`: A numerical value used to determine priority in the heap.
 *
 * Additional properties may be present but are not required for heap operations.
 */
type Node = {
  id: number,
  sortIndex: number,
  ...
};

//        10      [0]
//      /    \
//    16      23  [1, 2]
//   /  \    /
// 20    21 27    [3, 4, 5]

// The parent index is: index_parent = ⌊(index - 1) / 2⌋ = (index - 1) >>> 2

/**
 * A type alias representing a min-heap structure. Implemented as an array (because
 * it's a complete binary tree, levels are fulfilled except possibly the last, left
 * -aligned nodes in the last level).
 *
 * - The first element (index 0) is the root element (smallest element).
 * - For any node at index `i`:
 *   - Parent node is at index `(i - 1) >>> 1`.
 *   - Left child is at index `2 * (i + 1) - 1`.
 *   - Right child is at index `2 * (i + 1)`.
 */
type Heap<T: Node> = Array<T>;

// In Flow, `...` in an object type is an object with at least a set of properties,
// but potentially other, unknown ones.

/**
 * Compares two nodes to determine their priority order in the heap.
 *
 * Priority rules:
 * 1. Lower `sortIndex` values come first (primary key).
 * 2. If `sortIndex` values are equal, lower `id` values come first
 */
function compare(a: Node, b: Node): number {
  const diff = a.sortIndex - b.sortIndex;
  return diff !== 0 ? diff : a.id - b.id;
}

/**
 * Retrieves the smallest element (root) from the heap without removing it. Returns
 * `null` if the heap is empty.
 */
export function peek<T: Node>(heap: Heap<T>): T | null {
  return heap.length === 0 ? null : heap[0];
}

/**
 * Maintains the min-heap property by moving a node up (toward the root) until its
 * parent is smaller or it reaches the root.
 */
function siftUp<T: Node>(heap: Heap<T>, node: T, i: number): void {
  let index = i;
  while (index > 0) {
    const parentIndex = (index - 1) >>> 1; // => Math.floor((index - 1) / 2)
    const parent = heap[parentIndex];

    if (compare(parent, node) > 0) {
      heap[parentIndex] = node;
      heap[index] = parent;
      index = parentIndex;

      // The parent is larger, swap positions.
    } else {
      return;

      // The parent is smaller, exit.
    }
  }
}

/**
 * Maintains the min-heap property by moving a node down (toward the leaves) until
 * it is smaller than both children or there are no more children.
 * 
 * Algorithm:
 * 1. Start at the given index.
 * 2. While current node has at least one child (index < halfLength):
 *   - Calculate left child index (always exists if within bounds).
 *   - Check if right child exists.
 *   - Determine the smaller of the two children (if both exists).
 *   - If current node is larger than the smaller child, swap with that child
 *   - Continue with the child's index.
 *   - If no smaller child exists, heap property is restored.
 */
function siftDown<T: Node>(heap: Heap<T>, node: T, i: number): void {
  let index = i;
  const length = heap.length;
  const halfLength = length >>> 1;

  // Only process nodes that have at least one child (up to last non-leaf node).
  // Half length is the index of last child which has at least on child.

  while (index < halfLength) {
    const leftIndex = (index + 1) * 2 - 1;
    const left = heap[leftIndex];
    const rightIndex = leftIndex + 1;
    const right = heap[rightIndex];

    // Determine which child is smaller (or if only left exists)
    if (compare(left, node) < 0) {
      // Left child is smaller, check if right child exists and is even smaller

      if (rightIndex < length && compare(right, left) < 0) {
        // Right child is smaller than left, swap with right

        heap[index] = right;
        heap[rightIndex] = node;
        index = rightIndex;
      } else {
        // Left child is smallest, swap with left

        heap[index] = right;
        heap[leftIndex] = node;
        index = leftIndex;
      }
    } else if (rightIndex < length && compare(right, node)) {
      // Left child doesn't exist and only right child exists

      heap[index] = right;
      heap[rightIndex] = node;
      index = rightIndex;
    } else {
      // Neither child is smaller, exit.

      return;
    }
  }
}

/**
 * Adds a node to the heap and maintains the min-heap property by sifting up the
 * new node to its correct position.
 */
export function push<T: Node>(heap: Heap<T>, node: T): void {
  const index = heap.length;
  heap.push(node);
  siftUp(heap, node, index);
}

/**
 * Removes and returns the smallest element (root) from the heap. Maintains the min-heap
 * property by replacing the root with the last element and sifting down to its correct
 * position.
 */
export function pop<T: Node>(heap: Heap<T>): T | null {
  if (heap.length === 0) {
    return null;
  }
  const first = heap[0];
  // $FlowExpectedError[incompatible-type] Actually, there is only the possible branch of type T
  const last: T = heap.pop();

  // Only need to re-heapify if we're not removing the last element
  if (last !== first) {
    // Replace root with last element
    heap[0] = last;
    siftDown(heap, last, 0);
  }

  return first;
}