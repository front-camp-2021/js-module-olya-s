export const cutStrings = (arr = []) => {
  if (arr.length) {
    let minLength = arr.reduce((min, current) => {
      return min < current.length ? min : current.length
    }, arr[0].length);
    let newArr = arr.map(elem => elem.slice(0, minLength));
    return newArr;
  }
  return arr;
};
