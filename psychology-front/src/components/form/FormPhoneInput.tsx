import React from "react";
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

interface FormPhoneInputProps extends Omit<TextFieldProps, "onChange"> {
  name: string;
  isWhatsApp?: boolean;
  tooltipText?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FormPhoneInput: React.FC<FormPhoneInputProps> = ({
  name,
  isWhatsApp = false,
  tooltipText,
  onChange,
  onBlur,
  InputProps,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 11) {
      if (value.length > 2) {
        value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
      }
      if (value.length > 10) {
        value = `${value.substring(0, 10)}-${value.substring(10)}`;
      }

      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value,
          name: e.target.name,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(newEvent);
    }
  };

  return (
    <TextField
      id={name}
      name={name}
      onBlur={onBlur}
      onChange={handleChange}
      InputProps={{
        ...InputProps,
        startAdornment: isWhatsApp ? (
          <InputAdornment position="start">
            <WhatsAppIcon color="success" />
          </InputAdornment>
        ) : undefined,
        endAdornment: tooltipText && (
          <InputAdornment position="end">
            <Tooltip title={tooltipText}>
              <IconButton edge="end" size="small">
                <HelpOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
      inputProps={{
        maxLength: 15,
      }}
      {...rest}
    />
  );
};

export default FormPhoneInput;
