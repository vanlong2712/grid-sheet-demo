import React from "react";
import PropTypes from "prop-types";
import Cell from "../Cell";
import { limitCol } from "../../constants";

const Header = ({ columns, startColIdx }) => {
  return (
    <div className="header-row">
      <Cell className="cell-first-row" header />
      {columns.map(
        (el, idx) =>
          idx >= startColIdx - limitCol &&
          idx <= startColIdx + limitCol && (
            <Cell key={el.key} {...el} left={(idx + 1) * 100} header />
          )
      )}
    </div>
  );
};

Header.propTypes = {
  columns: PropTypes.array,
  startColIdx: PropTypes.number,
};

export default Header;
