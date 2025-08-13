import { useState } from 'react';
import { 
  Container,
  Typography,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import CreditForm from './components/CreditForm';
import CreditList from './components/CreditList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#2c3e50',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '24px',
        },
      },
    },
  },
});

export default function App() {
  const [reload, setReload] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Encabezado centrado */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 4,
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Gestión de Créditos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Sistema integral para administración de créditos financieros
          </Typography>
        </Box>

        <Divider sx={{ my: 3, mx: 'auto', width: '80%' }} />

        {/* Contenedor principal centrado */}
        <Box 
          display="flex" 
          justifyContent="center"
          sx={{ width: '100%' }}
        >
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="flex-start"
            sx={{
              maxWidth: '1200px', // Ancho máximo del contenido
            }}
          >
            <Grid item xs={12} md={5} lg={4}>
              <Paper elevation={3}>
                <CreditForm onCreditAdded={() => setReload(!reload)} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={7} lg={8}>
              <Paper elevation={3}>
                <CreditList key={reload} reload={reload} />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  );
}