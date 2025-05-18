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
  List,
  Paper,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DescriptionIcon from "@mui/icons-material/Description";

import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";
import ConfirmationDialog from "../../components/feedback/ConfirmationDialog";

import { useToast } from "../../contexts/ToastContext";

import { formatDate } from "../../utils/dateUtils";

import { AppointmentStatus } from "../../types/models";
import useAppointmentStore from "../../stores/appointmentStore";
import useConsultationStore from "../../stores/consultationStore";

const AppointmentDetailsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [statusChangeDialog, setStatusChangeDialog] = useState({
    open: false,
    status: AppointmentStatus.AGENDADO,
    title: "",
    message: "",
  });

  const [deleteDialog, setDeleteDialog] = useState(false);

  const {
    selectedAppointment,
    fetchAppointmentById,
    updateAppointmentStatus,
    deleteAppointment,
    isLoading: appointmentLoading,
  } = useAppointmentStore();

  const {
    patientConsultations,
    fetchConsultationsByPatient,
    isLoading: consultationsLoading,
  } = useConsultationStore();

  const isLoading = appointmentLoading || consultationsLoading;

  const relatedConsultation =
    selectedAppointment && patientConsultations
      ? patientConsultations.find(
          (c) => c.appointmentId === selectedAppointment.id
        )
      : null;

  useEffect(() => {
    if (id) {
      const appointmentId = parseInt(id);
      fetchAppointmentById(appointmentId);
    }
  }, [id, fetchAppointmentById]);

  useEffect(() => {
    if (selectedAppointment?.patientId) {
      fetchConsultationsByPatient(selectedAppointment.patientId);
    }
  }, [selectedAppointment, fetchConsultationsByPatient]);

  const handleEdit = () => {
    navigate(`/appointments/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setDeleteDialog(true);
  };

  const handleStatusChange = (status: AppointmentStatus) => {
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
      status,
      title,
      message,
    });
  };

  const handleConfirmStatusChange = async () => {
    if (id) {
      try {
        await updateAppointmentStatus(parseInt(id), statusChangeDialog.status);
        toast.success("Status atualizado com sucesso");

        setStatusChangeDialog((prev) => ({ ...prev, open: false }));

        if (
          statusChangeDialog.status === AppointmentStatus.EM_ANDAMENTO &&
          !relatedConsultation
        ) {
          handleCreateConsultation();
        }
      } catch {
        toast.error("Erro ao atualizar status");
      }
    }
  };

  const handleCancelStatusChange = () => {
    setStatusChangeDialog((prev) => ({ ...prev, open: false }));
  };

  const handleConfirmDelete = async () => {
    if (id) {
      try {
        await deleteAppointment(parseInt(id));
        toast.success("Agendamento excluído com sucesso");
        navigate("/appointments");
      } catch {
        toast.error("Erro ao excluir agendamento");
      } finally {
        setDeleteDialog(false);
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog(false);
  };

  const handleCreateConsultation = () => {
    navigate(`/consultations/new?appointmentId=${id}`);
  };

  const handleViewConsultation = () => {
    if (relatedConsultation) {
      navigate(`/consultations/${relatedConsultation.id}`);
    }
  };

  const handleViewPatient = () => {
    if (selectedAppointment?.patientId) {
      navigate(`/patients/${selectedAppointment.patientId}`);
    }
  };

  const getStatusProps = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.AGENDADO:
        return {
          color: "primary" as const,
          label: "Agendado",
          icon: <EventIcon />,
        };
      case AppointmentStatus.EM_ANDAMENTO:
        return {
          color: "info" as const,
          label: "Em Andamento",
          icon: <PlayArrowIcon />,
        };
      case AppointmentStatus.CONCLUIDO:
        return {
          color: "success" as const,
          label: "Concluído",
          icon: <CheckCircleIcon />,
        };
      case AppointmentStatus.CANCELADO:
        return {
          color: "error" as const,
          label: "Cancelado",
          icon: <CancelIcon />,
        };
      default:
        return {
          color: "default" as const,
          label: "Desconhecido",
          icon: <EventIcon />,
        };
    }
  };

  return (
    <Box>
      <PageHeader
        title="Detalhes do Agendamento"
        subtitle={
          selectedAppointment
            ? `Agendamento para ${formatDate(
                selectedAppointment.appointmentDate
              )} às ${selectedAppointment.appointmentTime}`
            : ""
        }
        icon={<EventIcon fontSize="large" color="primary" />}
        backTo="/appointments"
        showBackButton
        actions={[
          {
            label: "Editar",
            onClick: handleEdit,
            icon: <EditIcon />,
            variant: "outlined",
          },
          ...(selectedAppointment?.status === AppointmentStatus.EM_ANDAMENTO &&
          !relatedConsultation
            ? [
                {
                  label: "Registrar Consulta",
                  onClick: handleCreateConsultation,
                  icon: <NoteAddIcon />,
                },
              ]
            : []),
        ]}
      />

      {isLoading && <LoadingOverlay open fullScreen />}

      {selectedAppointment && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
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
                  <Typography variant="h6">
                    Informações do Agendamento
                  </Typography>

                  <Box>
                    {selectedAppointment.status ===
                      AppointmentStatus.AGENDADO && (
                      <Tooltip title="Iniciar Consulta">
                        <IconButton
                          color="info"
                          onClick={() =>
                            handleStatusChange(AppointmentStatus.EM_ANDAMENTO)
                          }
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {selectedAppointment.status ===
                      AppointmentStatus.EM_ANDAMENTO && (
                      <Tooltip title="Concluir">
                        <IconButton
                          color="success"
                          onClick={() =>
                            handleStatusChange(AppointmentStatus.CONCLUIDO)
                          }
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {(selectedAppointment.status ===
                      AppointmentStatus.AGENDADO ||
                      selectedAppointment.status ===
                        AppointmentStatus.EM_ANDAMENTO) && (
                      <Tooltip title="Cancelar">
                        <IconButton
                          color="error"
                          onClick={() =>
                            handleStatusChange(AppointmentStatus.CANCELADO)
                          }
                        >
                          <CancelIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Excluir">
                      <IconButton color="error" onClick={handleDeleteClick}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium">
                      Status
                    </Typography>

                    {selectedAppointment.status && (
                      <Chip
                        icon={getStatusProps(selectedAppointment.status).icon}
                        label={getStatusProps(selectedAppointment.status).label}
                        color={getStatusProps(selectedAppointment.status).color}
                      />
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      gutterBottom
                    >
                      Data e Horário
                    </Typography>

                    <Box sx={{ display: "flex", gap: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <EventIcon color="action" sx={{ mr: 1 }} />
                        <Typography>
                          {formatDate(selectedAppointment.appointmentDate)}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                        <Typography>
                          {selectedAppointment.appointmentTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {selectedAppointment.observations && (
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        gutterBottom
                      >
                        Observações
                      </Typography>

                      <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: "background.default" }}
                      >
                        <Typography>
                          {selectedAppointment.observations}
                        </Typography>
                      </Paper>
                    </Box>
                  )}
                </Box>

                {relatedConsultation ? (
                  <>
                    <Divider sx={{ my: 3 }} />

                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="medium">
                          Consulta Registrada
                        </Typography>

                        <Button
                          variant="outlined"
                          startIcon={<DescriptionIcon />}
                          onClick={handleViewConsultation}
                          size="small"
                        >
                          Ver Detalhes
                        </Button>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          gutterBottom
                        >
                          Status
                        </Typography>

                        <Chip
                          label={
                            relatedConsultation.status === "EM_ANDAMENTO"
                              ? "Em Andamento"
                              : "Concluída"
                          }
                          color={
                            relatedConsultation.status === "EM_ANDAMENTO"
                              ? "info"
                              : "success"
                          }
                          size="small"
                        />
                      </Box>

                      {relatedConsultation.diagnosis && (
                        <Box sx={{ mb: 2 }}>
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            gutterBottom
                          >
                            Diagnóstico
                          </Typography>

                          <Typography variant="body2">
                            {relatedConsultation.diagnosis}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </>
                ) : (
                  selectedAppointment.status ===
                    AppointmentStatus.EM_ANDAMENTO && (
                    <>
                      <Divider sx={{ my: 3 }} />

                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Nenhuma consulta registrada ainda
                        </Typography>

                        <Button
                          variant="contained"
                          startIcon={<NoteAddIcon />}
                          onClick={handleCreateConsultation}
                        >
                          Registrar Consulta
                        </Button>
                      </Box>
                    </>
                  )
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
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
                  <Typography variant="h6">Informações do Paciente</Typography>

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

                {selectedAppointment.patient ? (
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
                          {selectedAppointment.patient.firstName}{" "}
                          {selectedAppointment.patient.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          CPF: {selectedAppointment.patient.cpf}
                        </Typography>
                      </Box>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <PhoneIcon color="action" sx={{ mr: 1 }} />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Telefone
                            </Typography>
                            <Typography variant="body1">
                              {selectedAppointment.patient.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {selectedAppointment.patient.whatsapp && (
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <WhatsAppIcon color="success" sx={{ mr: 1 }} />
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                WhatsApp
                              </Typography>
                              <Typography variant="body1">
                                {selectedAppointment.patient.whatsapp}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}

                      <Grid size={{ xs: 12 }}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          gutterBottom
                        >
                          Últimos Agendamentos
                        </Typography>

                        {patientConsultations &&
                        patientConsultations.length > 0 ? (
                          <List dense>
                            {patientConsultations
                              .slice(0, 3)
                              .map((consultation) => (
                                <Paper
                                  key={consultation.id}
                                  variant="outlined"
                                  sx={{
                                    mb: 1,
                                    p: 1,
                                    borderLeft: 3,
                                    borderColor: theme.palette.primary.main,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      fontWeight="medium"
                                    >
                                      {formatDate(
                                        consultation.appointment
                                          ?.appointmentDate || ""
                                      )}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {
                                        consultation.appointment
                                          ?.appointmentTime
                                      }
                                    </Typography>
                                  </Box>

                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    noWrap
                                  >
                                    {consultation.diagnosis ||
                                      "Sem diagnóstico registrado"}
                                  </Typography>
                                </Paper>
                              ))}
                          </List>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Este paciente não possui consultas anteriores.
                          </Typography>
                        )}

                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            variant="text"
                            endIcon={<EventNoteIcon />}
                            onClick={handleViewPatient}
                          >
                            Ver Histórico Completo
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    Informações do paciente não disponíveis
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

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

      <ConfirmationDialog
        open={deleteDialog}
        title="Excluir Agendamento"
        message="Tem certeza que deseja excluir este agendamento? Esta ação não poderá ser desfeita."
        confirmButtonText="Excluir"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type="delete"
        loading={isLoading}
      />
    </Box>
  );
};

export default AppointmentDetailsPage;
