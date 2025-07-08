import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    IconButton,
    InputAdornment,
    Container,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Person,
    HowToReg as RegisterIcon,
    CheckCircle,
    Cancel,
} from '@mui/icons-material';
import { useThemeStore } from '../../application/stores/themeStore';
import { useNavigate } from 'react-router-dom';

const passwordChecks = [
    {
        label: 'Al menos 8 caracteres',
        test: (v: string) => v.length >= 8,
    },
    {
        label: 'Al menos una mayúscula',
        test: (v: string) => /[A-Z]/.test(v),
    },
    {
        label: 'Al menos un símbolo',
        test: (v: string) => /[^A-Za-z0-9]/.test(v),
    },
];

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { mode, toggleTheme } = useThemeStore();
    const navigate = useNavigate();

    const isEmailValid = (email: string) => /.+@.+\..+/.test(email);
    const passwordValid = passwordChecks.every((c) => c.test(password));
    const isFirstNameValid = firstName.trim().length > 0;
    const isLastNameValid = lastName.trim().length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!isEmailValid(email)) {
            setError('El email no es válido');
            return;
        }
        if (!passwordValid) {
            setError('La contraseña no cumple los requisitos');
            return;
        }
        setIsLoading(true);
        // Aquí iría la llamada al endpoint de registro
        setTimeout(() => {
            setIsLoading(false);
            navigate('/login');
        }, 1500);
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                bgcolor: 'background.default',
            }}
        >
            {/* Botón de tema */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 32,
                    right: 32,
                    zIndex: 10,
                }}
            >
                <IconButton
                    onClick={toggleTheme}
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 2,
                        '&:hover': {
                            bgcolor: 'background.paper',
                            boxShadow: 4,
                        },
                    }}
                >
                    {mode === 'light' ? '🌙' : '☀️'}
                </IconButton>
            </Box>

            <Container maxWidth="sm" sx={{ p: 0 }}>
                <Card
                    elevation={8}
                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        borderRadius: 3,
                        overflow: 'hidden',
                        position: 'relative',
                        mx: 'auto',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 4,
                            background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
                        },
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        {/* Logo/Título */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 2,
                                    boxShadow: 3,
                                }}
                            >
                                <RegisterIcon sx={{ fontSize: 40, color: 'white' }} />
                            </Box>
                            <Typography variant="h4" component="h1" gutterBottom>
                                Crear cuenta
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Completa tus datos para registrarte
                            </Typography>
                        </Box>

                        {/* Formulario */}
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <TextField
                                fullWidth
                                label="Correo electrónico"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                margin="normal"
                                required
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email color="action" />
                                            </InputAdornment>
                                        ),
                                    }
                                }}

                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                margin="normal"
                                required
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                }}
                            />

                            {/* Requisitos de contraseña */}
                            <List dense sx={{ mb: 2 }}>
                                {passwordChecks.map((check) => {
                                    const passed = check.test(password);
                                    return (
                                        <ListItem key={check.label} sx={{ py: 0 }}>
                                            <ListItemIcon sx={{ minWidth: 32 }}>
                                                {passed ? (
                                                    <CheckCircle color="success" fontSize="small" />
                                                ) : (
                                                    <Cancel color="disabled" fontSize="small" />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={check.label}
                                                sx={{
                                                    textDecoration: passed ? 'line-through' : 'none',
                                                    color: passed ? 'success.main' : 'text.secondary',
                                                }}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </List>

                            <TextField
                                fullWidth
                                label="Nombre"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                margin="normal"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="action" />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Apellido"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                margin="normal"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Person color="action" />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2, py: 1.5, fontWeight: 600, fontSize: 18 }}
                                disabled={isLoading || !isEmailValid(email) || !passwordValid || !isFirstNameValid || !isLastNameValid}
                            >
                                {isLoading ? 'Registrando...' : 'Registrarse'}
                            </Button>

                            <Button
                                fullWidth
                                sx={{ mt: 1 }}
                                onClick={() => navigate('/login')}
                                color="secondary"
                            >
                                ¿Ya tienes cuenta? Inicia sesión
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default RegisterPage; 