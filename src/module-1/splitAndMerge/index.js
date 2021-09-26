export const splitAndMerge = (str = "", separator = "") => {
  let newStr = str.split(' ')
    .map(word => word.split('').join(separator))
    .join(' ');
  return newStr;
};