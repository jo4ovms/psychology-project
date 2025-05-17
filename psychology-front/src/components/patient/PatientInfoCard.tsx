import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Grid,
  Button,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { Patient } from "../../types/models";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import { formatDate, calculateAge } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

interface PatientInfoCardProps {
  patient: Patient;
  showActions?: boolean;
  showAddress?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  patient,
  showActions = true,
  showAddress = true,
  compact = false,
  onClick,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const age = calculateAge(patient.birthDate);

  const fullName = `${patient.firstName} ${patient.lastName}`;

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/patients/${patient.id}/edit`);
  };

  const handleViewDetails = () => {
    navigate(`/patients/${patient.id}`);
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? {
              boxShadow: theme.shadows[4],
              transform: "translateY(-2px)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }
          : {},
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: compact ? 2 : 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonIcon
              color="primary"
              sx={{ fontSize: compact ? 32 : 40, mr: 1.5 }}
            />
            <Box>
              <Typography variant={compact ? "h6" : "h5"} component="h2">
                {fullName}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                <CalendarTodayIcon
                  fontSize="small"
                  color="action"
                  sx={{ mr: 0.5, fontSize: 16 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(patient.birthDate)} ({age} anos)
                </Typography>
              </Box>
            </Box>
          </Box>

          {showActions && (
            <Tooltip title="Editar Paciente">
              <IconButton size="small" onClick={handleEdit}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: showAddress ? 6 : 12 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Contato
            </Typography>

            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PhoneIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">{patient.phone}</Typography>
              </Box>

              {patient.whatsapp && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <WhatsAppIcon
                    fontSize="small"
                    color="success"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2">{patient.whatsapp}</Typography>
                </Box>
              )}

              {patient.email && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <EmailIcon fontSize="small" sx={{ mr: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: compact ? "180px" : "250px",
                    }}
                  >
                    {patient.email}
                  </Typography>
                </Box>
              )}
            </Box>
          </Grid>

          {showAddress && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Endereço
              </Typography>

              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <LocationOnIcon fontSize="small" sx={{ mr: 1, mt: 0.5 }} />
                <Typography variant="body2" component="div">
                  {patient.homeStreet}, {patient.homeNumber}
                  <br />
                  {patient.homeNeighborhood}
                  <br />
                  {patient.homeCity} - {patient.homeState}
                  <br />
                  CEP: {patient.homeZipCode}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {showActions && !compact && (
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

export default PatientInfoCard;
