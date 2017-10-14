const toBinary = (n, size = 8) => {
  if (n < 0) {
    return Array.from({ length: size }, (_, i) => {
      return ((n << i) & (2 ** (size - 1))) === 2 ** (size - 1) ? 1 : 0;
    }).join('');
  }
  return n.toString(2).padStart(size, 0);
};

const toHex = (n, size = 8) => {
  if (n < 0) {
    n = parseInt(toBinary(n, size), 2);
  }
  return n
    .toString(16)
    .padStart(size / (8 / 2), 0)
    .toUpperCase();
};

if (typeof module !== 'undefined') {
  module.exports = { toHex, toBinary };
}
