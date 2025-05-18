import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  ListItemIcon,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import PersonIcon from "@mui/icons-material/Person";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";

import PageHeader from "../../components/ui/PageHeader";
import LoadingOverlay from "../../components/feedback/LoadingOverlay";
import PatientInfoCard from "../../components/patient/PatientInfoCard";
import ConfirmationDialog from "../../components/feedback/ConfirmationDialog";

import { useToast } from "../../contexts/ToastContext";

import { formatDate, calculateAge } from "../../utils/dateUtils";

import { Patient } from "../../types/models";
import usePatientStore from "../../stores/patientStore";

enum ViewMode {
  LIST = "list",
  GRID = "grid",
}

const PatientsListPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const { patients, fetchPatients, deletePatient, isLoading, error } =
    usePatientStore();

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    if (!patients) return;

    if (!searchTerm) {
      setFilteredPatients(patients);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = patients.filter(
      (patient) =>
        patient.firstName.toLowerCase().includes(searchTermLower) ||
        patient.lastName.toLowerCase().includes(searchTermLower) ||
        patient.cpf.includes(searchTerm) ||
        patient.phone.includes(searchTerm) ||
        (patient.email && patient.email.toLowerCase().includes(searchTermLower))
    );

    setFilteredPatients(filtered);
  }, [patients, searchTerm]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
      display: "flex",
      minWidth: 200,
      renderCell: (params: GridRenderCellParams) => {
        if (!params || !params.row) return null;

        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <PersonIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {params.row.firstName} {params.row.lastName}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "cpf",
      headerName: "CPF",
      width: 150,
    },
    {
      field: "birthDate",
      display: "flex",
      headerName: "Data de Nascimento",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        if (!params || !params.row) return null;
        return <Typography>{formatDate(params.row.birthDate)}</Typography>;
      },
    },
    {
      field: "age",
      headerName: "Idade",
      display: "flex",
      width: 100,
      renderCell: (params: GridRenderCellParams) => {
        if (!params || !params.row) return null;
        return <Typography>{calculateAge(params.row.birthDate)}</Typography>;
      },
    },
    {
      field: "phone",
      headerName: "Telefone",
      display: "flex",
      width: 150,
      renderCell: (params: GridRenderCellParams) => {
        if (!params || !params.row) return null;
        return <Typography>{params.row.phone}</Typography>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      display: "flex",
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        if (!params || !params.row) return null;
        return <Typography>{params.row.email}</Typography>;
      },
    },
    {
      field: "actions",
      headerName: "Ações",
      width: 120,
      renderCell: (params) => {
        if (!params || !params.row) return null;

        return (
          <Box>
            <Tooltip title="Opções">
              <IconButton
                size="small"
                onClick={(event) => handleMenuOpen(event, params.row.id)}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  const handleViewModeChange = (
    _event: React.SyntheticEvent,
    newValue: ViewMode
  ) => {
    setViewMode(newValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    patientId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatientId(patientId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatientId(null);
  };

  const handleAddPatient = () => {
    navigate("/patients/new");
  };

  const handleEditPatient = () => {
    if (selectedPatientId) {
      navigate(`/patients/${selectedPatientId}/edit`);
    }
    handleMenuClose();
  };

  const handleViewPatient = () => {
    if (selectedPatientId) {
      navigate(`/patients/${selectedPatientId}`);
    }
    handleMenuClose();
  };

  const handleCreateAppointment = () => {
    if (selectedPatientId) {
      navigate(`/appointments/new?patientId=${selectedPatientId}`);
    }
    handleMenuClose();
  };

  const handleOpenDeleteDialog = () => {
    if (selectedPatientId) {
      const patient = patients.find((p) => p.id === selectedPatientId);
      if (patient) {
        setPatientToDelete(patient);
        setDeleteDialogOpen(true);
      }
    }
    handleMenuClose();
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setPatientToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (patientToDelete) {
      try {
        await deletePatient(patientToDelete.id);
        toast.success("Paciente excluído com sucesso");
        setDeleteDialogOpen(false);
        setPatientToDelete(null);
      } catch {
        toast.error("Erro ao excluir paciente");
      }
    }
  };

  const handlePatientCardClick = (patientId: number) => {
    navigate(`/patients/${patientId}`);
  };

  return (
    <Box>
      <PageHeader
        title="Pacientes"
        subtitle="Gerencie os pacientes do consultório"
        icon={<PersonIcon fontSize="large" color="primary" />}
        actions={[
          {
            label: "Novo Paciente",
            onClick: handleAddPatient,
            icon: <AddIcon />,
          },
        ]}
      />

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              size="small"
              sx={{ width: { xs: "100%", sm: "350px" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Filtros avançados">
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>

              <Tabs
                value={viewMode}
                onChange={handleViewModeChange}
                aria-label="view mode"
              >
                <Tab
                  icon={<ViewListIcon />}
                  value={ViewMode.LIST}
                  aria-label="list view"
                />
                <Tab
                  icon={<ViewModuleIcon />}
                  value={ViewMode.GRID}
                  aria-label="grid view"
                />
              </Tabs>
            </Box>
          </Box>

          {isLoading && <LoadingOverlay open />}

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              Erro ao carregar pacientes: {error}
            </Typography>
          )}

          {!isLoading && filteredPatients.length === 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 5,
              }}
            >
              <PersonIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nenhum paciente encontrado
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                align="center"
                sx={{ mb: 3 }}
              >
                {searchTerm
                  ? "Tente ajustar sua busca ou filtros para encontrar o que procura"
                  : "Parece que ainda não há pacientes cadastrados"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddPatient}
              >
                Cadastrar Paciente
              </Button>
            </Box>
          )}

          {!isLoading &&
            filteredPatients.length > 0 &&
            viewMode === ViewMode.LIST && (
              <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                  rows={filteredPatients}
                  columns={columns}
                  pageSizeOptions={[10, 25, 50]}
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10, page: 0 },
                    },
                  }}
                  disableRowSelectionOnClick
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                    },
                  }}
                />
              </div>
            )}

          {!isLoading &&
            filteredPatients.length > 0 &&
            viewMode === ViewMode.GRID && (
              <Grid container spacing={3}>
                {filteredPatients.map((patient) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={patient.id}>
                    <PatientInfoCard
                      patient={patient}
                      showAddress={false}
                      compact
                      onClick={() => handlePatientCardClick(patient.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewPatient}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Ver Detalhes
        </MenuItem>
        <MenuItem onClick={handleEditPatient}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Editar
        </MenuItem>
        <MenuItem onClick={handleCreateAppointment}>
          <ListItemIcon>
            <EventIcon fontSize="small" />
          </ListItemIcon>
          Agendar Consulta
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Excluir</Typography>
        </MenuItem>
      </Menu>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Excluir Paciente"
        message={
          patientToDelete
            ? `Tem certeza que deseja excluir o paciente ${patientToDelete.firstName} ${patientToDelete.lastName}? Esta ação não poderá ser desfeita.`
            : "Tem certeza que deseja excluir este paciente? Esta ação não poderá ser desfeita."
        }
        confirmButtonText="Excluir"
        cancelButtonText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        type="delete"
        loading={isLoading}
      />
    </Box>
  );
};

export default PatientsListPage;
