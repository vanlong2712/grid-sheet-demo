import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useScroll } from "react-use";
import {
  cellWidth,
  columnNumber,
  defaultSelection,
  limitCol,
  limitRow,
  rowHeight,
} from "../../constants";
import { formatSelection, loadColumns, loadRows } from "../../utilities/common";
import GridContext from "../context/gridContext";
import Header from "../Header";
import Row from "../Row";
import AddMoreCounter from "../AddMoreCounter";
import "./styles.scss";
import { useDocumentEventListener } from "../../utilities/useDocumentEventListener";

const Grid = () => {
  const [columns, setColumns] = useState(loadColumns());
  const [rows, setRows] = useState(loadRows());
  const [startColIdx, setStartColIdx] = useState(limitCol);
  const [startRowIdx, setStartRowIdx] = useState(limitRow);
  const [selection, setSelection] = useState({ ...defaultSelection });
  const colKeyObj = useRef(undefined);
  const isMouseDown = useRef(false);
  const gridRef = useRef(undefined);
  const { x: gridX, y: gridY } = useScroll(gridRef);

  const onCopy = useCallback(
    (e) => {
      e.preventDefault();
      if (selection.startRow === -1) return;
      const copyData = [];
      const { startRow, endRow, startCol, endCol } = formatSelection(selection);
      for (let rowIdx = startRow; rowIdx <= endRow; rowIdx++) {
        copyData.push([]);
        for (let colIdx = startCol; colIdx <= endCol; colIdx++) {
          copyData[rowIdx - startRow].push(
            rows[rowIdx][colKeyObj.current[colIdx]]
          );
        }
      }
      e.clipboardData?.setData(
        "text/plain",
        copyData.map((row) => row.join("\t")).join("\n")
      );
    },
    [selection, rows]
  );

  const onPaste = useCallback(
    (e) => {
      e.preventDefault();
      if (selection.startRow === -1) return;
      const pasteData =
        e.clipboardData
          ?.getData("text")
          .replace(/\r/g, "")
          .split("\n")
          .map((row) => row.split("\t")) || [];
      if (!pasteData.length) return;
      const { startRow, startCol } = formatSelection(selection);
      const newRows = [...rows];
      pasteData.map((pasteRowData, pasteRowIdx) => {
        pasteRowData.map((colData, colIdx) => {
          newRows[startRow + pasteRowIdx][
            colKeyObj.current[startCol + colIdx]
          ] = colData;
        });
      });
      setRows([...newRows]);
    },
    [selection, rows]
  );

  const onDelete = useCallback(() => {
    if (selection.startRow === -1) return;
    const newRows = [...rows];
    const { startRow, endRow, startCol, endCol } = formatSelection(selection);
    for (let rowIdx = startRow; rowIdx <= endRow; rowIdx++) {
      for (let colIdx = startCol; colIdx <= endCol; colIdx++) {
        newRows[rowIdx][colKeyObj.current[colIdx]] = "";
      }
    }
    setRows([...newRows]);
  }, [selection, rows]);

  const onCut = useCallback(
    (e) => {
      e.preventDefault();
      onCopy(e);
      onDelete();
    },
    [onCopy, onDelete]
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "Backspace") {
        onDelete();
      } else if (e.key === "Tab" && selection.startRow > -1) {
        setSelection({
          ...selection,
          startCol: selection.startCol + 1,
          endCol: selection.startCol + 1,
        });
      }
    },
    [selection, onDelete]
  );

  const handleMouseDown = useCallback((e) => {
    isMouseDown.current = true;
  }, []);

  const handleMouseUp = useCallback((e) => {
    isMouseDown.current = false;
  }, []);

  const handleDocumentMove = useCallback(
    (e) => {
      if (!isMouseDown.current || !gridRef.current) return;
      if (e.clientX >= gridRef.current.clientWidth - cellWidth / 2) {
        gridRef.current.scrollLeft = gridRef.current.scrollLeft + cellWidth;
      } else if (gridRef.current.scrollLeft > 0 && e.clientX <= cellWidth / 2) {
        gridRef.current.scrollLeft = gridRef.current.scrollLeft - cellWidth;
      }
      if (e.clientY >= gridRef.current.clientHeight - rowHeight / 2) {
        gridRef.current.scrollTop = gridRef.current.scrollTop + rowHeight;
      } else if (gridRef.current.scrollTop > 0 && e.clientY <= rowHeight / 2) {
        gridRef.current.scrollTop = gridRef.current.scrollTop - rowHeight;
      }
    },
    [gridRef]
  );

  useDocumentEventListener("copy", onCopy);
  useDocumentEventListener("paste", onPaste);
  useDocumentEventListener("cut", onCut);
  useDocumentEventListener("keydown", onKeyDown);
  useDocumentEventListener("mousedown", handleMouseDown);
  useDocumentEventListener("mouseup", handleMouseUp);
  useDocumentEventListener("mousemove", handleDocumentMove);

  useEffect(() => {
    colKeyObj.current = columns.reduce((acc, cur, curIdx) => {
      acc[curIdx] = cur.key;
      return acc;
    }, {});
  }, [columns]);

  useEffect(() => {
    setStartColIdx(Math.floor(gridX / cellWidth));
  }, [gridX]);

  useEffect(() => {
    setStartRowIdx(Math.floor(gridY / rowHeight));
  }, [gridY]);

  const styleActiveCell = useMemo(() => {
    const { startRow, endRow, startCol, endCol } = formatSelection(selection);
    return {
      width: (endCol + 1 - startCol) * cellWidth,
      height: (endRow + 1 - startRow) * rowHeight,
      top: (startRow + 1) * rowHeight + 1,
      left: (startCol + 1) * cellWidth,
    };
  }, [selection]);

  const onChangeSelection = useCallback(
    (newSelection) => {
      setSelection(newSelection);
    },
    [setSelection]
  );

  const addRows = useCallback(
    (number) => {
      if (!number) return;
      const newRows = loadRows(number, rows.length);
      setRows([...rows, ...newRows]);
    },
    [rows]
  );

  const onChangeCell = useCallback((rowIdx, colIdx, value) => {
    setRows((prev) => {
      prev[rowIdx][colKeyObj.current[colIdx]] = value;
      return [...prev];
    });
  }, []);

  const width = columnNumber * cellWidth;
  const height = rows.length * rowHeight;

  return (
    <>
      <GridContext.Provider
        value={{ selection, onChangeSelection, isMouseDown, onChangeCell }}
      >
        <div id="grid-wrapper" className="grid-wrapper" ref={gridRef}>
          <div className="grid-container" style={{ width, height }}>
            <Header columns={columns} startColIdx={startColIdx} />
            {rows.map(
              (row, idx) =>
                idx >= startRowIdx - limitRow &&
                idx <= startRowIdx + limitRow && (
                  <Row
                    key={row.id}
                    row={row}
                    index={idx}
                    columns={columns}
                    startColIdx={startColIdx}
                  />
                )
            )}
            {selection.startRow > -1 && selection.startCol > -1 && (
              <div className="active-cell" style={styleActiveCell} />
            )}
          </div>
        </div>
      </GridContext.Provider>
      <AddMoreCounter addRows={addRows} />
    </>
  );
};

export default Grid;