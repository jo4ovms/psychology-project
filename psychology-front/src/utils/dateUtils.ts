import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDate = (
  dateString: string | null | undefined,
  formatStr = "dd/MM/yyyy"
): string => {
  if (!dateString) return "";

  try {
    const date = parseISO(dateString);

    if (!isValid(date)) {
      return "";
    }

    return format(date, formatStr, { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const formatDateTime = (
  dateString: string | null | undefined,
  timeString: string | null | undefined,
  formatStr = "dd/MM/yyyy HH:mm"
): string => {
  if (!dateString || !timeString) return "";

  try {
    const dateTimeString = `${dateString}T${timeString}:00`;
    const dateTime = parseISO(dateTimeString);

    if (!isValid(dateTime)) {
      return "";
    }

    return format(dateTime, formatStr, { locale: ptBR });
  } catch (error) {
    console.error("Error formatting date time:", error);
    return "";
  }
};

export const formatTime = (timeString: string | null | undefined): string => {
  if (!timeString) return "";

  if (/^\d{2}:\d{2}$/.test(timeString)) {
    return timeString;
  }

  return "";
};

export const toISODateString = (date: Date | null): string => {
  if (!date || !isValid(date)) return "";

  return format(date, "yyyy-MM-dd");
};

export const getTodayISOString = (): string => {
  return toISODateString(new Date());
};

export const calculateAge = (
  birthDateString: string | null | undefined
): number => {
  if (!birthDateString) return 0;

  try {
    const birthDate = parseISO(birthDateString);

    if (!isValid(birthDate)) {
      return 0;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  } catch (error) {
    console.error("Error calculating age:", error);
    return 0;
  }
};
