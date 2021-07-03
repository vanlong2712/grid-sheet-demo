import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import GridContext from "../context/gridContext";
import { defaultSelection } from "../../constants";

const Cell = ({ className, title, header, left, rowIdx, colIdx }) => {
  const cellRef = useRef();

  const { isMouseDown, selection, onChangeSelection, onChangeCell } =
    useContext(GridContext);

  const onFocus = useCallback(() => {
    onChangeSelection({
      startCol: colIdx,
      endCol: colIdx,
      startRow: rowIdx,
      endRow: rowIdx,
    });
  }, [colIdx, rowIdx, onChangeSelection]);

  useEffect(() => {
    if (!header && !className.includes("cell-first-row")) {
      const handleMouseEnter = (e) => {
        if (isMouseDown.current) {
          onChangeSelection({ ...selection, endRow: rowIdx, endCol: colIdx });
        }
      };
      cellRef.current.onmousedown = onFocus;
      cellRef.current.onmouseenter = handleMouseEnter;
    } else {
      cellRef.current.onmousedown = () => {
        onChangeSelection({ ...defaultSelection });
      };
    }
  }, [
    className,
    selection,
    onFocus,
    colIdx,
    rowIdx,
    header,
    isMouseDown,
    onChangeSelection,
  ]);

  return (
    <div
      ref={cellRef}
      className={cn("cell", className, {
        "cell-header": header,
      })}
      style={{ left: `${left}px` }}
    >
      {header || colIdx < 0 ? (
        <span>{title}</span>
      ) : (
        <input
          value={title}
          onChange={(e) => {
            onChangeCell(rowIdx, colIdx, e.target.value);
            onFocus();
          }}
        />
      )}
    </div>
  );
};

Cell.defaultProps = {
  className: "",
  title: "",
  header: false,
  left: 0,
  rowIdx: -1,
  colIdx: -1,
};

Cell.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  header: PropTypes.bool,
  left: PropTypes.number,
  rowIdx: PropTypes.number,
  colIdx: PropTypes.number,
};

export default Cell;
