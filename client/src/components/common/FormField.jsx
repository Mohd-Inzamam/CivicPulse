import React from "react";

const FormField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  type = "text",
  fullWidth = true,
  margin = "normal",
  multiline = false,
  rows = 1,
  placeholder,
  disabled = false,
  required = false,
  autoComplete,
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
      {multiline ? (
        <textarea
          id={fieldId}
          className={`textarea${error ? " error" : ""}`}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={rows}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          style={{ borderRadius: 16 }} // borderRadius: 2 → 2×8 = 16px
          {...props}
        />
      ) : (
        <input
          id={fieldId}
          className={`input${error ? " error" : ""}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          style={{ borderRadius: 16 }} // borderRadius: 2 → 2×8 = 16px
          {...props}
        />
      )}
      {error && <span className="form-error">{error}</span>}
      {!error && helperText && <span className="form-hint">{helperText}</span>}
    </div>
  );
};

export default FormField;
