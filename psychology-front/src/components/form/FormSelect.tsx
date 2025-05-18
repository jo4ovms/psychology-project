import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectProps,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps extends Omit<SelectProps, "onChange"> {
  name: string;
  options: SelectOption[];
  label?: string;
  helperText?: string;
  tooltipText?: string;
  required?: boolean;
  fullWidth?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<{ name?: string; value: unknown }>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  options,
  label,
  helperText,
  tooltipText,
  required = false,
  fullWidth = true,
  value,
  onChange,
  onBlur,
  error,
  ...rest
}) => {
  const id = `select-${name}`;
  const labelId = `${id}-label`;

  return (
    <FormControl
      fullWidth={fullWidth}
      error={error}
      required={required}
      sx={{ my: 1 }}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <Select
        labelId={labelId}
        id={id}
        name={name}
        label={label}
        value={value || ""}
        onChange={onChange}
        onBlur={onBlur}
        endAdornment={
          tooltipText && (
            <InputAdornment position="end">
              <Tooltip title={tooltipText}>
                <IconButton
                  edge="end"
                  size="small"
                  sx={{
                    mr: 2,
                  }}
                >
                  <HelpOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          )
        }
        {...rest}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {(helperText || error) && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormSelect;
