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

export const formatTime = (time: string | null | undefined): string => {
  if (!time) return "";

  if (time.includes(":")) {
    const parts = time.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
  }

  return time;
};

export const toISODateString = (date: Date | null): string => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  console.log("Data formatada:", formattedDate);
  return formattedDate;
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
