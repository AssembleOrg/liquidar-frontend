import React from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import AppBarCustom from '../components/AppBarCustom';

const ProfilePage: React.FC = () => (
    <Box sx={{
        minHeight: '100vh',
        width: '100vw',
        bgcolor: 'background.default',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
    }}>
        <AppBarCustom title="Perfil de Usuario" />
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Container maxWidth="sm">
                <Card sx={{ p: 2 }}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>
                            Perfil de Usuario
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Consulta y edita la información de tu perfil aquí.
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    </Box>
);

export default ProfilePage; 