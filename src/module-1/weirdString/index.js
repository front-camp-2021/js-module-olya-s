export const weirdString = (str = "") => {
  let newStr = str.split(' ')
    .map(word => word.slice(0, -1).toUpperCase() + word.slice(-1).toLowerCase())
    .join(' ');
  return newStr;
};
