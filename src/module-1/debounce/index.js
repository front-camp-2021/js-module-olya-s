export const debounce = (fn, delay = 0) => {
  let isIgnored = true;
  return function () {
    if (isIgnored) {
      isIgnored = false;
      setTimeout(() => isIgnored = true, delay);
      return fn.apply(this, arguments);
    }
    else
      return;
  }
}