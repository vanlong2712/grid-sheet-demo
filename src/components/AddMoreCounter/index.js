import React, { useState } from "react";
import PropTypes from "prop-types";

const AddMoreCounter = ({ addRows }) => {
  const [value, setValue] = useState(1);
  return (
    <div className="add-row-wrapper">
      <input
        type="number"
        value={value}
        onChange={(e) => {
          setValue(e.target.value ? Math.round(parseInt(e.target.value)) : "");
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            addRows(value);
          }
        }}
      />
      <button onClick={() => addRows(value)}>Add Rows</button>
    </div>
  );
};

AddMoreCounter.defaultProps = {
  addRows: (f) => f,
};

AddMoreCounter.propTypes = {
  addRows: PropTypes.func,
};

export default AddMoreCounter;
