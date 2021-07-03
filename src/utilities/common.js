import { columnNumber, rowNumber } from "../constants";

export const loadColumns = () => {
  return [...Array(columnNumber)].map((_, idx) => ({
    title: `Column ${idx + 1}`,
    key: `column${idx}`,
  }));
};

export const loadRows = (number = rowNumber, startIndex = 0) => {
  return Array(number)
    .fill()
    .map((_, idx) => ({ id: `row${startIndex + idx}` }));
};

export const formatSelection = (selection) => {
  const startRow =
    selection.startRow > selection.endRow
      ? selection.endRow
      : selection.startRow;
  const endRow =
    selection.startRow > selection.endRow
      ? selection.startRow
      : selection.endRow;
  const startCol =
    selection.startCol > selection.endCol
      ? selection.endCol
      : selection.startCol;
  const endCol =
    selection.startCol > selection.endCol
      ? selection.startCol
      : selection.endCol;
  return { startRow, endRow, startCol, endCol };
};
