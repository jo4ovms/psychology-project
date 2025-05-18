import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

import NoteAddIcon from "@mui/icons-material/NoteAdd";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import DescriptionIcon from "@mui/icons-material/Description";
import NotesIcon from "@mui/icons-material/Notes";
import MedicationIcon from "@mui/icons-material/Medication";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";
import ConfirmationDialog from "../../components/feedback/ConfirmationDialog";

import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

import { formatDate } from "../../utils/dateUtils";

import { ConsultationStatus, UserRole } from "../../types/models";
import useConsultationStore from "../../stores/consultationStore";
import usePatientStore from "../../stores/patientStore";

const ConsultationsListPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const isProfessional =
    user?.role === UserRole.PROFISSIONAL_SAUDE || user?.role === UserRole.ADMIN;

  const {
    consultations,
    fetchConsultations,
    concludeConsultation,
    deleteConsultation,
    isLoading: consultationsLoading,
    error: consultationsError,
  } = useConsultationStore();

  const {
    patients,
    fetchPatients,
    isLoading: patientsLoading,
  } = usePatientStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConsultationStatus | "">("");
  const [patientFilter, setPatientFilter] = useState<number | "">("");
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredConsultations, setFilteredConsultations] =
    useState(consultations);

  const [concludeDialog, setConcludeDialog] = useState<{
    open: boolean;
    consultationId: number;
  }>({
    open: false,
    consultationId: 0,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    consultationId: number;
  }>({
    open: false,
    consultationId: 0,
  });

  const isLoading = consultationsLoading || patientsLoading;

  useEffect(() => {
    fetchConsultations();
    fetchPatients();
  }, [fetchConsultations, fetchPatients]);

  useEffect(() => {
    let filtered = [...consultations];

    if (statusFilter) {
      filtered = filtered.filter(
        (consultation) => consultation.status === statusFilter
      );
    }

    if (patientFilter) {
      filtered = filtered.filter(
        (consultation) => consultation.appointment?.patientId === patientFilter
      );
    }

    if (dateFilter) {
      const dateStr = formatDate(dateFilter.toISOString(), "yyyy-MM-dd");
      filtered = filtered.filter((consultation) => {
        const consultationDate = consultation.appointment?.appointmentDate;
        return consultationDate === dateStr;
      });
    }

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (consultation) =>
          consultation.notes?.toLowerCase().includes(searchTermLower) ||
          consultation.diagnosis?.toLowerCase().includes(searchTermLower) ||
          consultation.appointment?.patient?.firstName
            .toLowerCase()
            .includes(searchTermLower) ||
          consultation.appointment?.patient?.lastName
            .toLowerCase()
            .includes(searchTermLower)
      );
    }

    filtered.sort((a, b) => {
      const dateA = a.appointment?.appointmentDate || "";
      const dateB = b.appointment?.appointmentDate || "";
      if (dateA === dateB) {
        const timeA = a.appointment?.appointmentTime || "";
        const timeB = b.appointment?.appointmentTime || "";
        return timeB.localeCompare(timeA);
      }
      return dateB.localeCompare(dateA);
    });

    setFilteredConsultations(filtered);
  }, [consultations, statusFilter, patientFilter, dateFilter, searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setStatusFilter(event.target.value as ConsultationStatus | "");
  };

  const handlePatientChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setPatientFilter(event.target.value as number | "");
  };

  const handleDateChange = (date: Date | null) => {
    setDateFilter(date);
  };

  const handleClearFilters = () => {
    setStatusFilter("");
    setPatientFilter("");
    setDateFilter(null);
    setSearchTerm("");
  };

  const handleToggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleNewConsultation = () => {
    navigate("/consultations/new");
  };

  const handleViewConsultation = (id: number) => {
    navigate(`/consultations/${id}`);
  };

  const handleEditConsultation = (id: number) => {
    navigate(`/consultations/${id}/edit`);
  };

  const handleOpenConcludeDialog = (id: number) => {
    setConcludeDialog({
      open: true,
      consultationId: id,
    });
  };

  const handleCloseConcludeDialog = () => {
    setConcludeDialog({
      open: false,
      consultationId: 0,
    });
  };

  const handleConfirmConclude = async () => {
    try {
      await concludeConsultation(concludeDialog.consultationId);
      toast.success("Consulta concluída com sucesso");
      handleCloseConcludeDialog();
    } catch (error) {
      toast.error("Erro ao concluir consulta");
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setDeleteDialog({
      open: true,
      consultationId: id,
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({
      open: false,
      consultationId: 0,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteConsultation(deleteDialog.consultationId);
      toast.success("Consulta excluída com sucesso");
      handleCloseDeleteDialog();
    } catch (error) {
      toast.error("Erro ao excluir consulta");
    }
  };

  if (!isProfessional) {
    return (
      <Box>
        <PageHeader
          title="Consultas"
          subtitle="Gerenciamento de consultas do consultório"
          icon={<AssignmentIcon fontSize="large" color="primary" />}
        />

        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h5" gutterBottom color="error">
              Acesso Restrito
            </Typography>
            <Typography variant="body1">
              Você não tem permissão para acessar esta página. O gerenciamento
              de consultas é restrito a profissionais de saúde.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Consultas"
        subtitle="Gerenciamento de consultas do consultório"
        icon={<AssignmentIcon fontSize="large" color="primary" />}
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
            <TextField
              placeholder="Buscar consultas..."
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

              <Button
                variant="contained"
                startIcon={<NoteAddIcon />}
                onClick={handleNewConsultation}
              >
                Nova Consulta
              </Button>
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
                <Grid size={{ xs: 12, sm: 3 }}>
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
                      <MenuItem value={ConsultationStatus.EM_ANDAMENTO}>
                        Em Andamento
                      </MenuItem>
                      <MenuItem value={ConsultationStatus.CONCLUIDO}>
                        Concluído
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="patient-filter-label">Paciente</InputLabel>
                    <Select
                      labelId="patient-filter-label"
                      id="patient-filter"
                      value={patientFilter}
                      label="Paciente"
                      onChange={handlePatientChange}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      {patients.map((patient) => (
                        <MenuItem key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 3 }}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={ptBR}
                  >
                    <DatePicker
                      label="Data"
                      value={dateFilter}
                      onChange={handleDateChange}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid
                  size={{ xs: 12, sm: 3 }}
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

          {consultationsError && (
            <Typography color="error" sx={{ mb: 2 }}>
              Erro ao carregar consultas: {consultationsError}
            </Typography>
          )}

          {!isLoading && filteredConsultations.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 5,
              }}
            >
              <AssignmentIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhuma consulta encontrada
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 3 }}
              >
                {searchTerm || statusFilter || patientFilter || dateFilter
                  ? "Tente ajustar sua busca ou filtros para encontrar o que procura"
                  : "Não há consultas registradas no sistema"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<NoteAddIcon />}
                onClick={handleNewConsultation}
              >
                Nova Consulta
              </Button>
            </Box>
          )}

          {!isLoading && filteredConsultations.length > 0 && (
            <Grid container spacing={3}>
              {filteredConsultations.map((consultation) => (
                <Grid size={{ xs: 12, md: 6 }} key={consultation.id}>
                  <Card
                    elevation={3}
                    sx={{
                      borderLeft: 4,
                      borderColor:
                        consultation.status === ConsultationStatus.EM_ANDAMENTO
                          ? theme.palette.info.main
                          : theme.palette.success.main,
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 0.5,
                            }}
                          >
                            <CalendarTodayIcon
                              color="action"
                              fontSize="small"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="subtitle1" fontWeight="medium">
                              {consultation.appointment
                                ? formatDate(
                                    consultation.appointment.appointmentDate
                                  )
                                : "Data não disponível"}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <AccessTimeIcon
                              color="action"
                              fontSize="small"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {consultation.appointment?.appointmentTime ||
                                "Horário não disponível"}
                            </Typography>
                          </Box>
                        </Box>

                        <Box>
                          <Chip
                            label={
                              consultation.status ===
                              ConsultationStatus.EM_ANDAMENTO
                                ? "Em Andamento"
                                : "Concluída"
                            }
                            color={
                              consultation.status ===
                              ConsultationStatus.EM_ANDAMENTO
                                ? "info"
                                : "success"
                            }
                            size="small"
                            sx={{ mr: 1 }}
                          />

                          <IconButton
                            size="small"
                            onClick={() =>
                              handleViewConsultation(consultation.id)
                            }
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {consultation.appointment?.patient && (
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <PersonIcon
                              color="primary"
                              fontSize="small"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="subtitle2">
                              {consultation.appointment.patient.firstName}{" "}
                              {consultation.appointment.patient.lastName}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <Grid container spacing={2}>
                        {consultation.diagnosis && (
                          <Grid size={{ xs: 12 }}>
                            <Box
                              sx={{ display: "flex", alignItems: "flex-start" }}
                            >
                              <MedicationIcon
                                color="error"
                                fontSize="small"
                                sx={{ mr: 1, mt: 0.3 }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Diagnóstico
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  {consultation.diagnosis}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        )}

                        <Grid size={{ xs: 12 }}>
                          <Box
                            sx={{ display: "flex", alignItems: "flex-start" }}
                          >
                            <NotesIcon
                              color="primary"
                              fontSize="small"
                              sx={{ mr: 1, mt: 0.3 }}
                            />
                            <Box>
                              <Typography
                                variant="subtitle2"
                                color="text.secondary"
                              >
                                Anotações
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {consultation.notes}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mt: 2,
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<DescriptionIcon />}
                          onClick={() =>
                            handleViewConsultation(consultation.id)
                          }
                        >
                          Detalhes
                        </Button>

                        {consultation.status ===
                          ConsultationStatus.EM_ANDAMENTO && (
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() =>
                              handleOpenConcludeDialog(consultation.id)
                            }
                          >
                            Concluir
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={concludeDialog.open}
        title="Concluir Consulta"
        message="Tem certeza que deseja concluir esta consulta? Isso indicará que a consulta foi finalizada."
        confirmButtonText="Concluir"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmConclude}
        onCancel={handleCloseConcludeDialog}
        type="confirm"
        loading={isLoading}
      />

      <ConfirmationDialog
        open={deleteDialog.open}
        title="Excluir Consulta"
        message="Tem certeza que deseja excluir esta consulta? Esta ação não poderá ser desfeita."
        confirmButtonText="Excluir"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteDialog}
        type="delete"
        loading={isLoading}
      />
    </Box>
  );
};

export default ConsultationsListPage;
