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
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import EventIcon from "@mui/icons-material/Event";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NoteIcon from "@mui/icons-material/Note";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";

import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";
import AppointmentCard from "../../components/appointment/AppointmentCard";
import ConfirmationDialog from "../../components/feedback/ConfirmationDialog";

import { useToast } from "../../contexts/ToastContext";

import { formatDate, calculateAge, formatTime } from "../../utils/dateUtils";
import usePatientStore from "../../stores/patientStore";
import useAppointmentStore from "../../stores/appointmentStore";
import useConsultationStore from "../../stores/consultationStore";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const PatientDetailsPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  const [tabValue, setTabValue] = useState(0);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    selectedPatient,
    fetchPatientById,
    deletePatient,
    isLoading: patientLoading,
  } = usePatientStore();

  const {
    patientAppointments,
    fetchAppointmentsByPatient,
    isLoading: appointmentsLoading,
  } = useAppointmentStore();

  const {
    patientHistory,
    fetchConsultationHistoryByPatient,
    isLoading: consultationsLoading,
  } = useConsultationStore();

  const isLoading =
    patientLoading || appointmentsLoading || consultationsLoading;

  useEffect(() => {
    if (id) {
      const patientId = parseInt(id);
      fetchPatientById(patientId);
      fetchAppointmentsByPatient(patientId);
      fetchConsultationHistoryByPatient(patientId);
    }
  }, [
    id,
    fetchPatientById,
    fetchAppointmentsByPatient,
    fetchConsultationHistoryByPatient,
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    navigate(`/patients/${id}/edit`);
  };

  const handleNewAppointment = () => {
    navigate(`/appointments/new?patientId=${id}`);
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (id) {
      try {
        await deletePatient(parseInt(id));
        toast.success("Paciente excluído com sucesso");
        navigate("/patients");
      } catch {
        toast.error("Erro ao excluir paciente");
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const age = selectedPatient ? calculateAge(selectedPatient.birthDate) : null;

  const sortedAppointments = [...(patientAppointments || [])].sort(
    (a, b) =>
      new Date(b.appointmentDate).getTime() -
      new Date(a.appointmentDate).getTime()
  );

  const sortedHistory = [...(patientHistory || [])].sort(
    (a, b) =>
      new Date(b.consultationDate).getTime() -
      new Date(a.consultationDate).getTime()
  );

  return (
    <Box>
      <PageHeader
        title="Detalhes do Paciente"
        subtitle={
          selectedPatient
            ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
            : ""
        }
        icon={<PersonIcon fontSize="large" color="primary" />}
        backTo="/patients"
        showBackButton
        actions={[
          {
            label: "Editar",
            onClick: handleEdit,
            icon: <EditIcon />,
            variant: "outlined",
          },
          {
            label: "Agendar Consulta",
            onClick: handleNewAppointment,
            icon: <EventIcon />,
          },
        ]}
      />

      {isLoading && <LoadingOverlay open fullScreen />}

      {selectedPatient && (
        <Grid container spacing={3}>
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
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <PersonIcon
                      color="primary"
                      sx={{ fontSize: 40, mr: 1.5 }}
                    />
                    <Box>
                      <Typography variant="h5" component="h2">
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedPatient.cpf}
                      </Typography>
                    </Box>
                  </Box>

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

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Dados Pessoais
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CalendarTodayIcon
                          fontSize="small"
                          color="action"
                          sx={{ mr: 1 }}
                        />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Data de Nascimento
                          </Typography>
                          <Typography variant="body1">
                            {formatDate(selectedPatient.birthDate)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PersonIcon
                          fontSize="small"
                          color="action"
                          sx={{ mr: 1 }}
                        />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Idade
                          </Typography>
                          <Typography variant="body1">{age} anos</Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Contato
                  </Typography>

                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <PhoneIcon
                        fontSize="small"
                        color="action"
                        sx={{ mr: 1 }}
                      />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Telefone
                        </Typography>
                        <Typography variant="body1">
                          {selectedPatient.phone}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {selectedPatient.whatsapp && (
                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <WhatsAppIcon
                          fontSize="small"
                          color="success"
                          sx={{ mr: 1 }}
                        />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            WhatsApp
                          </Typography>
                          <Typography variant="body1">
                            {selectedPatient.whatsapp}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}

                  {selectedPatient.email && (
                    <Box sx={{ mb: 1.5 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <EmailIcon
                          fontSize="small"
                          color="action"
                          sx={{ mr: 1 }}
                        />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Email
                          </Typography>
                          <Typography variant="body1">
                            {selectedPatient.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Box>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Endereço
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                      <HomeIcon
                        fontSize="small"
                        color="action"
                        sx={{ mr: 1, mt: 0.5 }}
                      />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Residencial
                        </Typography>
                        <Typography variant="body1">
                          {selectedPatient.homeStreet},{" "}
                          {selectedPatient.homeNumber}
                          <br />
                          {selectedPatient.homeNeighborhood}
                          <br />
                          {selectedPatient.homeCity} -{" "}
                          {selectedPatient.homeState}
                          <br />
                          CEP: {selectedPatient.homeZipCode}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {!selectedPatient.useSameAddress &&
                    selectedPatient.workStreet && (
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                          <WorkIcon
                            fontSize="small"
                            color="action"
                            sx={{ mr: 1, mt: 0.5 }}
                          />
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Trabalho
                            </Typography>
                            <Typography variant="body1">
                              {selectedPatient.workStreet},{" "}
                              {selectedPatient.workNumber}
                              <br />
                              {selectedPatient.workNeighborhood}
                              <br />
                              {selectedPatient.workCity} -{" "}
                              {selectedPatient.workState}
                              <br />
                              CEP: {selectedPatient.workZipCode}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ height: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="patient information tabs"
                >
                  <Tab
                    icon={<EventIcon />}
                    iconPosition="start"
                    label="Agendamentos"
                  />
                  <Tab
                    icon={<NoteIcon />}
                    iconPosition="start"
                    label="Histórico de Consultas"
                  />
                </Tabs>
              </Box>

              <CardContent>
                <TabPanel value={tabValue} index={0}>
                  {sortedAppointments.length > 0 ? (
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mb: 2,
                        }}
                      >
                        <Button
                          variant="contained"
                          startIcon={<EventIcon />}
                          onClick={handleNewAppointment}
                        >
                          Novo Agendamento
                        </Button>
                      </Box>

                      <Grid container spacing={2}>
                        {sortedAppointments.map((appointment) => (
                          <Grid size={{ xs: 12 }} key={appointment.id}>
                            <AppointmentCard
                              appointment={appointment}
                              showPatientInfo={false}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ) : (
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
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        Nenhum agendamento encontrado
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mb: 3 }}
                      >
                        Este paciente ainda não possui agendamentos
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<EventIcon />}
                        onClick={handleNewAppointment}
                      >
                        Agendar Consulta
                      </Button>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  {sortedHistory.length > 0 ? (
                    <Box>
                      {sortedHistory.map((history, index) => (
                        <Card
                          key={history.id}
                          elevation={1}
                          sx={{
                            mb: 2,
                            borderLeft: 4,
                            borderColor: theme.palette.primary.main,
                          }}
                        >
                          <CardContent>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle1"
                                fontWeight="medium"
                              >
                                {history.consultationDate} às{" "}
                                {history.appointmentTime
                                  ? formatTime(history.appointmentTime)
                                  : ""}
                              </Typography>

                              <Chip
                                size="small"
                                color="primary"
                                label={`Consulta #${
                                  sortedHistory.length - index
                                }`}
                              />
                            </Box>

                            {history.diagnosis && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="primary">
                                  Diagnóstico
                                </Typography>
                                <Typography variant="body2">
                                  {history.diagnosis}
                                </Typography>
                              </Box>
                            )}

                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" color="primary">
                                Anotações
                              </Typography>
                              <Typography variant="body2">
                                {history.notes}
                              </Typography>
                            </Box>

                            {history.attentionPoints && (
                              <Box>
                                <Typography variant="subtitle2" color="error">
                                  Pontos de Atenção
                                </Typography>
                                <Typography variant="body2">
                                  {history.attentionPoints}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        py: 5,
                      }}
                    >
                      <NoteIcon
                        sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                      />
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        Nenhuma consulta registrada
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                        sx={{ mb: 3 }}
                      >
                        Este paciente ainda não possui histórico de consultas
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<EventIcon />}
                        onClick={handleNewAppointment}
                      >
                        Agendar Consulta
                      </Button>
                    </Box>
                  )}
                </TabPanel>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Excluir Paciente"
        message={
          selectedPatient
            ? `Tem certeza que deseja excluir o paciente ${selectedPatient.firstName} ${selectedPatient.lastName}? Esta ação não poderá ser desfeita.`
            : "Tem certeza que deseja excluir este paciente? Esta ação não poderá ser desfeita."
        }
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

export default PatientDetailsPage;
