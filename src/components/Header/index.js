import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Cell from "../Cell";
import { limitCol } from "../../constants";

const Header = ({ columns, startColIdx }) => {
  const memoizedColumns = useMemo(() => {
    const extend = limitCol / 2;
    const start = Math.max(0, Math.ceil(startColIdx - extend));
    const end = Math.min(
      Math.ceil(startColIdx + limitCol + extend),
      columns.length
    );
    return columns
      .slice(start, end)
      .map((el, idx) => (
        <Cell key={el.key} {...el} left={(start + idx + 1) * 100} header />
      ));
  }, [columns, startColIdx]);

  return (
    <div className="header-row">
      <Cell className="cell-first-row" header />
      {memoizedColumns}
    </div>
  );
};

Header.propTypes = {
  columns: PropTypes.array,
  startColIdx: PropTypes.number,
};

export default React.memo(Header);
