import React, { useState } from "react";
import { Formik, Form } from "formik";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Container,
  useTheme,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock,
  Email,
  Person,
} from "@mui/icons-material";
import { registerSchema } from "../../utils/validationSchemas";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import FormInput from "../../components/form/FormInput";
import FormSelect from "../../components/form/FormSelect";
import authService from "../../services/authService";
import { UserRole } from "../../types/models";

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
};

const RegisterPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const initialValues: RegisterFormData = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: UserRole.PROFISSIONAL_SAUDE,
  };

  const roleOptions = [
    { value: UserRole.PROFISSIONAL_SAUDE, label: "Profissional de Saúde" },
    { value: UserRole.SECRETARIA, label: "Secretaria" },
  ];

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleSubmit = async (
    values: RegisterFormData,
    { setSubmitting }: any
  ) => {
    try {
      setRegisterError(null);

      const { confirmPassword, ...registerData } = values;

      await authService.register(registerData);

      navigate("/login", {
        state: {
          registrationSuccess: true,
          email: values.email,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        setRegisterError(error.message);
      } else if (typeof error === "object" && error !== null) {
        setRegisterError("Ocorreu um erro ao tentar criar conta");
      } else {
        setRegisterError("Ocorreu um erro desconhecido");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor:
          theme.palette.mode === "dark"
            ? theme.palette.background.default
            : theme.palette.primary.light,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 2, boxShadow: theme.shadows[4] }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, textAlign: "center" }}
              >
                Consultório Psicológico
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: "text.secondary", textAlign: "center" }}
              >
                Crie sua conta para acessar o sistema
              </Typography>
            </Box>

            {registerError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {registerError}
              </Alert>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={registerSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isSubmitting,
                isValid,
              }) => (
                <Form>
                  <FormInput
                    name="name"
                    label="Nome completo"
                    placeholder="Digite seu nome completo"
                    fullWidth
                    margin="normal"
                    autoComplete="name"
                    autoFocus
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && Boolean(errors.name)}
                    helperText={touched.name && errors.name}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormInput
                    name="email"
                    label="Email"
                    placeholder="Digite seu email"
                    fullWidth
                    margin="normal"
                    autoComplete="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormInput
                    name="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    autoComplete="new-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password && Boolean(errors.password)}
                    helperText={touched.password && errors.password}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleTogglePassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormInput
                    name="confirmPassword"
                    label="Confirmar senha"
                    placeholder="Confirme sua senha"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    margin="normal"
                    autoComplete="new-password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.confirmPassword && Boolean(errors.confirmPassword)
                    }
                    helperText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock />
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

                  <FormSelect
                    name="role"
                    label="Tipo de Usuário"
                    options={roleOptions}
                    fullWidth
                    required
                    value={values.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.role && Boolean(errors.role)}
                    helperText={touched.role && errors.role}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                    disabled={isSubmitting || !isValid}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Cadastrar"
                    )}
                  </Button>
                </Form>
              )}
            </Formik>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ou
              </Typography>
            </Divider>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Já possui uma conta?
              </Typography>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
              >
                Fazer login
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="body2" color="white">
            &copy; {new Date().getFullYear()} Consultório Psicológico. Todos os
            direitos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;
