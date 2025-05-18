import React, { useEffect, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormHelperText,
  Grid,
  Typography,
  Autocomplete,
  TextField,
  Chip,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  useNavigate,
  useParams,
  useLocation as useRouterLocation,
} from "react-router-dom";

import EventIcon from "@mui/icons-material/Event";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";
import FormDatePicker from "../../components/form/FormDatePicker";
import FormTextarea from "../../components/form/FormTextarea";

import { useToast } from "../../contexts/ToastContext";
import { appointmentSchema } from "../../utils/validationSchemas";

import { CreateAppointmentDTO, UpdateAppointmentDTO } from "../../types/dtos";
import { Patient } from "../../types/models";
import useAppointmentStore from "../../stores/appointmentStore";
import usePatientStore from "../../stores/patientStore";

function useQuery() {
  return new URLSearchParams(useRouterLocation().search);
}

const AppointmentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const query = useQuery();
  const patientIdFromQuery = query.get("patientId");

  const isEditMode = !!id;

  const {
    selectedAppointment,
    fetchAppointmentById,
    createAppointment,
    updateAppointment,
    fetchAvailableTimes,
    availableTimes,
    isLoading: appointmentLoading,
  } = useAppointmentStore();

  const {
    patients,
    fetchPatients,
    fetchPatientById,
    selectedPatient,
    isLoading: patientsLoading,
  } = usePatientStore();

  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    patientIdFromQuery ? parseInt(patientIdFromQuery) : null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const isLoading = appointmentLoading || patientsLoading;

  const initialValues: CreateAppointmentDTO = {
    patientId: patientIdFromQuery ? parseInt(patientIdFromQuery) : 0,
    appointmentDate: "",
    appointmentTime: "",
    observations: "",
  };

  useEffect(() => {
    fetchPatients();

    if (patientIdFromQuery) {
      fetchPatientById(parseInt(patientIdFromQuery));
    }

    if (isEditMode && id) {
      fetchAppointmentById(parseInt(id));
    }
  }, [
    isEditMode,
    id,
    patientIdFromQuery,
    fetchPatients,
    fetchPatientById,
    fetchAppointmentById,
  ]);

  const getInitialValues = () => {
    if (isEditMode && selectedAppointment) {
      return {
        patientId: selectedAppointment.patientId,
        appointmentDate: selectedAppointment.appointmentDate,
        appointmentTime: selectedAppointment.appointmentTime,
        observations: selectedAppointment.observations || "",
      };
    }
    return initialValues;
  };

  useEffect(() => {
    if (isEditMode && selectedAppointment) {
      setSelectedPatientId(selectedAppointment.patientId);
      setSelectedDate(selectedAppointment.appointmentDate);
      fetchAvailableTimes(selectedAppointment.appointmentDate);
    }
  }, [isEditMode, selectedAppointment, fetchAvailableTimes]);

  const handleSubmit = async (
    data: CreateAppointmentDTO,
    { setSubmitting }: FormikHelpers<CreateAppointmentDTO>
  ) => {
    try {
      if (isEditMode && id) {
        const updateData: UpdateAppointmentDTO = {
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          observations: data.observations,
        };
        await updateAppointment(parseInt(id), updateData);
        toast.success("Agendamento atualizado com sucesso!");
      } else {
        await createAppointment(data);
        toast.success("Agendamento criado com sucesso!");
      }

      navigate("/appointments");
    } catch (error) {
      toast.error(
        "Erro ao salvar agendamento. Verifique os dados e tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePatientChange = (
    event: React.SyntheticEvent,
    value: Patient | null,
    setFieldValue: (field: string, value: any) => void
  ) => {
    if (value) {
      setSelectedPatientId(value.id);
      setFieldValue("patientId", value.id);
    } else {
      setSelectedPatientId(null);
      setFieldValue("patientId", 0);
    }
  };

  return (
    <Box>
      <PageHeader
        title={isEditMode ? "Editar Agendamento" : "Novo Agendamento"}
        subtitle={
          isEditMode && selectedAppointment?.patient
            ? `Agendamento para ${selectedAppointment.patient.firstName} ${selectedAppointment.patient.lastName}`
            : selectedPatient
            ? `Agendamento para ${selectedPatient.firstName} ${selectedPatient.lastName}`
            : "Preencha os dados para criar um novo agendamento"
        }
        icon={<EventIcon fontSize="large" color="primary" />}
        backTo="/appointments"
        showBackButton
      />

      {isLoading && <LoadingOverlay open fullScreen />}

      <Formik
        initialValues={getInitialValues()}
        validationSchema={appointmentSchema}
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
        }) => {
          React.useEffect(() => {
            if (values.appointmentDate) {
              setSelectedDate(values.appointmentDate);
              fetchAvailableTimes(values.appointmentDate);
            }
          }, [values.appointmentDate]);

          const handleTimeSelect = (time: string) => {
            setFieldValue("appointmentTime", time);
          };

          return (
            <Form>
              <Card>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12 }}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: 500 }}
                      >
                        Paciente
                      </Typography>

                      <Autocomplete
                        options={patients}
                        getOptionLabel={(option) =>
                          `${option.firstName} ${option.lastName}`
                        }
                        value={
                          patients.find((p) => p.id === selectedPatientId) ||
                          null
                        }
                        onChange={(event, value) =>
                          handlePatientChange(event, value, setFieldValue)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Selecione o paciente"
                            variant="outlined"
                            fullWidth
                            error={
                              touched.patientId && Boolean(errors.patientId)
                            }
                            helperText={touched.patientId && errors.patientId}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <PersonIcon color="action" sx={{ mr: 1 }} />
                                  {params.InputProps.startAdornment}
                                </>
                              ),
                            }}
                            onBlur={handleBlur}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props}>
                            <Box
                              sx={{ display: "flex", flexDirection: "column" }}
                            >
                              <Typography variant="body1">
                                {option.firstName} {option.lastName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {option.phone}
                              </Typography>
                            </Box>
                          </li>
                        )}
                        disabled={isEditMode || !!patientIdFromQuery}
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Divider />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: 500, mb: 3 }}
                      >
                        Data
                      </Typography>

                      <FormDatePicker
                        name="appointmentDate"
                        label="Data do Agendamento"
                        required
                        fullWidth
                        disablePast
                        value={values.appointmentDate}
                        onChange={(date) =>
                          setFieldValue("appointmentDate", date)
                        }
                        onBlur={handleBlur}
                        error={
                          touched.appointmentDate &&
                          Boolean(errors.appointmentDate)
                        }
                        helperText={
                          touched.appointmentDate && errors.appointmentDate
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: 500 }}
                      >
                        Horário
                      </Typography>

                      <Box>
                        <Box sx={{ mb: 1 }}>
                          <TextField
                            name="appointmentTime"
                            label="Horário do Agendamento"
                            variant="outlined"
                            fullWidth
                            value={values.appointmentTime}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={
                              touched.appointmentTime &&
                              Boolean(errors.appointmentTime)
                            }
                            helperText={
                              touched.appointmentTime && errors.appointmentTime
                            }
                            InputProps={{
                              startAdornment: (
                                <AccessTimeIcon color="action" sx={{ mr: 1 }} />
                              ),
                              readOnly: true,
                            }}
                          />
                        </Box>

                        {selectedDate ? (
                          appointmentLoading ? (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                py: 2,
                              }}
                            >
                              <CircularProgress size={24} />
                            </Box>
                          ) : availableTimes.length > 0 ? (
                            <Paper
                              variant="outlined"
                              sx={{
                                p: 2,
                                mt: 1,
                                maxHeight: 200,
                                overflowY: "auto",
                              }}
                            >
                              <Typography variant="subtitle2" gutterBottom>
                                Horários Disponíveis
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {availableTimes.map((time) => (
                                  <Chip
                                    key={time}
                                    label={time}
                                    onClick={() => handleTimeSelect(time)}
                                    color={
                                      values.appointmentTime === time
                                        ? "primary"
                                        : "default"
                                    }
                                    icon={<AccessTimeIcon />}
                                    clickable
                                  />
                                ))}
                              </Box>
                            </Paper>
                          ) : (
                            <FormHelperText sx={{ mt: 1 }}>
                              Não há horários disponíveis para esta data. Por
                              favor, selecione outra data.
                            </FormHelperText>
                          )
                        ) : (
                          <FormHelperText sx={{ mt: 1 }}>
                            Selecione uma data para ver os horários disponíveis.
                          </FormHelperText>
                        )}
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Divider />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        sx={{ fontWeight: 500 }}
                      >
                        Observações
                      </Typography>

                      <FormTextarea
                        name="observations"
                        label="Observações"
                        placeholder="Adicione observações sobre este agendamento"
                        minRows={3}
                        maxRows={5}
                        value={values.observations}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          touched.observations && Boolean(errors.observations)
                        }
                        helperText={touched.observations && errors.observations}
                      />
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
                      disabled={!isValid || isLoading}
                    >
                      {isEditMode ? "Atualizar" : "Agendar"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default AppointmentFormPage;
