import React from "react";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  options = [],
  fullWidth = true,
  margin = "normal",
  disabled = false,
  required = false,
  placeholder = "Select an option",
  animationDelay = 0, // kept for API compat, no animation
  ...props
}) => {
  const fieldId = `field-${name}`;
  const marginStyle =
    margin === "normal"
      ? { marginTop: 16, marginBottom: 8 }
      : margin === "dense"
        ? { marginTop: 8, marginBottom: 4 }
        : {};

  return (
    <div
      className="form-group"
      style={{
        width: fullWidth ? "100%" : "auto",
        ...marginStyle,
      }}
    >
      {label && (
        <label className="form-label" htmlFor={fieldId}>
          {label}
          {required && <span style={{ color: "var(--status-open)" }}> *</span>}
        </label>
      )}
      <select
        id={fieldId}
        className={`select${error ? " error" : ""}`}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        style={{ borderRadius: 16 }} // borderRadius: 2 → 2×8 = 16px
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
      {!error && helperText && <span className="form-hint">{helperText}</span>}
    </div>
  );
};

export default SelectField;
