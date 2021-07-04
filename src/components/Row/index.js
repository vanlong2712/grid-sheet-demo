import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Cell from "../Cell";
import { limitCol } from "../../constants";

const Row = ({ row, index, columns, startColIdx }) => {
  const top = (index + 1) * 40;
  const extend = limitCol / 2;
  const start = Math.max(0, Math.ceil(startColIdx - extend));
  const end = Math.min(
    Math.ceil(startColIdx + limitCol + extend),
    columns.length
  );
  const memoizedColumns = useMemo(() => {
    return columns.slice(start, end);
  }, [columns, start, end]);
  return (
    <div className="row" style={{ top: `${top}px` }}>
      <Cell className="cell-first-row" title={String(index + 1)} />
      {memoizedColumns.map((el, idx) => (
        <Cell
          key={el.key}
          title={row[el.key]}
          top={top}
          left={(start + idx + 1) * 100}
          rowIdx={index}
          colIdx={start + idx}
        />
      ))}
    </div>
  );
};

Row.defaultProps = {
  index: 0,
  row: {},
  columns: [],
  startColIdx: 0,
};

Row.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  columns: PropTypes.array,
  startColIdx: PropTypes.number,
};

export default Row;
