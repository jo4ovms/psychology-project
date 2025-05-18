import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Avatar,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import EventIcon from "@mui/icons-material/Event";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssignmentIcon from "@mui/icons-material/Assignment";

import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";
import FormInput from "../../components/form/FormInput";

import { useAuth } from "../../contexts/AuthContext";

import { useToast } from "../../contexts/ToastContext";

import { UserRole } from "../../types/models";

interface ProfileFormData {
  name: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const toast = useToast();

  const { user, isLoading, updateProfile } = useAuth();

  const [tabValue, setTabValue] = useState(0);

  const [editMode, setEditMode] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      reset({
        name: user?.name || "",
        email: user?.email || "",
      });
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      toast.success("Perfil atualizado com sucesso!");
      setEditMode(false);
    } catch {
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Administrador";
      case UserRole.PROFISSIONAL_SAUDE:
        return "Profissional de Saúde";
      case UserRole.SECRETARIA:
        return "Secretária";
      default:
        return "Usuário";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
  };

  const getAvatarColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return theme.palette.error.main;
      case UserRole.PROFISSIONAL_SAUDE:
        return theme.palette.primary.main;
      case UserRole.SECRETARIA:
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box>
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais e veja estatísticas de atividade"
        icon={<AccountCircleIcon fontSize="large" color="primary" />}
      />

      {isLoading && <LoadingOverlay open fullScreen />}

      {user && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mx: "auto",
                    mb: 2,
                    bgcolor: getAvatarColor(user.role),
                    fontSize: 32,
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>

                <Typography variant="h5" gutterBottom>
                  {user.name}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>

                <Box sx={{ mt: 1, mb: 2 }}>
                  <Paper
                    variant="outlined"
                    sx={{
                      display: "inline-block",
                      py: 0.5,
                      px: 1.5,
                      borderRadius: 4,
                      bgcolor: getAvatarColor(user.role) + "22",
                      borderColor: getAvatarColor(user.role),
                    }}
                  >
                    <Typography variant="body2" fontWeight="medium">
                      {getRoleName(user.role)}
                    </Typography>
                  </Paper>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<LockIcon />}
                  onClick={handleChangePassword}
                  sx={{ mb: 1 }}
                >
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Estatísticas
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={1}>
                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ textAlign: "center", p: 1 }}>
                      <EventIcon color="primary" sx={{ mb: 1, fontSize: 28 }} />
                      <Typography variant="h5">12</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Agendamentos
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ textAlign: "center", p: 1 }}>
                      <EventAvailableIcon
                        color="info"
                        sx={{ mb: 1, fontSize: 28 }}
                      />
                      <Typography variant="h5">4</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hoje
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ textAlign: "center", p: 1 }}>
                      <PersonIcon
                        color="success"
                        sx={{ mb: 1, fontSize: 28 }}
                      />
                      <Typography variant="h5">24</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pacientes
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Box sx={{ textAlign: "center", p: 1 }}>
                      <AssignmentIcon
                        color="warning"
                        sx={{ mb: 1, fontSize: 28 }}
                      />
                      <Typography variant="h5">16</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Consultas
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            <Card sx={{ height: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="profile tabs"
                >
                  <Tab
                    icon={<PersonIcon />}
                    iconPosition="start"
                    label="Informações Pessoais"
                  />
                  <Tab
                    icon={<EventIcon />}
                    iconPosition="start"
                    label="Atividade Recente"
                  />
                </Tabs>
              </Box>

              <CardContent>
                {tabValue === 0 && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mb: 2,
                      }}
                    >
                      <Button
                        variant={editMode ? "contained" : "outlined"}
                        color={editMode ? "primary" : "inherit"}
                        startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                        onClick={
                          editMode ? handleSubmit(onSubmit) : toggleEditMode
                        }
                        disabled={editMode && (!isDirty || !isValid)}
                      >
                        {editMode ? "Salvar" : "Editar"}
                      </Button>
                    </Box>

                    <form onSubmit={handleSubmit(onSubmit)}>
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <PersonIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="medium">
                              Dados Pessoais
                            </Typography>
                          </Box>

                          <Divider sx={{ mb: 2 }} />

                          {editMode ? (
                            <FormInput
                              control={control}
                              name="name"
                              label="Nome Completo"
                              required
                              fullWidth
                            />
                          ) : (
                            <Box sx={{ mb: 3 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Nome Completo
                              </Typography>
                              <Typography variant="body1">
                                {user.name}
                              </Typography>
                            </Box>
                          )}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <EmailIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="medium">
                              Contato
                            </Typography>
                          </Box>

                          <Divider sx={{ mb: 2 }} />

                          {editMode ? (
                            <FormInput
                              control={control}
                              name="email"
                              label="Email"
                              type="email"
                              required
                              fullWidth
                            />
                          ) : (
                            <Box sx={{ mb: 3 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Email
                              </Typography>
                              <Typography variant="body1">
                                {user.email}
                              </Typography>
                            </Box>
                          )}
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <BadgeIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="medium">
                              Função
                            </Typography>
                          </Box>

                          <Divider sx={{ mb: 2 }} />

                          <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Perfil de Acesso
                            </Typography>
                            <Typography variant="body1">
                              {getRoleName(user.role)}
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <LockIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="medium">
                              Segurança
                            </Typography>
                          </Box>

                          <Divider sx={{ mb: 2 }} />

                          <Box sx={{ mb: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                              Senha
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Typography variant="body1" sx={{ mr: 2 }}>
                                ••••••••
                              </Typography>
                              <Button
                                variant="text"
                                size="small"
                                onClick={handleChangePassword}
                              >
                                Alterar Senha
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </form>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      gutterBottom
                    >
                      Atividade Recente
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "background.default",
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        align="center"
                      >
                        Histórico de atividades em implementação.
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ProfilePage;
