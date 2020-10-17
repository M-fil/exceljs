export const capitalize = (string) => {
  if (typeof string !== 'string') {
    return '';
  }

  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
};

export const getEnglishAlphabetArray = () => {
  const ACode = ('A').charCodeAt();
  const ZCode = ('Z').charCodeAt();
  const alphabetLength = ZCode - ACode + 1;

  const codes = Array(alphabetLength)
    .fill(0, 0, alphabetLength)
    .map((_, index) => ACode + index);
  return String.fromCharCode(...codes).split('');
};

export const getEnglishAlphabetLength = () => {
  const ACode = ('A').charCodeAt();
  const ZCode = ('Z').charCodeAt();

  return ZCode - ACode + 1;
};

export const getArrayOfNumber = (arrayLength) => Array
  .from({ length: arrayLength }).map((_, index) => index + 1);

const englishAlphabetArray = getEnglishAlphabetArray();

export const getSymbolPositionInAlphabet = (symbol) => englishAlphabetArray
  .findIndex((letter) => letter === symbol) + 1;

export const getSymbolByPositionInAlphabet = (position) => englishAlphabetArray[position - 1];

export const storage = (key, data = null) => {
  if (!data) {
    return JSON.parse(localStorage.getItem(key));
  }

  return localStorage.setItem(key, JSON.stringify(data));
};
