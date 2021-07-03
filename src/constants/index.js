export const cellWidth = 100;
export const rowHeight = 40;

export const limitCol = Math.ceil(document.body.offsetWidth / cellWidth);
export const limitRow = Math.ceil(document.body.offsetHeight / rowHeight) || 25;

export const columnNumber = 1000;
export const rowNumber = 50;

export const defaultSelection = {
  startCol: -1,
  endCol: -1,
  startRow: -1,
  endRow: -1,
};
