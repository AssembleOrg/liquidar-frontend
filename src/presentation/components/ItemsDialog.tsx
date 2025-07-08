import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    TextField,
    Box,
    Autocomplete
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useSnackbar } from 'notistack';

export interface Item {
    codigo: string;
    descripcion: string;
    cantidad: number;
    unidad: string;
    precioUnitario: number;
    porcentajeBonif: number;
    importeBonif: number;
    subtotal: number;
}

interface ItemsDialogProps {
    open: boolean;
    items: Item[];
    onClose: () => void;
    onSave: (items: Item[]) => void;
}

const emptyItem: Item = {
    codigo: '',
    descripcion: '',
    cantidad: 1,
    unidad: '07', // Unidad por defecto
    precioUnitario: 0,
    porcentajeBonif: 0,
    importeBonif: 0,
    subtotal: 0,
};

export const UNIDADES_AFIP = [
    { codigo: '01', descripcion: 'Kilogramo' },
    { codigo: '02', descripcion: 'Metro' },
    { codigo: '03', descripcion: 'Metro cuadrado' },
    { codigo: '04', descripcion: 'Metro cúbico' },
    { codigo: '05', descripcion: 'Litro' },
    { codigo: '06', descripcion: 'Kilowatt hora' },
    { codigo: '07', descripcion: 'Unidad' },
    { codigo: '08', descripcion: 'Par' },
    { codigo: '09', descripcion: 'Docena' },
    { codigo: '10', descripcion: 'Quilate' },
    { codigo: '11', descripcion: 'Millar' },
    { codigo: '14', descripcion: 'Gramo' },
    { codigo: '15', descripcion: 'Milímetro' },
    { codigo: '16', descripcion: 'Milímetro cúbico' },
    { codigo: '17', descripcion: 'Kilómetro' },
    { codigo: '18', descripcion: 'Hectolitro' },
    { codigo: '20', descripcion: 'Centímetro' },
    { codigo: 'JGO.PQT.MAZO', descripcion: 'Juego / Paquete / Mazo' },
    { codigo: '25', descripcion: 'Naipes' },
    { codigo: '27', descripcion: 'Centímetro cúbico' },
    { codigo: '29', descripcion: 'Tonelada' },
    { codigo: '30', descripcion: 'Decámetro cúbico' },
    { codigo: '31', descripcion: 'Hectómetro cúbico' },
    { codigo: '32', descripcion: 'Kilómetro cúbico' },
    { codigo: '33', descripcion: 'Microgramo' },
    { codigo: '34', descripcion: 'Nanogramo' },
    { codigo: '35', descripcion: 'Picogramo' },
    { codigo: '41', descripcion: 'Miligramo' },
    { codigo: '47', descripcion: 'Mililitro' },
    { codigo: '48', descripcion: 'Curie' },
    { codigo: '49', descripcion: 'Milicurie' },
    { codigo: '50', descripcion: 'Microcurie' },
    { codigo: '51', descripcion: 'Unidad Internacional de Actividad Hormonal' },
    { codigo: '52', descripcion: 'Mega Unidad Internacional de Actividad Hormonal' },
    { codigo: '53', descripcion: 'Kilogramo base' },
    { codigo: '54', descripcion: 'Gruesa' },
    { codigo: '61', descripcion: 'Kilogramo bruto' },
    { codigo: '62', descripcion: 'Unidad Internacional de Actividad para Antibióticos' },
    { codigo: '63', descripcion: 'Mega Unidad Internacional de Actividad para Antibióticos' },
    { codigo: '64', descripcion: 'Unidad Internacional de Actividad para Inmunoglobulinas' },
    { codigo: '65', descripcion: 'Mega Unidad Internacional de Actividad para Inmunoglobulinas' },
    { codigo: '66', descripcion: 'Kilogramo activo' },
    { codigo: '67', descripcion: 'Gramo activo' },
    { codigo: '68', descripcion: 'Gramo base' },
];

const ItemsDialog: React.FC<ItemsDialogProps> = ({ open, items, onClose, onSave }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [localItems, setLocalItems] = React.useState<Item[]>(items);

    React.useEffect(() => {
        if (open) setLocalItems(items);
    }, [open, items]);

    const handleChange = (idx: number, field: keyof Item) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalItems((prev) => {
            const updatedItems = prev.map((item, i) => {
                if (i === idx) {
                    let updatedItem: any = { ...item, [field]: value };
                    const cantidad = field === 'cantidad' ? value : String(item.cantidad);
                    const precioUnitario = field === 'precioUnitario' ? value : String(item.precioUnitario);
                    const porcentajeBonif = field === 'porcentajeBonif' ? value : String(item.porcentajeBonif);
                    if (cantidad !== '' && precioUnitario !== '' && porcentajeBonif !== '') {
                        const subtotalBruto = Number(cantidad) * Number(precioUnitario);
                        const importeBonif = subtotalBruto * (Number(porcentajeBonif) / 100);
                        const subtotal = subtotalBruto - importeBonif;
                        updatedItem.importeBonif = importeBonif;
                        updatedItem.subtotal = subtotal;
                    } else {
                        updatedItem.importeBonif = '';
                        updatedItem.subtotal = '';
                    }
                    return updatedItem;
                }
                return item;
            });
            return updatedItems;
        });
    };

    const handleAdd = () => {
        setLocalItems((prev) => [...prev, { ...emptyItem }]);
    };

    const handleRemove = (idx: number) => {
        setLocalItems((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleClose = () => {
        if (!localItems.length) {
            enqueueSnackbar('Debes cargar al menos un item.', { variant: 'warning' });
        }
        onClose();
    };

    const handleSave = () => {
        if (!localItems.length) {
            enqueueSnackbar('Debes cargar al menos un item.', { variant: 'warning' });
            onClose();
            return;
        }
        console.table(localItems);
        const hasInvalid = localItems.some(item =>
            !String(item.codigo).trim() ||
            !String(item.descripcion).trim() ||
            !String(item.unidad).trim() ||
            String(item.precioUnitario) === '' ||
            Number(item.precioUnitario) <= 0
        );
        if (hasInvalid) {
            enqueueSnackbar('Todos los campos son obligatorios y el precio unitario debe ser mayor a 0.', { variant: 'error' });
            onClose();
            return;
        }
        const parsedItems = localItems.map(item => ({
            ...item,
            cantidad: Number(item.cantidad),
            precioUnitario: Number(item.precioUnitario),
            porcentajeBonif: Number(item.porcentajeBonif),
            importeBonif: Number(item.importeBonif),
            subtotal: Number(item.subtotal),
        }));
        onSave(parsedItems);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xl"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        mt: 4,
                        borderRadius: 3,
                    },
                }
            }}
        >
            <DialogTitle>Editar Items</DialogTitle>
            <DialogContent>
                <Box sx={{ overflowX: 'auto' }}>
                    <Table size="medium">
                        <TableHead>
                            <TableRow>
                                <TableCell>Código</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Unidad</TableCell>
                                <TableCell>Precio Unit.</TableCell>
                                <TableCell>% Bonif.</TableCell>
                                <TableCell>Imp. Bonif.</TableCell>
                                <TableCell>Subtotal</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {localItems.map((item, idx) => (
                                <TableRow key={idx}>
                                    <TableCell>
                                        <TextField value={item.codigo} onChange={handleChange(idx, 'codigo')} size="small" />
                                    </TableCell>
                                    <TableCell sx={{
                                        width: '200px',
                                    }}>
                                        <TextField value={item.descripcion} onChange={handleChange(idx, 'descripcion')} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <TextField type="number" slotProps={{ htmlInput: { min: 1 } }} value={String(item.cantidad) === '' ? '' : item.cantidad} onChange={handleChange(idx, 'cantidad')} size="small" />
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                            width: '200px',
                                        }}
                                    >
                                        <Autocomplete
                                            options={UNIDADES_AFIP}
                                            getOptionLabel={option => option.descripcion}
                                            isOptionEqualToValue={(option, value) => option.codigo === value.codigo}
                                            value={UNIDADES_AFIP.find(u => u.codigo === item.unidad) || null}
                                            onChange={(_, newValue) => {
                                                handleChange(idx, 'unidad')({ target: { value: newValue ? newValue.codigo : '' } } as any);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Unidad" size="small" />}
                                            size="small"
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField type="number" slotProps={{ htmlInput: { min: 0 } }} value={String(item.precioUnitario) === '' ? '' : item.precioUnitario} onChange={handleChange(idx, 'precioUnitario')} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <TextField type="number" slotProps={{ htmlInput: { min: 0 } }} value={String(item.porcentajeBonif) === '' ? '' : item.porcentajeBonif} onChange={handleChange(idx, 'porcentajeBonif')} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <TextField type="number" slotProps={{ htmlInput: { min: 0 } }} value={String(item.importeBonif) === '' ? '' : Number(item.importeBonif).toFixed(2)} size="small" disabled />
                                    </TableCell>
                                    <TableCell>
                                        <TextField type="number" slotProps={{ htmlInput: { min: 0 } }} value={String(item.subtotal) === '' ? '' : Number(item.subtotal).toFixed(2)} size="small" disabled />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleRemove(idx)} color="error" size="small"><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
                <Button onClick={handleAdd} startIcon={<AddIcon />} size="small" sx={{ mt: 2 }}>
                    Agregar Item
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Guardar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ItemsDialog; 