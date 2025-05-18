import React from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import {
  TextFieldProps,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { parse, isValid } from "date-fns";

interface FormTimePickerProps extends Omit<TextFieldProps, "onChange"> {
  name: string;
  label?: string;
  tooltipText?: string;
  readOnly?: boolean;
  minutesStep?: number;
  value: string | null;
  onChange: (time: string | null) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
}

const FormTimePicker: React.FC<FormTimePickerProps> = ({
  name,
  label,
  tooltipText,
  readOnly = false,
  minutesStep = 15,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  ...rest
}) => {
  let timeValue = null;

  if (value) {
    const today = new Date();
    const parsedTime = parse(value, "HH:mm", today);

    if (isValid(parsedTime)) {
      timeValue = parsedTime;
    }
  }

  const handleTimeChange = (time: Date | null) => {
    if (time && isValid(time)) {
      const hours = time.getHours().toString().padStart(2, "0");
      const minutes = time.getMinutes().toString().padStart(2, "0");
      onChange(`${hours}:${minutes}`);
    } else {
      onChange(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <TimePicker
        label={label}
        value={timeValue}
        onChange={handleTimeChange}
        readOnly={readOnly}
        minutesStep={minutesStep}
        ampm={false}
        slotProps={{
          textField: {
            id: name,
            name: name,
            fullWidth: true,
            margin: "normal",
            error: error,
            helperText: helperText,
            onBlur: onBlur,
            InputProps: {
              readOnly,
              endAdornment: tooltipText ? (
                <InputAdornment position="end">
                  <Tooltip title={tooltipText}>
                    <IconButton edge="end" size="small">
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ) : undefined,
            },
            ...rest,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default FormTimePicker;
