import React, { useState } from "react";
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchIcon from "@mui/icons-material/Search";
import useLocation from "../../hooks/useLocation";
import { Location } from "../../types/models";

interface FormCepInputProps extends Omit<TextFieldProps, "onChange"> {
  name: string;
  tooltipText?: string;
  onAddressFound?: (address: Location) => void;
  autoSearch?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FormCepInput: React.FC<FormCepInputProps> = ({
  name,
  tooltipText,
  onAddressFound,
  autoSearch = true,
  onChange,
  onBlur,
  InputProps,
  value,
  ...rest
}) => {
  const {
    fetchLocationByCep,
    isLoading,
    error: locationError,
    clearError,
  } = useLocation();

  const [searchPerformed, setSearchPerformed] = useState(false);

  const formatCep = (inputValue: string) => {
    if (!inputValue) return inputValue;

    const cepNumbers = inputValue.replace(/\D/g, "");

    if (cepNumbers.length <= 5) {
      return cepNumbers;
    } else {
      return `${cepNumbers.substring(0, 5)}-${cepNumbers.substring(5, 8)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCep(e.target.value);

    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue,
        name: e.target.name,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange(newEvent);

    if (autoSearch && formattedValue.replace(/\D/g, "").length === 8) {
      searchCep(formattedValue);
    } else {
      setSearchPerformed(false);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onBlur) {
      onBlur(e);
    }

    if (
      e.target.value &&
      e.target.value.replace(/\D/g, "").length === 8 &&
      !searchPerformed
    ) {
      searchCep(e.target.value);
    }
  };

  const searchCep = async (cep: string) => {
    if (!cep || cep.replace(/\D/g, "").length < 8) return;

    clearError();

    try {
      const locationData = await fetchLocationByCep(cep);

      if (locationData && onAddressFound) {
        onAddressFound(locationData);
      }

      setSearchPerformed(true);
    } catch (error) {
      console.error("Error fetching CEP:", error);
      setSearchPerformed(true);
    }
  };

  const errorMessage =
    searchPerformed && locationError
      ? "CEP não encontrado. Verifique e tente novamente."
      : undefined;

  return (
    <TextField
      id={name}
      name={name}
      value={value || ""}
      onChange={handleChange}
      onBlur={handleBlur}
      error={Boolean(rest.error) || (searchPerformed && !!locationError)}
      helperText={rest.helperText || errorMessage}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            {isLoading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => searchCep(value as string)}
                  disabled={
                    !value || (value as string).replace(/\D/g, "").length < 8
                  }
                  sx={{ mr: tooltipText ? 0 : 1 }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>

                {tooltipText && (
                  <Tooltip title={tooltipText}>
                    <IconButton edge="end" size="small">
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
          </InputAdornment>
        ),
      }}
      inputProps={{
        maxLength: 9,
      }}
      {...rest}
    />
  );
};

export default FormCepInput;
