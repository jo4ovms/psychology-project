import React from "react";
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface FormTextareaProps extends Omit<TextFieldProps, "onChange"> {
  name: string;
  helperText?: string;
  tooltipText?: string;
  minRows?: number;
  maxRows?: number;
  charCount?: boolean;
  maxLength?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FormTextarea: React.FC<FormTextareaProps> = ({
  name,
  helperText,
  tooltipText,
  minRows = 3,
  maxRows = 6,
  charCount = false,
  maxLength,
  value,
  onChange,
  onBlur,
  error,
  InputProps,
  ...rest
}) => {
  const currentLength = value?.length || 0;

  const displayHelperText = error
    ? rest.helperText
    : charCount && maxLength
    ? `${currentLength}/${maxLength} caracteres${
        helperText ? ` - ${helperText}` : ""
      }`
    : charCount
    ? `${currentLength} caracteres${helperText ? ` - ${helperText}` : ""}`
    : helperText;

  return (
    <TextField
      id={name}
      name={name}
      value={value || ""}
      onChange={onChange}
      onBlur={onBlur}
      multiline
      minRows={minRows}
      maxRows={maxRows}
      fullWidth
      margin="normal"
      error={error}
      helperText={displayHelperText}
      inputProps={{
        ...rest.inputProps,
        maxLength: maxLength,
      }}
      InputProps={{
        ...InputProps,
        ...(tooltipText && {
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={tooltipText}>
                <IconButton edge="end" size="small">
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }),
      }}
      {...rest}
    />
  );
};

export default FormTextarea;
