import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
  Button,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";

import { useAuth } from "../../contexts/AuthContext";

import { formatTime } from "../../utils/dateUtils";

import { AppointmentStatus } from "../../types/models";
import useAppointmentStore from "../../stores/appointmentStore";
import usePatientStore from "../../stores/patientStore";

const DashboardPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    filteredAppointments,
    fetchAppointmentsByDate,
    isLoading: appointmentsLoading,
  } = useAppointmentStore();

  const {
    patients,
    fetchPatients,
    isLoading: patientsLoading,
  } = usePatientStore();

  const [todayStr] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchAppointmentsByDate(todayStr);
    fetchPatients();
  }, [fetchAppointmentsByDate, fetchPatients, todayStr]);

  const totalPatients = patients.length;
  const totalAppointmentsToday = filteredAppointments.length;
  const pendingAppointments = filteredAppointments.filter(
    (app) => app.status === AppointmentStatus.AGENDADO
  ).length;
  const inProgressAppointments = filteredAppointments.filter(
    (app) => app.status === AppointmentStatus.EM_ANDAMENTO
  ).length;

  const upcomingAppointments = filteredAppointments
    .filter((app) => app.status === AppointmentStatus.AGENDADO)
    .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime))
    .slice(0, 5);

  const handleAddPatient = () => {
    navigate("/patients/new");
  };

  const handleAddAppointment = () => {
    navigate("/appointments/new");
  };

  const handleViewAllPatients = () => {
    navigate("/patients");
  };

  const handleViewAllAppointments = () => {
    navigate("/appointments");
  };

  const handleViewCalendar = () => {
    navigate("/calendar");
  };

  const handleViewAppointment = (id: number) => {
    navigate(`/appointments/${id}`);
  };

  const isLoading = appointmentsLoading || patientsLoading;

  return (
    <Box>
      <PageHeader
        title={`Bem-vindo, ${user?.name?.split(" ")[0] || "Usuário"}!`}
        subtitle={`${new Date().toLocaleDateString("pt-BR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`}
        actions={[
          {
            label: "Novo Paciente",
            onClick: handleAddPatient,
            icon: <AddIcon />,
            variant: "outlined",
          },
          {
            label: "Novo Agendamento",
            onClick: handleAddAppointment,
            icon: <AddIcon />,
          },
        ]}
      />

      {isLoading ? (
        <LoadingOverlay open message="Carregando dados..." />
      ) : (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 56,
                      height: 56,
                      mr: 2,
                    }}
                  >
                    <PersonIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {totalPatients}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Pacientes Cadastrados
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleViewAllPatients}
                  sx={{ mt: 2 }}
                >
                  Ver Todos
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.info.main,
                      width: 56,
                      height: 56,
                      mr: 2,
                    }}
                  >
                    <EventIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {totalAppointmentsToday}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      Agendamentos Hoje
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleViewAllAppointments}
                  sx={{ mt: 2 }}
                >
                  Ver Todos
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.success.main,
                      width: 56,
                      height: 56,
                      mr: 2,
                    }}
                  >
                    <AssignmentIcon fontSize="large" />
                  </Avatar>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h4" component="div">
                        {pendingAppointments}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        pendentes
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="h6" component="div">
                        {inProgressAppointments}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        em andamento
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleViewCalendar}
                  sx={{ mt: 2 }}
                >
                  Ver Calendário
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Próximos Agendamentos
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {upcomingAppointments.length > 0 ? (
                  <List>
                    {upcomingAppointments.map((appointment) => (
                      <React.Fragment key={appointment.id}>
                        <ListItem
                          secondaryAction={
                            <Tooltip title="Ver Detalhes">
                              <IconButton
                                edge="end"
                                onClick={() =>
                                  handleViewAppointment(appointment.id)
                                }
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </Tooltip>
                          }
                          sx={{
                            py: 1.5,
                            "&:hover": {
                              backgroundColor: theme.palette.action.hover,
                            },
                            borderLeft: 3,
                            borderColor: theme.palette.primary.main,
                            pl: 2,
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar>
                              <AccessTimeIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1">
                                {appointment.patient?.firstName}{" "}
                                {appointment.patient?.lastName}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <AccessTimeIcon fontSize="small" />
                                  <Typography variant="body2">
                                    {formatTime(appointment.appointmentTime)}
                                  </Typography>
                                </Box>
                                {appointment.observations && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      mt: 0.5,
                                      display: "-webkit-box",
                                      overflow: "hidden",
                                      WebkitBoxOrient: "vertical",
                                      WebkitLineClamp: 1,
                                    }}
                                  >
                                    {appointment.observations}
                                  </Typography>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ p: 3, textAlign: "center" }}>
                    <Typography variant="body1" color="text.secondary">
                      Não há agendamentos pendentes para hoje.
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={handleAddAppointment}
                      sx={{ mt: 2 }}
                    >
                      Novo Agendamento
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Acesso Rápido
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={handleAddPatient}
                  >
                    Novo Paciente
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<AddIcon />}
                    onClick={handleAddAppointment}
                  >
                    Novo Agendamento
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<CalendarTodayIcon />}
                    onClick={handleViewCalendar}
                  >
                    Calendário
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<PersonIcon />}
                    onClick={handleViewAllPatients}
                  >
                    Lista de Pacientes
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default DashboardPage;
