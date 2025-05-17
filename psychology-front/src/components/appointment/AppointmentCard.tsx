import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Button,
  useTheme,
} from "@mui/material";
import { Appointment, AppointmentStatus } from "../../types/models";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import NotesIcon from "@mui/icons-material/Notes";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

interface StatusConfig {
  color:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
  label: string;
}

const getStatusConfig = (status: AppointmentStatus): StatusConfig => {
  switch (status) {
    case AppointmentStatus.AGENDADO:
      return { color: "primary", label: "Agendado" };
    case AppointmentStatus.EM_ANDAMENTO:
      return { color: "info", label: "Em Andamento" };
    case AppointmentStatus.CONCLUIDO:
      return { color: "success", label: "Concluído" };
    case AppointmentStatus.CANCELADO:
      return { color: "error", label: "Cancelado" };
    default:
      return { color: "default", label: "Desconhecido" };
  }
};

interface AppointmentCardProps {
  appointment: Appointment;
  onStatusChange?: (id: number, status: AppointmentStatus) => void;
  onCreateConsultation?: (appointmentId: number) => void;
  compact?: boolean;
  showPatientInfo?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onStatusChange,
  onCreateConsultation,
  compact = false,
  showPatientInfo = true,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const statusConfig = getStatusConfig(appointment.status);

  const today = new Date().toISOString().split("T")[0];
  const isToday = appointment.appointmentDate === today;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status: AppointmentStatus) => {
    handleMenuClose();
    if (onStatusChange) {
      onStatusChange(appointment.id, status);
    }
  };

  const handleCreateConsultation = () => {
    handleMenuClose();
    if (onCreateConsultation) {
      onCreateConsultation(appointment.id);
    } else {
      navigate(`/consultations/new?appointmentId=${appointment.id}`);
    }
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/appointments/${appointment.id}/edit`);
  };

  const handleViewDetails = () => {
    navigate(`/appointments/${appointment.id}`);
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        borderLeft: 6,
        borderColor:
          statusConfig.color === "default"
            ? theme.palette.grey[500]
            : theme.palette[statusConfig.color].main,
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-2px)",
        },
        position: "relative",
      }}
    >
      <CardContent sx={{ p: compact ? 2 : 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <AccessTimeIcon color="action" sx={{ mr: 1 }} />
              <Typography
                variant={compact ? "body1" : "h6"}
                component="span"
                fontWeight="medium"
              >
                {formatDate(appointment.appointmentDate)} às{" "}
                {formatTime(appointment.appointmentTime)}
              </Typography>

              {isToday && (
                <Chip
                  label="Hoje"
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>

            <Chip
              label={statusConfig.label}
              color={statusConfig.color}
              size={compact ? "small" : "medium"}
              sx={{ fontWeight: 500 }}
            />
          </Box>

          <IconButton
            aria-label="appointment actions"
            aria-controls={open ? "appointment-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            id="appointment-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "appointment-actions-button",
            }}
          >
            <MenuItem onClick={handleEdit}>
              <ListItemIcon>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Editar</ListItemText>
            </MenuItem>

            <Divider />

            {appointment.status === AppointmentStatus.AGENDADO && (
              <MenuItem
                onClick={() =>
                  handleStatusChange(AppointmentStatus.EM_ANDAMENTO)
                }
              >
                <ListItemIcon>
                  <PlayArrowIcon fontSize="small" color="info" />
                </ListItemIcon>
                <ListItemText>Iniciar Consulta</ListItemText>
              </MenuItem>
            )}

            {appointment.status === AppointmentStatus.EM_ANDAMENTO && (
              <MenuItem
                onClick={() => handleStatusChange(AppointmentStatus.CONCLUIDO)}
              >
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" color="success" />
                </ListItemIcon>
                <ListItemText>Concluir</ListItemText>
              </MenuItem>
            )}

            {(appointment.status === AppointmentStatus.AGENDADO ||
              appointment.status === AppointmentStatus.EM_ANDAMENTO) && (
              <MenuItem
                onClick={() => handleStatusChange(AppointmentStatus.CANCELADO)}
              >
                <ListItemIcon>
                  <CancelIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText>Cancelar</ListItemText>
              </MenuItem>
            )}

            {appointment.status === AppointmentStatus.EM_ANDAMENTO && (
              <>
                <Divider />
                <MenuItem onClick={handleCreateConsultation}>
                  <ListItemIcon>
                    <NotesIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText>Registrar Consulta</ListItemText>
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>

        {!compact && showPatientInfo && appointment.patient && (
          <>
            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" color="primary" gutterBottom>
              Paciente
            </Typography>

            <Typography variant="body1" gutterBottom>
              {appointment.patient.firstName} {appointment.patient.lastName}
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              {appointment.patient.phone}
            </Typography>

            {appointment.observations && (
              <>
                <Typography
                  variant="subtitle2"
                  color="primary"
                  gutterBottom
                  sx={{ mt: 1 }}
                >
                  Observações
                </Typography>

                <Typography variant="body2">
                  {appointment.observations}
                </Typography>
              </>
            )}
          </>
        )}

        {!compact && (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button variant="outlined" size="small" onClick={handleViewDetails}>
              Ver Detalhes
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
