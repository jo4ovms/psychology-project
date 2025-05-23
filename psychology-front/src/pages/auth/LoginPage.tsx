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
  Link,
  Divider,
  CircularProgress,
  Container,
  useTheme,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, Lock, Email } from "@mui/icons-material";
import { loginSchema } from "../../utils/validationSchemas";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import FormInput from "../../components/form/FormInput";

type LoginFormData = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const initialValues: LoginFormData = {
    email: "",
    password: "",
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (values: LoginFormData) => {
    try {
      setLoginError(null);
      await login(values);

      const state = location.state as { from?: string };
      navigate(state?.from || "/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError("Ocorreu um erro ao tentar fazer login");
      }
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
                Faça login para acessar o sistema
              </Typography>
            </Box>

            {loginError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {loginError}
              </Alert>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={loginSchema}
              onSubmit={handleSubmit}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isValid,
              }) => (
                <Form>
                  <FormInput
                    name="email"
                    label="Email"
                    placeholder="Digite seu email"
                    fullWidth
                    margin="normal"
                    autoComplete="email"
                    autoFocus
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
                    autoComplete="current-password"
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

                  <Box sx={{ mt: 1, textAlign: "right" }}>
                    <Link
                      component={RouterLink}
                      to="/forgot-password"
                      variant="body2"
                      underline="hover"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ mt: 3, mb: 2, py: 1.5 }}
                    disabled={isLoading || !isValid}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Entrar"
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
                Ainda não tem uma conta?
              </Typography>
              <Button
                component={RouterLink}
                to="/register"
                variant="outlined"
                fullWidth
              >
                Cadastre-se
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

export default LoginPage;
