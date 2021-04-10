// eslint-disable-next-line
export const generateArray = (n) => Array.apply(null, Array(n))

export const getNodeIndex = (node) => {
  if (!node) return -1;
  let i = 0;
  let el = node;
  // eslint-disable-next-line
  while ((el = el.previousSibling) != null) {
    i += 1;
  }
  return i;
};
