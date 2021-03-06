import React from "react";
import { FormControl } from "react-bootstrap";

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <FormControl
        {...input}
        placeholder={label}
        componentClass="textarea"
        style={{ height: "100px" }}
        type={type}
      />
      {touched &&
        error && (
          <div>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/1/1c/No-Symbol.png"
              height="12"
              width="12"
            />
            <span>{error}</span>
          </div>
        )}
    </div>
  </div>
);

export default renderField;
