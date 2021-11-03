export const debounce = (fn, delay = 0) => {
  let isIgnored = true;
  return function (...args) {
    if (!isIgnored) return;
    fn.call(this, ...args);
    isIgnored = false;
    setTimeout(() => isIgnored = true, delay);
  }
}
