import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextFieldProps } from "@mui/material";
import { ptBR } from "date-fns/locale";

interface FormDatePickerProps extends Omit<TextFieldProps, "onChange"> {
  name: string;
  onChange: (date: string | null) => void;
  value: string | null;
  disableFuture?: boolean;
  disablePast?: boolean;
  label?: string;
  required?: boolean;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  name,
  onChange,
  value,
  disableFuture = false,
  disablePast = false,
  label,
  required = false,
  error,
  helperText,
  ...rest
}) => {
  const createSafeDateFromString = (dateString: string | null): Date | null => {
    if (!dateString) return null;

    const [year, month, day] = dateString.split("-").map(Number);

    const date = new Date();
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(day);
    date.setHours(12, 0, 0, 0);

    return date;
  };

  const dateValue = createSafeDateFromString(value);

  const handleDateChange = (date: Date | null) => {
    if (!date) {
      onChange(null);
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    console.log("Data selecionada:", date);
    console.log("Data formatada:", formattedDate);

    onChange(formattedDate);
  };

  const handleCustomBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (rest.onBlur) {
      const simulatedEvent = {
        ...e,
        target: {
          ...e.target,
          name,
        },
      };
      rest.onBlur(simulatedEvent as any);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <DatePicker
        label={label}
        value={dateValue}
        onChange={handleDateChange}
        disableFuture={disableFuture}
        disablePast={disablePast}
        slotProps={{
          textField: {
            id: name,
            name: name,
            required: required,
            fullWidth: true,
            error: error,
            helperText: helperText,
            onBlur: handleCustomBlur,
            ...rest,
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default FormDatePicker;
