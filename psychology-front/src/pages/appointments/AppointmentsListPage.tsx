import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import EventIcon from "@mui/icons-material/Event";
import ViewDayIcon from "@mui/icons-material/ViewDay";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";
import AppointmentCard from "../../components/appointment/AppointmentCard";
import ConfirmationDialog from "../../components/feedback/ConfirmationDialog";

import { useToast } from "../../contexts/ToastContext";

import {
  formatDate,
  toISODateString,
  getTodayISOString,
} from "../../utils/dateUtils";

import { Appointment, AppointmentStatus } from "../../types/models";
import useAppointmentStore from "../../stores/appointmentStore";

enum ViewMode {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
}

const AppointmentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const {
    appointments,
    filteredAppointments,
    fetchAppointments,
    fetchAppointmentsByDate,
    updateAppointmentStatus,
    setFilters,
    clearFilters,
    isLoading,
    error,
  } = useAppointmentStore();

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DAY);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "">("");
  const [showFilters, setShowFilters] = useState(false);

  const [statusChangeDialog, setStatusChangeDialog] = useState({
    open: false,
    appointmentId: 0,
    status: AppointmentStatus.AGENDADO,
    title: "",
    message: "",
  });

  useEffect(() => {
    if (selectedDate) {
      const dateStr = toISODateString(selectedDate);
      fetchAppointmentsByDate(dateStr);
    } else {
      fetchAppointments();
    }
  }, [fetchAppointments, fetchAppointmentsByDate, selectedDate]);

  useEffect(() => {
    if (statusFilter) {
      setFilters({ status: statusFilter });
    } else if (statusFilter === "") {
      clearFilters();
    }

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = appointments.filter(
        (appointment) =>
          appointment.patient?.firstName
            .toLowerCase()
            .includes(searchTermLower) ||
          appointment.patient?.lastName
            .toLowerCase()
            .includes(searchTermLower) ||
          appointment.observations?.toLowerCase().includes(searchTermLower)
      );
      setFilters({ custom: filtered });
    }
  }, [statusFilter, searchTerm, appointments, setFilters, clearFilters]);

  const groupedAppointments = React.useMemo(() => {
    console.log("Recalculando agrupamento de agendamentos");
    console.log("Agendamentos filtrados:", filteredAppointments);

    if (!filteredAppointments || filteredAppointments.length === 0) {
      console.log("Nenhum agendamento filtrado para agrupar");
      return new Map<string, Appointment[]>();
    }

    const grouped = new Map<string, Appointment[]>();

    filteredAppointments.forEach((appointment) => {
      console.log("Processando agendamento:", appointment);
      const date = appointment.appointmentDate;
      console.log("Data do agendamento:", date);

      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)?.push(appointment);
    });

    grouped.forEach((appointments, date) => {
      appointments.sort((a, b) => {
        if (!a.appointmentTime || !b.appointmentTime) return 0;
        return a.appointmentTime.localeCompare(b.appointmentTime);
      });
    });

    console.log("Resultado do agrupamento:", Object.fromEntries(grouped));
    return grouped;
  }, [filteredAppointments]);

  const datesToDisplay = React.useMemo(() => {
    if (!selectedDate) return [];

    const dates: string[] = [];
    const currentDate = new Date(selectedDate);

    if (viewMode === ViewMode.DAY) {
      dates.push(toISODateString(currentDate));
    } else if (viewMode === ViewMode.WEEK) {
      const currentDay = currentDate.getDay();
      const monday = new Date(currentDate);
      monday.setDate(
        currentDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1)
      );

      for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        dates.push(toISODateString(date));
      }
    } else if (viewMode === ViewMode.MONTH) {
      const firstDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const lastDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );

      for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          i
        );
        dates.push(toISODateString(date));
      }
    }

    return dates;
  }, [selectedDate, viewMode]);

  const handleViewModeChange = (
    event: React.SyntheticEvent,
    newValue: ViewMode
  ) => {
    setViewMode(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as AppointmentStatus | "");
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setSearchTerm("");
    setSelectedDate(new Date());
    clearFilters();
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleAddAppointment = () => {
    navigate("/appointments/new");
  };

  const handleViewCalendar = () => {
    navigate("/calendar");
  };

  const handleAppointmentStatusChange = (
    id: number,
    status: AppointmentStatus
  ) => {
    let title = "";
    let message = "";

    switch (status) {
      case AppointmentStatus.EM_ANDAMENTO:
        title = "Iniciar Consulta";
        message = "Deseja iniciar esta consulta agora?";
        break;
      case AppointmentStatus.CONCLUIDO:
        title = "Concluir Consulta";
        message = "Deseja marcar esta consulta como concluída?";
        break;
      case AppointmentStatus.CANCELADO:
        title = "Cancelar Agendamento";
        message =
          "Deseja cancelar este agendamento? Esta ação não pode ser desfeita.";
        break;
      default:
        title = "Alterar Status";
        message = "Deseja alterar o status deste agendamento?";
    }

    setStatusChangeDialog({
      open: true,
      appointmentId: id,
      status,
      title,
      message,
    });
  };

  const handleConfirmStatusChange = async () => {
    const { appointmentId, status } = statusChangeDialog;

    try {
      await updateAppointmentStatus(appointmentId, status);
      toast.success("Status atualizado com sucesso");

      setStatusChangeDialog((prev) => ({ ...prev, open: false }));

      if (status === AppointmentStatus.EM_ANDAMENTO) {
        handleCreateConsultation(appointmentId);
      }
    } catch {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleCancelStatusChange = () => {
    setStatusChangeDialog((prev) => ({ ...prev, open: false }));
  };

  const handleCreateConsultation = (appointmentId: number) => {
    navigate(`/consultations/new?appointmentId=${appointmentId}`);
  };

  return (
    <Box>
      <PageHeader
        title="Agendamentos"
        subtitle="Gerencie os agendamentos do consultório"
        icon={<EventIcon fontSize="large" color="primary" />}
        actions={[
          {
            label: "Ver Calendário",
            onClick: handleViewCalendar,
            icon: <CalendarTodayIcon />,
            variant: "outlined",
          },
          {
            label: "Novo Agendamento",
            onClick: handleAddAppointment,
            icon: <AddIcon />,
          },
        ]}
      />

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
            }}
          >
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={ptBR}
            >
              <DatePicker
                label="Data"
                value={selectedDate}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    size: "small",
                    sx: { width: { xs: "100%", sm: "auto" } },
                  },
                }}
              />
            </LocalizationProvider>

            <TextField
              placeholder="Buscar agendamentos..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              sx={{ width: { xs: "100%", sm: "300px" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Filtros avançados">
                <IconButton onClick={handleToggleFilters}>
                  <FilterAltIcon color={showFilters ? "primary" : "inherit"} />
                </IconButton>
              </Tooltip>

              <Tabs
                value={viewMode}
                onChange={handleViewModeChange}
                aria-label="view mode"
              >
                <Tab
                  icon={<ViewDayIcon />}
                  value={ViewMode.DAY}
                  aria-label="day view"
                />
                <Tab
                  icon={<ViewWeekIcon />}
                  value={ViewMode.WEEK}
                  aria-label="week view"
                />
                <Tab
                  icon={<CalendarTodayIcon />}
                  value={ViewMode.MONTH}
                  aria-label="month view"
                />
              </Tabs>
            </Box>
          </Box>

          {showFilters && (
            <Box
              sx={{
                p: 2,
                mb: 3,
                bgcolor: "background.default",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Filtros
              </Typography>

              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-filter-label">Status</InputLabel>
                    <Select
                      labelId="status-filter-label"
                      id="status-filter"
                      value={statusFilter}
                      label="Status"
                      onChange={handleStatusChange}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value={AppointmentStatus.AGENDADO}>
                        Agendado
                      </MenuItem>
                      <MenuItem value={AppointmentStatus.EM_ANDAMENTO}>
                        Em Andamento
                      </MenuItem>
                      <MenuItem value={AppointmentStatus.CONCLUIDO}>
                        Concluído
                      </MenuItem>
                      <MenuItem value={AppointmentStatus.CANCELADO}>
                        Cancelado
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid
                  size={{ xs: 12, sm: 2 }}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<ClearIcon />}
                    onClick={handleClearFilters}
                  >
                    Limpar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {isLoading && <LoadingOverlay open />}

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              Erro ao carregar agendamentos: {error}
            </Typography>
          )}

          {!isLoading && filteredAppointments.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 5,
              }}
            >
              <EventIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhum agendamento encontrado
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 3 }}
              >
                {searchTerm || statusFilter
                  ? "Tente ajustar sua busca ou filtros para encontrar o que procura"
                  : "Não há agendamentos para o período selecionado"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddAppointment}
              >
                Novo Agendamento
              </Button>
            </Box>
          )}

          {!isLoading && filteredAppointments.length > 0 && (
            <Box>
              {Array.from(groupedAppointments.entries()).map(
                ([dateStr, dateAppointments]) => (
                  <Box key={dateStr} sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        {formatDate(dateStr, "EEEE, dd/MM/yyyy")}
                        {dateStr === getTodayISOString() && (
                          <Chip
                            label="Hoje"
                            color="primary"
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                    </Box>

                    {dateAppointments.length > 0 && (
                      <Grid container spacing={2}>
                        {dateAppointments.map((appointment) => (
                          <Grid
                            size={{
                              xs: 12,
                              md: viewMode === ViewMode.DAY ? 6 : 12,
                            }}
                            key={appointment.id}
                          >
                            <AppointmentCard
                              appointment={appointment}
                              onStatusChange={handleAppointmentStatusChange}
                              onCreateConsultation={handleCreateConsultation}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </Box>
                )
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={statusChangeDialog.open}
        title={statusChangeDialog.title}
        message={statusChangeDialog.message}
        confirmButtonText={
          statusChangeDialog.status === AppointmentStatus.CANCELADO
            ? "Cancelar Agendamento"
            : "Confirmar"
        }
        cancelButtonText="Voltar"
        onConfirm={handleConfirmStatusChange}
        onCancel={handleCancelStatusChange}
        type={
          statusChangeDialog.status === AppointmentStatus.CANCELADO
            ? "delete"
            : statusChangeDialog.status === AppointmentStatus.EM_ANDAMENTO
            ? "info"
            : "confirm"
        }
        loading={isLoading}
      />
    </Box>
  );
};

export default AppointmentsListPage;
