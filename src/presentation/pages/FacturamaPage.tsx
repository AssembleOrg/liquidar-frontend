import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, ToggleButton, ToggleButtonGroup, Accordion, AccordionSummary, AccordionDetails, Chip } from '@mui/material';
import AppBarCustom from '../components/AppBarCustom';
import HbsDocumentViewer from '../components/HbsDocumentViewer';
import ItemsDialog from '../components/ItemsDialog';
import type { Item } from '../components/ItemsDialog';
import AddIcon from '@mui/icons-material/Add';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { UNIDADES_AFIP } from '../components/ItemsDialog';
import { useAuthStore, type User } from '../../application/stores/authStore';
import type { BillItem } from '../../shared/types';
import { apiService } from '../../infrastructure/services/apiService';
import type { ApiResponse } from '../../infrastructure/responses/ApiResponse.type';
import { validateUUID } from '../../shared/functions/validation';
import { enqueueSnackbar } from 'notistack';

const initialData = {
    emisor: {
        razonSocial: 'Empresa Demo S.A.',
        direccion: 'Calle Falsa 123',
        cuit: '30-12345678-9',
        condicionIva: 'Responsable Inscripto',
        iibb: '123456',
        inicioActividad: '2020-01-01',
    },
    comprobante: {
        letra: 'A',
        puntoVenta: '0001',
        numero: '00000001',
        fecha: '2024-01-01',
        periodoDesde: '2024-01-01',
        periodoHasta: '2024-01-31',
        vtoPago: '2024-02-10',
    },
    receptor: {
        cuit: '20-87654321-0',
        razonSocial: 'Cliente Ejemplo',
        condicionIva: 'Consumidor Final',
        direccion: 'Av. Siempreviva 742',
        condicionVenta: 'Contado',
    },
    items: [
        /*  {
             codigo: 'P001',
             descripcion: 'Producto de ejemplo',
             cantidad: 1,
             unidad: 'Uni',
             precioUnitario: 100,
             porcentajeBonif: 0,
             importeBonif: 0,
             subtotal: 100,
         }, */
    ],
    totales: {
        subtotal: 100,
        iva: 21,
        total: 121,
    },
};

interface Emisor {
    razonSocial: string;
    direccion: string;
    cuit: string;
    condicionIva: string;
    iibb: string;
    inicioActividad: string;
}
interface Receptor {
    cuit: string;
    razonSocial: string;
    condicionIva: string;
    direccion: string;
    condicionVenta: string;
}

interface Comprobante {
    letra: string;
    puntoVenta: string;
    numero: string;
    fecha: string;
    periodoDesde: string;
    periodoHasta: string;
    vtoPago: string;
}

interface Totales {
    subtotal: number;
    iva: number;
    total: number;
}

interface FormData {
    emisor: Emisor;
    receptor: Receptor;
    items: Item[];
    totales: Totales;
    comprobante: Comprobante;
}

const FacturamaPage: React.FC = () => {
    const [formData, setFormData] = useState<FormData>(initialData);
    const [template, setTemplate] = useState<'factura' | 'ticket'>('factura');
    const [expandedSection, setExpandedSection] = useState<'comprobante' | 'emisor' | 'receptor' | 'totales' | false>('receptor');
    const [itemsDialogOpen, setItemsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCuit, setIsLoadingCuit] = useState(false);
    const [billItems, setBillItems] = useState<BillItem[]>([]);

    const fetchBillItems = async (user: User) => {
        const response = await apiService.get<ApiResponse<BillItem[]>>(`/general/user/${user.id}`);
        if (response.status === 'success') {
            setBillItems(response.data);
        }
    }
    const { user, setUser } = useAuthStore();

    useEffect(() => {
        if (user) {
            if (!validateUUID(user.id)) {
                enqueueSnackbar('Error al cargar los facturadores', { variant: 'error' });
                return;
            }
            setIsLoading(true);
          /*   fetchBillItems(user).then(() => {
                setUser({ ...user, billItems });
            }).catch((error) => {
                console.log(error);
            }).finally(() => {
                setIsLoading(false);
            }); */
        }
    }, []);

    // Handlers para campos simples
    const handleChange = <T extends keyof typeof formData>(section: T, field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                [field]: e.target.value,
            },
        });
    };

    // Handler para totales
    const handleTotalChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            totales: {
                ...formData.totales,
                [field]: e.target.value,
            },
        });
    };

    // Calcular subtotal de items
    const itemsSubtotal = formData.items.reduce((acc, item) => acc + (Number(item.subtotal) || 0), 0);
    // Calcular total automáticamente
    const subtotal = itemsSubtotal;
    const iva = Number(formData.totales.iva) || 0;
    const total = subtotal + (subtotal * iva / 100);

    // Sincronizar el subtotal y total calculado con el formData para el HBS
    useEffect(() => {
        if (formData.totales.subtotal !== subtotal || formData.totales.total !== total) {
            setFormData((prev) => ({
                ...prev,
                totales: {
                    ...prev.totales,
                    subtotal: subtotal,
                    total: total,
                },
            }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subtotal, iva, total, formData.items]);

    // Items Dialog
    const handleItemsSave = (items: Item[]) => {
        setFormData({ ...formData, items });
    };

    const handleTemplateChange = (_: any, newTemplate: 'factura' | 'ticket') => {
        if (newTemplate) setTemplate(newTemplate);
    };

    return (
        <Box sx={{
            minHeight: 0,
            height: '100vh',
            width: '100vw',
            bgcolor: 'background.default',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
        }}>
            <AppBarCustom title="Facturama" />
            <Box sx={{ flex: 1, minHeight: 0, height: '100%', width: '100%', p: 2, display: 'flex' }}>
                <HbsDocumentViewer template={template} data={{
                    ...formData,
                    items: formData.items.map(item => ({
                        ...item,
                        unidadDesc: (UNIDADES_AFIP.find((u: { codigo: string; descripcion: string }) => u.codigo === item.unidad)?.descripcion || item.unidad)
                    }))
                }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <ToggleButtonGroup
                            value={template}
                            exclusive
                            onChange={handleTemplateChange}
                            size="small"
                            color="primary"
                            fullWidth
                            sx={{ width: '100%' }}
                        >
                            <ToggleButton value="factura" sx={{ flex: 1 }}>
                                <DescriptionIcon sx={{ mr: 1 }} /> Factura
                            </ToggleButton>
                            <ToggleButton value="ticket" sx={{ flex: 1 }}>
                                <ReceiptLongIcon sx={{ mr: 1 }} /> Ticket
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Accordion expanded={expandedSection === 'comprobante'} onChange={() => setExpandedSection(expandedSection === 'comprobante' ? false : 'comprobante')}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Comprobante</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField label="Letra" value={formData.comprobante.letra} onChange={handleChange('comprobante', 'letra')} fullWidth margin="dense" />
                            <TextField label="Punto de Venta" value={formData.comprobante.puntoVenta} onChange={handleChange('comprobante', 'puntoVenta')} fullWidth margin="dense" />
                            <TextField label="Número" value={formData.comprobante.numero} onChange={handleChange('comprobante', 'numero')} fullWidth margin="dense" />
                            <TextField label="Fecha" value={formData.comprobante.fecha} onChange={handleChange('comprobante', 'fecha')} fullWidth margin="dense" />
                            <TextField label="Período Desde" value={formData.comprobante.periodoDesde} onChange={handleChange('comprobante', 'periodoDesde')} fullWidth margin="dense" />
                            <TextField label="Período Hasta" value={formData.comprobante.periodoHasta} onChange={handleChange('comprobante', 'periodoHasta')} fullWidth margin="dense" />
                            <TextField label="Vto. Pago" value={formData.comprobante.vtoPago} onChange={handleChange('comprobante', 'vtoPago')} fullWidth margin="dense" />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion expanded={expandedSection === 'emisor'} onChange={() => setExpandedSection(expandedSection === 'emisor' ? false : 'emisor')}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Datos del Emisor</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField label="CUIT" value={formData.emisor.cuit} onChange={handleChange('emisor', 'cuit')} fullWidth margin="dense" />
                            <TextField label="Razón Social" value={formData.emisor.razonSocial} onChange={handleChange('emisor', 'razonSocial')} fullWidth margin="dense" />
                            <TextField label="Dirección" value={formData.emisor.direccion} onChange={handleChange('emisor', 'direccion')} fullWidth margin="dense" />
                            <TextField label="Condición IVA" value={formData.emisor.condicionIva} onChange={handleChange('emisor', 'condicionIva')} fullWidth margin="dense" />
                            <TextField label="IIBB" value={formData.emisor.iibb} onChange={handleChange('emisor', 'iibb')} fullWidth margin="dense" />
                            <TextField label="Inicio Actividad" value={formData.emisor.inicioActividad} onChange={handleChange('emisor', 'inicioActividad')} fullWidth margin="dense" />
                        </AccordionDetails>
                    </Accordion>

                    <Accordion expanded={expandedSection === 'receptor'} onChange={() => setExpandedSection(expandedSection === 'receptor' ? false : 'receptor')}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Receptor</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField label="CUIT" value={formData.receptor.cuit} onChange={handleChange('receptor', 'cuit')} fullWidth margin="dense" />
                            <TextField label="Razón Social" value={formData.receptor.razonSocial} onChange={handleChange('receptor', 'razonSocial')} fullWidth margin="dense" />
                            <TextField label="Condición IVA" value={formData.receptor.condicionIva} onChange={handleChange('receptor', 'condicionIva')} fullWidth margin="dense" />
                            <TextField label="Dirección" value={formData.receptor.direccion} onChange={handleChange('receptor', 'direccion')} fullWidth margin="dense" />
                            <TextField label="Condición de Venta" value={formData.receptor.condicionVenta} onChange={handleChange('receptor', 'condicionVenta')} fullWidth margin="dense" />
                        </AccordionDetails>
                    </Accordion>

                    <Box sx={{ my: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                            label={`${formData.items.length} item${formData.items.length !== 1 ? 's' : ''} cargado${formData.items.length !== 1 ? 's' : ''}`}
                            color="info"
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                        />
                        <Button variant="outlined" onClick={() => setItemsDialogOpen(true)} startIcon={<AddIcon />}>
                            Cargar/Editar Items
                        </Button>
                    </Box>

                    <Accordion expanded={expandedSection === 'totales'} onChange={() => setExpandedSection(expandedSection === 'totales' ? false : 'totales')}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>Totales</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField label="Subtotal" value={subtotal} fullWidth margin="dense" disabled />
                            <TextField label="IVA (%)" value={formData.totales.iva} onChange={handleTotalChange('iva')} fullWidth margin="dense" />
                            <TextField label="Total" value={total.toFixed(2)} fullWidth margin="dense" disabled />
                        </AccordionDetails>
                    </Accordion>

                    <ItemsDialog
                        open={itemsDialogOpen}
                        items={formData.items}
                        onClose={() => setItemsDialogOpen(false)}
                        onSave={handleItemsSave}
                    />
                </HbsDocumentViewer>
            </Box>
        </Box>
    );
};

export default FacturamaPage; 