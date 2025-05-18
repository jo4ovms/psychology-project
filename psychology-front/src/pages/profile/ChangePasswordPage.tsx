import React, { useState } from "react";
import { Formik, Form } from "formik";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import LockIcon from "@mui/icons-material/Lock";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";
import FormInput from "../../components/form/FormInput";

import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { changePasswordSchema } from "../../utils/validationSchemas";

interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { changePassword, isLoading } = useAuth();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const initialValues: ChangePasswordFormData = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const handleToggleOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (
    values: ChangePasswordFormData,
    { resetForm }: any
  ) => {
    setError(null);

    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });

      toast.success("Senha alterada com sucesso!");
      resetForm();

      navigate("/profile");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro ao alterar senha. Tente novamente.");
      }
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <Box>
      <PageHeader
        title="Alterar Senha"
        subtitle="Atualize sua senha de acesso ao sistema"
        icon={<LockIcon fontSize="large" color="primary" />}
        backTo="/profile"
        showBackButton
      />

      {isLoading && <LoadingOverlay open fullScreen />}

      <Card>
        <CardContent>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={changePasswordSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isValid,
              dirty,
            }) => (
              <Form>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12 }}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      sx={{ fontWeight: 500 }}
                    >
                      Senha Atual
                    </Typography>

                    <FormInput
                      name="oldPassword"
                      label="Senha Atual"
                      type={showOldPassword ? "text" : "password"}
                      required
                      fullWidth
                      value={values.oldPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.oldPassword && Boolean(errors.oldPassword)}
                      helperText={touched.oldPassword && errors.oldPassword}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleToggleOldPassword}
                              edge="end"
                            >
                              {showOldPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
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
                      Nova Senha
                    </Typography>

                    <FormInput
                      name="newPassword"
                      label="Nova Senha"
                      type={showNewPassword ? "text" : "password"}
                      required
                      fullWidth
                      value={values.newPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.newPassword && Boolean(errors.newPassword)}
                      helperText={
                        (touched.newPassword && errors.newPassword) ||
                        "A senha deve ter pelo menos 8 caracteres"
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleToggleNewPassword}
                              edge="end"
                            >
                              {showNewPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <FormInput
                      name="confirmPassword"
                      label="Confirme a Nova Senha"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      fullWidth
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.confirmPassword &&
                        Boolean(errors.confirmPassword)
                      }
                      helperText={
                        touched.confirmPassword && errors.confirmPassword
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleToggleConfirmPassword}
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={!isValid || !dirty || isLoading}
                  >
                    Alterar Senha
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ChangePasswordPage;
