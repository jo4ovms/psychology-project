import React, { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
  useTheme,
  Autocomplete,
  TextField,
  Paper,
  Alert,
} from "@mui/material";
import {
  useNavigate,
  useParams,
  useLocation as useRouterLocation,
} from "react-router-dom";

import AssignmentIcon from "@mui/icons-material/Assignment";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import MedicationIcon from "@mui/icons-material/Medication";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";
import FormTextarea from "../../components/form/FormTextarea";
import FormInput from "../../components/form/FormInput";

import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import { consultationSchema } from "../../utils/validationSchemas";

import { formatDate } from "../../utils/dateUtils";

import { CreateConsultationDTO, UpdateConsultationDTO } from "../../types/dtos";
import { Appointment, UserRole } from "../../types/models";
import useConsultationStore from "../../stores/consultationStore";
import useAppointmentStore from "../../stores/appointmentStore";
import usePatientStore from "../../stores/patientStore";

function useQuery() {
  return new URLSearchParams(useRouterLocation().search);
}

const ConsultationFormPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const query = useQuery();
  const appointmentIdFromQuery = query.get("appointmentId");
  const { user } = useAuth();

  const isProfessional =
    user?.role === UserRole.PROFISSIONAL_SAUDE || user?.role === UserRole.ADMIN;

  const isEditMode = !!id;

  const {
    selectedConsultation,
    fetchConsultationById,
    createConsultation,
    updateConsultation,
    isLoading: consultationLoading,
    error: consultationError,
  } = useConsultationStore();

  const {
    appointments,
    selectedAppointment,
    fetchAppointments,
    fetchAppointmentById,
    isLoading: appointmentsLoading,
  } = useAppointmentStore();

  const {
    patients,
    fetchPatients,
    isLoading: patientsLoading,
  } = usePatientStore();

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | null
  >(appointmentIdFromQuery ? parseInt(appointmentIdFromQuery) : null);
  const [encryptSensitiveData, setEncryptSensitiveData] = useState(true);

  const isLoading =
    consultationLoading || appointmentsLoading || patientsLoading;

  const initialValues: CreateConsultationDTO = {
    appointmentId: appointmentIdFromQuery
      ? parseInt(appointmentIdFromQuery)
      : 0,
    notes: "",
    diagnosis: "",
    treatmentPlan: "",
    attentionPoints: "",
  };

  const getInitialValues = () => {
    if (isEditMode && selectedConsultation) {
      return {
        appointmentId: selectedConsultation.appointmentId,
        notes: selectedConsultation.notes,
        diagnosis: selectedConsultation.diagnosis || "",
        treatmentPlan: selectedConsultation.treatmentPlan || "",
        attentionPoints: selectedConsultation.attentionPoints || "",
      };
    }
    return initialValues;
  };

  useEffect(() => {
    fetchAppointments();
    fetchPatients();

    if (appointmentIdFromQuery) {
      fetchAppointmentById(parseInt(appointmentIdFromQuery));
    }

    if (isEditMode && id) {
      fetchConsultationById(parseInt(id));
    }
  }, [
    isEditMode,
    id,
    appointmentIdFromQuery,
    fetchAppointments,
    fetchAppointmentById,
    fetchConsultationById,
    fetchPatients,
  ]);

  useEffect(() => {
    if (isEditMode && selectedConsultation) {
      setSelectedAppointmentId(selectedConsultation.appointmentId);
      fetchAppointmentById(selectedConsultation.appointmentId);
    }
  }, [isEditMode, selectedConsultation, fetchAppointmentById]);

  if (!isProfessional) {
    return (
      <Box>
        <PageHeader
          title={isEditMode ? "Editar Consulta" : "Nova Consulta"}
          subtitle="Registro de consulta psicológica"
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

  const handleSubmit = async (
    values: CreateConsultationDTO,
    { setSubmitting }: FormikHelpers<CreateConsultationDTO>
  ) => {
    try {
      if (isEditMode && id) {
        const updateData: UpdateConsultationDTO = {
          notes: values.notes,
          diagnosis: values.diagnosis,
          treatmentPlan: values.treatmentPlan,
          attentionPoints: values.attentionPoints,
        };
        await updateConsultation(parseInt(id), updateData);
        toast.success("Consulta atualizada com sucesso!");
      } else {
        await createConsultation(values);
        toast.success("Consulta registrada com sucesso!");
      }

      navigate("/consultations");
    } catch (error) {
      toast.error(
        "Erro ao salvar consulta. Verifique os dados e tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAppointmentChange = (
    event: React.SyntheticEvent,
    value: Appointment | null,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    if (value) {
      setSelectedAppointmentId(value.id);
      setFieldValue("appointmentId", value.id, true);
    } else {
      setSelectedAppointmentId(null);
      setFieldValue("appointmentId", 0, true);
    }
  };

  const handleEncryptionToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEncryptSensitiveData(event.target.checked);
  };

  const getAppointmentLabel = (appointment: Appointment) => {
    const patient = appointment.patient;
    const date = formatDate(appointment.appointmentDate);
    const time = appointment.appointmentTime;

    if (patient) {
      return `${patient.firstName} ${patient.lastName} - ${date} às ${time}`;
    }

    return `${date} às ${time}`;
  };

  const inProgressAppointments = appointments.filter(
    (appointment) => appointment.status === "EM_ANDAMENTO"
  );

  return (
    <Box>
      <PageHeader
        title={isEditMode ? "Editar Consulta" : "Nova Consulta"}
        subtitle={
          selectedAppointment?.patient
            ? `Consulta para ${selectedAppointment.patient.firstName} ${selectedAppointment.patient.lastName}`
            : "Registro de consulta psicológica"
        }
        icon={<AssignmentIcon fontSize="large" color="primary" />}
        backTo="/consultations"
        showBackButton
      />

      {isLoading && <LoadingOverlay open fullScreen />}

      {consultationError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {consultationError}
        </Alert>
      )}

      <Formik
        initialValues={getInitialValues()}
        validationSchema={consultationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          isValid,
          isSubmitting,
        }) => (
          <Form>
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  {!isEditMode && (
                    <Grid size={{ xs: 12 }}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: 500 }}
                      >
                        Agendamento
                      </Typography>

                      <Autocomplete
                        options={inProgressAppointments}
                        getOptionLabel={getAppointmentLabel}
                        value={
                          inProgressAppointments.find(
                            (a) => a.id === selectedAppointmentId
                          ) || null
                        }
                        onChange={(event, value) =>
                          handleAppointmentChange(event, value, setFieldValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="appointmentId"
                            label="Selecione o agendamento"
                            variant="outlined"
                            fullWidth
                            error={
                              touched.appointmentId &&
                              Boolean(errors.appointmentId)
                            }
                            helperText={
                              touched.appointmentId && errors.appointmentId
                            }
                            onBlur={handleBlur}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <CalendarTodayIcon
                                    color="action"
                                    sx={{ mr: 1 }}
                                  />
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography variant="body1">
                                {option.patient?.firstName}{" "}
                                {option.patient?.lastName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(option.appointmentDate)} às{" "}
                                {option.appointmentTime}
                              </Typography>
                            </Box>
                          </li>
                        )}
                        disabled={!!appointmentIdFromQuery || isEditMode}
                      />
                    </Grid>
                  )}

                  {selectedAppointment?.patient && (
                    <Grid size={{ xs: 12 }}>
                      <Paper
                        variant="outlined"
                        sx={{ p: 2, bgcolor: theme.palette.background.default }}
                      >
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <PersonIcon color="primary" sx={{ mr: 1 }} />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Paciente
                                </Typography>
                                <Typography variant="body1">
                                  {selectedAppointment.patient.firstName}{" "}
                                  {selectedAppointment.patient.lastName}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CalendarTodayIcon
                                color="primary"
                                sx={{ mr: 1 }}
                              />
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  color="text.secondary"
                                >
                                  Data e Hora
                                </Typography>
                                <Typography variant="body1">
                                  {formatDate(
                                    selectedAppointment.appointmentDate
                                  )}{" "}
                                  às {selectedAppointment.appointmentTime}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>
                  )}

                  <Grid size={{ xs: 12 }}>
                    <Divider />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <DescriptionIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" fontWeight="medium">
                          Anotações da Consulta
                        </Typography>
                      </Box>

                      <FormControlLabel
                        control={
                          <Switch
                            checked={encryptSensitiveData}
                            onChange={handleEncryptionToggle}
                            color="primary"
                          />
                        }
                        label="Criptografar dados sensíveis"
                      />
                    </Box>

                    <FormTextarea
                      name="notes"
                      label="Anotações"
                      placeholder="Registre as anotações principais da consulta"
                      minRows={4}
                      maxRows={8}
                      required
                      value={values.notes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.notes && Boolean(errors.notes)}
                      helperText={touched.notes && errors.notes}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <MedicationIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="medium">
                        Diagnóstico
                      </Typography>
                    </Box>

                    <FormInput
                      name="diagnosis"
                      label="Diagnóstico"
                      placeholder="Registre o diagnóstico (se houver)"
                      value={values.diagnosis}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.diagnosis && Boolean(errors.diagnosis)}
                      helperText={touched.diagnosis && errors.diagnosis}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <HealthAndSafetyIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="medium">
                        Plano de Tratamento
                      </Typography>
                    </Box>

                    <FormTextarea
                      name="treatmentPlan"
                      label="Plano de Tratamento"
                      placeholder="Descreva o plano de tratamento recomendado"
                      minRows={3}
                      maxRows={6}
                      value={values.treatmentPlan}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.treatmentPlan && Boolean(errors.treatmentPlan)
                      }
                      helperText={touched.treatmentPlan && errors.treatmentPlan}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
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

                    <FormTextarea
                      name="attentionPoints"
                      label="Pontos de Atenção"
                      placeholder="Registre pontos que merecem atenção especial"
                      minRows={2}
                      maxRows={4}
                      value={values.attentionPoints}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.attentionPoints &&
                        Boolean(errors.attentionPoints)
                      }
                      helperText={
                        touched.attentionPoints && errors.attentionPoints
                      }
                    />

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, display: "block" }}
                    >
                      Os pontos de atenção são destacados no histórico do
                      paciente para facilitar o acompanhamento.
                    </Typography>
                  </Grid>
                </Grid>

                <Box
                  sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<SaveIcon />}
                    disabled={!isValid || isLoading || isSubmitting}
                  >
                    {isEditMode ? "Atualizar" : "Salvar Consulta"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default ConsultationFormPage;
