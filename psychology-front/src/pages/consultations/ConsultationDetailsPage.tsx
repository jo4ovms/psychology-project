import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import LockIcon from "@mui/icons-material/Lock";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import MedicationIcon from "@mui/icons-material/Medication";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PrintIcon from "@mui/icons-material/Print";
import HistoryIcon from "@mui/icons-material/History";

import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";
import ConfirmationDialog from "../../components/feedback/ConfirmationDialog";

import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

import { formatDate } from "../../utils/dateUtils";

import { ConsultationStatus, UserRole } from "../../types/models";
import useConsultationStore from "../../stores/consultationStore";

const ConsultationDetailsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const { user } = useAuth();

  const isProfessional =
    user?.role === UserRole.PROFISSIONAL_SAUDE || user?.role === UserRole.ADMIN;

  const [concludeDialog, setConcludeDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const {
    selectedConsultation,
    fetchConsultationById,
    concludeConsultation,
    deleteConsultation,
    isLoading,
    error,
    clearErrors,
    permissionError,
  } = useConsultationStore();

  const handleEdit = () => {
    navigate(`/consultations/${id}/edit`);
  };

  const handleViewPatient = () => {
    if (selectedConsultation?.appointment?.patientId) {
      navigate(`/patients/${selectedConsultation.appointment.patientId}`);
    }
  };

  const handleViewAppointment = () => {
    if (selectedConsultation?.appointmentId) {
      navigate(`/appointments/${selectedConsultation.appointmentId}`);
    }
  };

  const handleViewHistory = () => {
    if (selectedConsultation?.appointment?.patientId) {
      navigate(`/patients/${selectedConsultation.appointment.patientId}?tab=1`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenConcludeDialog = () => {
    setConcludeDialog(true);
  };

  const handleCloseConcludeDialog = () => {
    setConcludeDialog(false);
  };

  const handleConfirmConclude = async () => {
    if (id) {
      try {
        await concludeConsultation(parseInt(id));
        toast.success("Consulta concluída com sucesso");
        setConcludeDialog(false);
      } catch (error) {
        toast.error("Erro ao concluir consulta");
      }
    }
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    if (id) {
      try {
        await deleteConsultation(parseInt(id));
        toast.success("Consulta excluída com sucesso");
        navigate("/consultations");
      } catch (error) {
        toast.error("Erro ao excluir consulta");
      }
    }
  };

  useEffect(() => {
    if (id) {
      fetchConsultationById(parseInt(id));
    }

    return () => {
      clearErrors();
    };
  }, [id, fetchConsultationById, clearErrors]);

  if (!isProfessional) {
    return (
      <Box>
        <PageHeader
          title="Detalhes da Consulta"
          subtitle="Visualização de consulta psicológica"
          icon={<AssignmentIcon fontSize="large" color="primary" />}
          backTo="/consultations"
          showBackButton
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

  if (permissionError) {
    return (
      <Box>
        <PageHeader
          title="Detalhes da Consulta"
          subtitle="Visualização de consulta psicológica"
          icon={<AssignmentIcon fontSize="large" color="primary" />}
          backTo="/consultations"
          showBackButton
        />

        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <LockIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" gutterBottom color="error">
              Acesso Negado
            </Typography>
            <Typography variant="body1" paragraph>
              Você não tem permissão para visualizar os dados desta consulta.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Apenas o profissional que realizou esta consulta tem acesso aos
              dados. Esta restrição existe para garantir a confidencialidade do
              paciente.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/consultations")}
              sx={{ mt: 2 }}
            >
              Voltar para a Lista de Consultas
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Detalhes da Consulta"
        subtitle={
          selectedConsultation?.appointment?.patient
            ? `Consulta de ${selectedConsultation.appointment.patient.firstName} ${selectedConsultation.appointment.patient.lastName}`
            : "Visualização de consulta psicológica"
        }
        icon={<AssignmentIcon fontSize="large" color="primary" />}
        backTo="/consultations"
        showBackButton
        actions={[
          {
            label: "Editar",
            onClick: handleEdit,
            icon: <EditIcon />,
            variant: "outlined",
          },
          ...(selectedConsultation?.status === ConsultationStatus.EM_ANDAMENTO
            ? [
                {
                  label: "Concluir",
                  onClick: handleOpenConcludeDialog,
                  icon: <CheckCircleIcon />,
                },
              ]
            : []),
        ]}
      />

      {isLoading && <LoadingOverlay open fullScreen />}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Erro ao carregar consulta: {error}
        </Typography>
      )}

      {selectedConsultation && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Dados da Consulta</Typography>

                  <Box>
                    <Tooltip title="Imprimir">
                      <IconButton onClick={handlePrint}>
                        <PrintIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Excluir">
                      <IconButton
                        color="error"
                        onClick={handleOpenDeleteDialog}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CalendarTodayIcon color="action" sx={{ mr: 1 }} />
                    <Typography variant="body1">
                      {selectedConsultation.appointment
                        ? formatDate(
                            selectedConsultation.appointment.appointmentDate
                          )
                        : "Data não disponível"}{" "}
                      às{" "}
                      {selectedConsultation.appointment
                        ? selectedConsultation.appointment.appointmentTime
                        : ""}
                    </Typography>
                  </Box>

                  <Chip
                    label={
                      selectedConsultation.status ===
                      ConsultationStatus.EM_ANDAMENTO
                        ? "Em Andamento"
                        : "Concluída"
                    }
                    color={
                      selectedConsultation.status ===
                      ConsultationStatus.EM_ANDAMENTO
                        ? "info"
                        : "success"
                    }
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1.5,
                    }}
                  >
                    <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      Anotações
                    </Typography>
                  </Box>

                  <Paper
                    variant="outlined"
                    sx={{ p: 2, bgcolor: theme.palette.background.default }}
                  >
                    <Typography variant="body1">
                      {selectedConsultation.notes}
                    </Typography>
                  </Paper>
                </Box>

                {selectedConsultation.diagnosis && (
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <MedicationIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="medium">
                        Diagnóstico
                      </Typography>
                    </Box>

                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: theme.palette.background.default }}
                    >
                      <Typography variant="body1">
                        {selectedConsultation.diagnosis}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {selectedConsultation.treatmentPlan && (
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <HealthAndSafetyIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="medium">
                        Plano de Tratamento
                      </Typography>
                    </Box>

                    <Paper
                      variant="outlined"
                      sx={{ p: 2, bgcolor: theme.palette.background.default }}
                    >
                      <Typography variant="body1">
                        {selectedConsultation.treatmentPlan}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {selectedConsultation.attentionPoints && (
                  <Box sx={{ mb: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 1.5,
                      }}
                    >
                      <WarningAmberIcon color="error" sx={{ mr: 1 }} />
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        color="error"
                      >
                        Pontos de Atenção
                      </Typography>
                    </Box>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        bgcolor:
                          theme.palette.mode === "light"
                            ? "#fff0f0"
                            : "#3a2929",
                        borderColor: theme.palette.error.main,
                      }}
                    >
                      <Typography variant="body1">
                        {selectedConsultation.attentionPoints}
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Paciente</Typography>

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PersonIcon />}
                    onClick={handleViewPatient}
                  >
                    Ver Perfil
                  </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {selectedConsultation.appointment?.patient ? (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <PersonIcon
                        color="primary"
                        sx={{ fontSize: 40, mr: 2 }}
                      />
                      <Box>
                        <Typography variant="h6">
                          {selectedConsultation.appointment.patient.firstName}{" "}
                          {selectedConsultation.appointment.patient.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConsultation.appointment.patient.phone}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<HistoryIcon />}
                      onClick={handleViewHistory}
                      sx={{ mb: 2 }}
                    >
                      Ver Histórico Completo
                    </Button>

                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<CalendarTodayIcon />}
                      onClick={handleViewAppointment}
                    >
                      Ver Agendamento
                    </Button>
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    Informações do paciente não disponíveis
                  </Typography>
                )}
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Metadados
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    Criado em
                  </Typography>
                  <Typography variant="body1">
                    {selectedConsultation.createdAt
                      ? formatDate(
                          selectedConsultation.createdAt,
                          "dd/MM/yyyy HH:mm"
                        )
                      : "Não disponível"}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Última atualização
                  </Typography>
                  <Typography variant="body1">
                    {selectedConsultation.updatedAt
                      ? formatDate(
                          selectedConsultation.updatedAt,
                          "dd/MM/yyyy HH:mm"
                        )
                      : "Não disponível"}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <ConfirmationDialog
        open={concludeDialog}
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
        open={deleteDialog}
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

export default ConsultationDetailsPage;
