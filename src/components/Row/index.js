import React from "react";
import PropTypes from "prop-types";
import Cell from "../Cell";
import { limitCol } from "../../constants";

const Row = ({ row, index, columns, startColIdx }) => {
  const top = (index + 1) * 40;
  return (
    <div className="row" style={{ top: `${top}px` }}>
      <Cell className="cell-first-row" title={String(index + 1)} />
      {columns.map(
        (col, idx) =>
          idx >= startColIdx - 10 &&
          idx <= startColIdx + limitCol && (
            <Cell
              key={col.key}
              title={row[col.key]}
              top={top}
              left={(idx + 1) * 100}
              rowIdx={index}
              colIdx={idx}
            />
          )
      )}
    </div>
  );
};

Row.propTypes = {
  index: PropTypes.number,
  row: PropTypes.object,
  columns: PropTypes.array,
  startColIdx: PropTypes.number,
};

export default Row;
