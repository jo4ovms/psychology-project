import React from "react";
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface FormInputProps extends Omit<TextFieldProps, "name"> {
  name: string;
  tooltipText?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  tooltipText,
  InputProps,
  ...rest
}) => {
  return (
    <TextField
      id={name}
      name={name}
      {...rest}
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
    />
  );
};

export default FormInput;
