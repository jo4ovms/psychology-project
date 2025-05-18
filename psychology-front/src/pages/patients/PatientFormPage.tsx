import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useTheme,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";
import FormInput from "../../components/form/FormInput";
import FormPhoneInput from "../../components/form/FormPhoneInput";
import FormDatePicker from "../../components/form/FormDatePicker";
import FormCepInput from "../../components/form/FormCepInput";

import { useToast } from "../../contexts/ToastContext";
import { patientSchema } from "../../utils/validationSchemas";

import { CreatePatientDTO, UpdatePatientDTO } from "../../types/dtos";
import { Location } from "../../types/models";
import usePatientStore from "../../stores/patientStore";

const steps = ["Dados Pessoais", "Contato", "Endereço"];

type PatientFormData = CreatePatientDTO;

const PatientFormPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const isEditMode = !!id;

  const {
    selectedPatient,
    fetchPatientById,
    createPatient,
    updatePatient,
    isLoading,
  } = usePatientStore();

  const [activeStep, setActiveStep] = useState(0);
  const [useSameAddress, setUseSameAddress] = useState(true);

  const initialValues: PatientFormData = {
    firstName: "",
    lastName: "",
    cpf: "",
    birthDate: "",
    homeZipCode: "",
    homeStreet: "",
    homeNumber: "",
    homeNeighborhood: "",
    homeState: "",
    homeCity: "",
    useSameAddress: true,
    phone: "",
    whatsapp: "",
    email: "",
  };

  useEffect(() => {
    if (isEditMode && id) {
      fetchPatientById(parseInt(id));
    }
  }, [isEditMode, id, fetchPatientById]);

  const loadPatientData = () => {
    if (isEditMode && selectedPatient) {
      return {
        firstName: selectedPatient.firstName,
        lastName: selectedPatient.lastName,
        cpf: selectedPatient.cpf,
        birthDate: selectedPatient.birthDate,
        homeZipCode: selectedPatient.homeZipCode,
        homeStreet: selectedPatient.homeStreet,
        homeNumber: selectedPatient.homeNumber,
        homeNeighborhood: selectedPatient.homeNeighborhood,
        homeState: selectedPatient.homeState,
        homeCity: selectedPatient.homeCity,
        useSameAddress: selectedPatient.useSameAddress,
        workZipCode: selectedPatient.workZipCode || "",
        workStreet: selectedPatient.workStreet || "",
        workNumber: selectedPatient.workNumber || "",
        workNeighborhood: selectedPatient.workNeighborhood || "",
        workState: selectedPatient.workState || "",
        workCity: selectedPatient.workCity || "",
        phone: selectedPatient.phone,
        whatsapp: selectedPatient.whatsapp || "",
        email: selectedPatient.email || "",
      };
    }
    return initialValues;
  };

  const onSubmit = async (
    data: PatientFormData,
    { setSubmitting }: FormikHelpers<PatientFormData>
  ) => {
    try {
      if (isEditMode && id) {
        const updateData: UpdatePatientDTO = { ...data };
        await updatePatient(parseInt(id), updateData);
        toast.success("Paciente atualizado com sucesso!");
      } else {
        await createPatient(data);
        toast.success("Paciente cadastrado com sucesso!");
      }

      navigate("/patients");
    } catch (error) {
      toast.error(
        "Erro ao salvar paciente. Verifique os dados e tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const getStepContent = (step: number, formikProps: any) => {
    const { values, errors, touched, setFieldValue, handleChange, handleBlur } =
      formikProps;

    const handleAddressFound = (address: Location) => {
      setFieldValue("homeStreet", address.street, true);
      setFieldValue("homeNeighborhood", address.neighborhood, true);
      setFieldValue("homeCity", address.city, true);
      setFieldValue("homeState", address.state, true);
    };

    const handleWorkAddressFound = (address: Location) => {
      setFieldValue("workStreet", address.street, true);
      setFieldValue("workNeighborhood", address.neighborhood, true);
      setFieldValue("workCity", address.city, true);
      setFieldValue("workState", address.state, true);
    };

    const handleUseSameAddressChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const checked = event.target.checked;
      setUseSameAddress(checked);
      setFieldValue("useSameAddress", checked, true);

      if (checked) {
        setFieldValue("workZipCode", values.homeZipCode, true);
        setFieldValue("workStreet", values.homeStreet, true);
        setFieldValue("workNumber", values.homeNumber, true);
        setFieldValue("workNeighborhood", values.homeNeighborhood, true);
        setFieldValue("workCity", values.homeCity, true);
        setFieldValue("workState", values.homeState, true);
      }
    };

    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormInput
                name="firstName"
                label="Nome"
                required
                fullWidth
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormInput
                name="lastName"
                label="Sobrenome"
                required
                fullWidth
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormInput
                name="cpf"
                label="CPF"
                required
                fullWidth
                placeholder="000.000.000-00"
                disabled={isEditMode}
                value={values.cpf}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cpf && Boolean(errors.cpf)}
                helperText={touched.cpf && errors.cpf}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormDatePicker
                name="birthDate"
                label="Data de Nascimento"
                required
                fullWidth
                disableFuture
                value={values.birthDate}
                onChange={(date) => setFieldValue("birthDate", date, true)}
                onBlur={handleBlur}
                error={touched.birthDate && Boolean(errors.birthDate)}
                helperText={touched.birthDate && errors.birthDate}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormPhoneInput
                name="phone"
                label="Telefone"
                required
                fullWidth
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormPhoneInput
                name="whatsapp"
                label="WhatsApp"
                isWhatsApp
                fullWidth
                value={values.whatsapp}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.whatsapp && Boolean(errors.whatsapp)}
                helperText={touched.whatsapp && errors.whatsapp}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormInput
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                fullWidth
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Endereço Residencial
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormCepInput
                  name="homeZipCode"
                  label="CEP"
                  required
                  fullWidth
                  value={values.homeZipCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.homeZipCode && Boolean(errors.homeZipCode)}
                  helperText={touched.homeZipCode && errors.homeZipCode}
                  onAddressFound={handleAddressFound}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormInput
                  name="homeStreet"
                  label="Rua"
                  required
                  fullWidth
                  value={values.homeStreet}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.homeStreet && Boolean(errors.homeStreet)}
                  helperText={touched.homeStreet && errors.homeStreet}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <FormInput
                  name="homeNumber"
                  label="Número"
                  required
                  fullWidth
                  value={values.homeNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.homeNumber && Boolean(errors.homeNumber)}
                  helperText={touched.homeNumber && errors.homeNumber}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormInput
                  name="homeNeighborhood"
                  label="Bairro"
                  required
                  fullWidth
                  value={values.homeNeighborhood}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.homeNeighborhood && Boolean(errors.homeNeighborhood)
                  }
                  helperText={
                    touched.homeNeighborhood && errors.homeNeighborhood
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <FormInput
                  name="homeCity"
                  label="Cidade"
                  required
                  fullWidth
                  value={values.homeCity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.homeCity && Boolean(errors.homeCity)}
                  helperText={touched.homeCity && errors.homeCity}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormInput
                  name="homeState"
                  label="Estado"
                  required
                  fullWidth
                  value={values.homeState}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.homeState && Boolean(errors.homeState)}
                  helperText={touched.homeState && errors.homeState}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useSameAddress}
                    onChange={handleUseSameAddressChange}
                    color="primary"
                    name="useSameAddress"
                  />
                }
                label="Usar o mesmo endereço para trabalho"
              />
            </Box>

            {!useSameAddress && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Endereço de Trabalho
                </Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormCepInput
                      name="workZipCode"
                      label="CEP"
                      fullWidth
                      value={values.workZipCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.workZipCode && Boolean(errors.workZipCode)}
                      helperText={touched.workZipCode && errors.workZipCode}
                      onAddressFound={handleWorkAddressFound}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <FormInput
                      name="workStreet"
                      label="Rua"
                      fullWidth
                      value={values.workStreet}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.workStreet && Boolean(errors.workStreet)}
                      helperText={touched.workStreet && errors.workStreet}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2 }}>
                    <FormInput
                      name="workNumber"
                      label="Número"
                      fullWidth
                      value={values.workNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.workNumber && Boolean(errors.workNumber)}
                      helperText={touched.workNumber && errors.workNumber}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <FormInput
                      name="workNeighborhood"
                      label="Bairro"
                      fullWidth
                      value={values.workNeighborhood}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.workNeighborhood &&
                        Boolean(errors.workNeighborhood)
                      }
                      helperText={
                        touched.workNeighborhood && errors.workNeighborhood
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <FormInput
                      name="workCity"
                      label="Cidade"
                      fullWidth
                      value={values.workCity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.workCity && Boolean(errors.workCity)}
                      helperText={touched.workCity && errors.workCity}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <FormInput
                      name="workState"
                      label="Estado"
                      fullWidth
                      value={values.workState}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.workState && Boolean(errors.workState)}
                      helperText={touched.workState && errors.workState}
                    />
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box>
      <PageHeader
        title={isEditMode ? "Editar Paciente" : "Novo Paciente"}
        subtitle={
          isEditMode && selectedPatient
            ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
            : "Preencha os dados para cadastrar um novo paciente"
        }
        icon={<PersonIcon fontSize="large" color="primary" />}
        backTo="/patients"
        showBackButton
      />

      {isLoading && <LoadingOverlay open fullScreen />}

      <Formik
        initialValues={loadPatientData()}
        validationSchema={patientSchema}
        onSubmit={onSubmit}
        enableReinitialize={true}
      >
        {(formikProps) => (
          <Form>
            <Card>
              <CardContent>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>

                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 1,
                  }}
                >
                  {getStepContent(activeStep, formikProps)}
                </Paper>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                  }}
                >
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ArrowBackIcon />}
                  >
                    Voltar
                  </Button>

                  <Box>
                    {activeStep === steps.length - 1 ? (
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        startIcon={<SaveIcon />}
                        disabled={formikProps.isSubmitting || isLoading}
                      >
                        {isEditMode ? "Atualizar" : "Cadastrar"}
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        endIcon={<ArrowForwardIcon />}
                      >
                        Próximo
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default PatientFormPage;
