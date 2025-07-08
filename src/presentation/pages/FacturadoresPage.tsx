import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    Fab,
    TextField,
    FormControlLabel,
    Switch,
    IconButton,
    Chip,
    InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AppBarCustom from '../components/AppBarCustom';
import { useAuthStore, type User } from '../../application/stores/authStore';
import { useSnackbar } from 'notistack';
import type { BillItem } from '../../shared/types';
import { apiService } from '../../infrastructure/services/apiService';
import type { ApiResponse } from '../../infrastructure/responses/ApiResponse.type';
import { cleanCuit, formatCuit } from '../../shared/functions/formats';
import CenteredLoader from '../components/CenteredLoader';
import CustomDialog from '../components/CustomDialog';

const FacturadoresPage: React.FC = () => {
    const { user, setUser } = useAuthStore();
    const { enqueueSnackbar } = useSnackbar();
    const [billItems, setBillItems] = useState<BillItem[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [disableInput, setDisableInput] = useState(true);
    const [showPassword, setShowPassword] = useState(true);
    const [isLoadingCuit, setIsLoadingCuit] = useState(false);
    const [formData, setFormData] = useState({
        cuit: '',
        afipPassword: '',
        name: '',
        realPerson: false,
        address: '',
        phone: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setUser({ ...user, billItems });
        }
    }, [billItems]);

    useEffect(() => {
        console.log(user);
        if (user) {
            setBillItems(user.billItems);
        }
    }, []);

    // Función para limpiar CUIT (remover guiones)


    // Función para consultar datos del CUIT
    const consultarCuit = async (cuit: string) => {
        if (cuit.length !== 11) return;

        setIsLoadingCuit(true);
        try {
            const response = await apiService.get<{ status: string, data: any }>(`/external/afip/obtener-padron?cuit=${cuit}`);

            if (response.status === 'success') {
                const data = response.data;
                const name = data?.datosGenerales?.nombre + ' ' + data?.datosGenerales?.apellido || '';
                const razonSocial = data?.datosGenerales?.razonSocial || '';
                const realPerson = Boolean(data?.datosGenerales?.tipoPersona === 'FISICA');
                setDisableInput(true);
                // Autocompletar formulario
                setFormData(prev => ({
                    ...prev,
                    name: realPerson ? name : razonSocial,
                    realPerson,
                    address: data?.datosGenerales?.domicilioFiscal?.direccion || ''
                }));


                enqueueSnackbar('Datos del CUIT cargados exitosamente', { variant: 'success' });
            }
        } catch (error) {
            setDisableInput(false);
            enqueueSnackbar('Error al consultar el CUIT. Puedes completar los datos manualmente.', { variant: 'warning' });
        } finally {
            setIsLoadingCuit(false);
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            cuit: '',
            afipPassword: '',
            name: '',
            realPerson: false,
            address: '',
            phone: ''
        });
        setShowPassword(true);
        setIsLoadingCuit(false);
    };

    const handleInputChange = (field: keyof typeof formData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = field === 'realPerson' ? e.target.checked : e.target.value;

        if (field === 'cuit') {
            const cleanValue = cleanCuit(value as string);
            const formattedValue = formatCuit(cleanValue);

            setFormData(prev => ({
                ...prev,
                [field]: formattedValue
            }));

            // Consultar CUIT cuando tenga 11 dígitos
            if (cleanValue.length === 11) {
                consultarCuit(cleanValue);
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSubmit = async () => {
        // Validación básica
        if (!cleanCuit(formData.cuit) || !formData.afipPassword.trim() || !formData.name.trim() || !formData.address.trim()) {
            enqueueSnackbar('Todos los campos, menos el teléfono, son obligatorios', { variant: 'error' });
            return;
        }
        setIsLoading(true);
        enqueueSnackbar('Recuperando datos de afip...', { variant: 'info', autoHideDuration: 3000 });
        try {
            const body = {
                cuit: cleanCuit(formData.cuit),
                afipPassword: formData.afipPassword,
                name: formData.name,
                realPerson: formData.realPerson,
                address: formData.address,
                phone: formData.phone,
                userId: user?.id
            }
            const response = await apiService.post<ApiResponse<BillItem>>('/general/bill-item', body);
            if (response.status === 'success') {
                const newBillItem: BillItem = response.data;
                setBillItems(prev => [...prev, newBillItem]);
                enqueueSnackbar('Facturador agregado exitosamente', { variant: 'success' });
                handleCloseDialog();
            } else {
                enqueueSnackbar(response.message, { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar('Error en la solicitud, intenta nuevamente en unos minutos', { variant: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            width: '100vw',
            bgcolor: 'background.default',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <AppBarCustom title='Facturadores' />
            <Box sx={{ p: 3, pt: 10 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
                    Facturadores
                </Typography>

                {/* Animación de carga o grid de cards */}
                {isLoading ? (
                    <CenteredLoader loading={isLoading} text="Cargando facturadores..."  timeout={5000}/>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3, mb: 4 }}>
                        {billItems.map((item) => (
                            <Card
                                key={item.id}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        {item.realPerson ? (
                                            <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        ) : (
                                            <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        )}
                                        <Typography variant="h6" component="h2" noWrap>
                                            {item.name}
                                        </Typography>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>CUIT:</strong> {formatCuit(item.cuit)}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Dirección:</strong> {item.address || 'No especificada'}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        <strong>Teléfono:</strong> {item.phone || 'No especificado'}
                                    </Typography>

                                    <Box sx={{ mt: 2 }}>
                                        <Chip
                                            label={item.realPerson ? 'Persona Física' : 'Persona Jurídica'}
                                            size="small"
                                            color={item.realPerson ? 'primary' : 'secondary'}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}

                {/* Botón flotante para agregar */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Fab
                        color="primary"
                        aria-label="agregar facturador"
                        onClick={handleOpenDialog}
                        sx={{
                            position: 'fixed',
                            bottom: 24,
                            right: 24,
                            zIndex: 1000
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </Box>

                {/* Dialog para agregar facturador */}
                <CustomDialog
                    open={openDialog}
                    title="Agregar Facturador"
                    onClose={handleCloseDialog}
                    actions={
                        <>
                            <Button onClick={handleCloseDialog} disabled={isLoading}>Cancelar</Button>
                            <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
                                {isLoading ? 'Procesando...' : 'Agregar'}
                            </Button>
                        </>
                    }
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="CUIT"
                            value={formData.cuit}
                            onChange={handleInputChange('cuit')}
                            fullWidth
                            required
                            placeholder="XX-XXXXXXXX-X"
                            slotProps={{
                                htmlInput: {
                                    maxLength: 13
                                }
                            }}
                            disabled={isLoadingCuit || isLoading}
                            helperText={isLoadingCuit ? "Consultando datos del CUIT..." : ""}
                        />
                        <TextField
                            label="Clave Fiscal"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.afipPassword}
                            onChange={handleInputChange('afipPassword')}
                            fullWidth
                            required
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                            disabled={isLoading}
                        />
                        <TextField
                            label="Nombre o Razón Social"
                            value={formData.name}
                            fullWidth
                            required
                            disabled={disableInput || isLoading}
                            helperText="Se autocompleta desde AFIP"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.realPerson}
                                    disabled={disableInput || isLoading}
                                />
                            }
                            label="Persona Física"
                        />
                        <TextField
                            label="Dirección"
                            value={formData.address}
                            fullWidth
                            multiline
                            rows={2}
                            disabled={disableInput || isLoading}
                            helperText="Se autocompleta desde AFIP"
                        />
                        <TextField
                            label="Teléfono"
                            value={formData.phone}
                            onChange={handleInputChange('phone')}
                            fullWidth
                            disabled={isLoading}
                        />
                    </Box>
                </CustomDialog>
            </Box>
        </Box>
    );
};

export default FacturadoresPage; 