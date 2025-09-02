import * as React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import logoNewStore from './Logo-branca-sem-fundo-768x132.png';
import { SelectionContext } from './selectionContext';
import { useAuth } from './authContext';
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Paper,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#67C23A' },
    secondary: { main: '#FFC107' },
    error: { main: '#D32F2F' },
    background: { default: '#0E0E0E', paper: '#121212' },
    success: { main: '#2E7D32' },
    warning: { main: '#B58900' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial'].join(','),
  },
});

const pad2 = (n) => n.toString().padStart(2, '0');

const MOCK_HISTORY = [
  { numero: 98, data: '04/02/2024', status: 'CONTEMPLADO' },
  { numero: 97, data: '21/03/2024', status: 'NÃO CONTEMPLADO' },
  { numero: 86, data: '28/01/2024', status: 'NÃO CONTEMPLADO' },
  { numero: 85, data: '27/01/2024', status: 'NÃO CONTEMPLADO' },
  { numero: 84, data: '04/03/2024', status: 'NÃO CONTEMPLADO' },
  { numero: 83, data: '08/03/2024', status: 'NÃO CONTEMPLADO' },
  { numero: 82, data: '10/03/2024', status: 'PENDENTE' }, // ficará primeiro
  { numero: 81, data: '29/02/2024', status: 'NÃO CONTEMPLADO' },
  { numero: 80, data: '28/02/2024', status: 'NÃO CONTEMPLADO' },
];

const StatusChip = ({ status }) => {
  if (status === 'CONTEMPLADO') {
    return <Chip label="CONTEMPLADO" sx={{ bgcolor: 'success.main', color: '#fff', fontWeight: 800, borderRadius: 999, px: 1.5 }} />;
  }
  if (status === 'PENDENTE') {
    return <Chip label="PENDENTE" sx={{ bgcolor: 'warning.main', color: '#000', fontWeight: 800, borderRadius: 999, px: 1.5 }} />;
  }
  return <Chip label="NÃO CONTEMPLADO" sx={{ bgcolor: 'error.main', color: '#fff', fontWeight: 800, borderRadius: 999, px: 1.5 }} />;
};

const sortPendingFirst = (rows) =>
  rows.slice().sort((a, b) => {
    const aP = a.status === 'PENDENTE';
    const bP = b.status === 'PENDENTE';
    if (aP && !bP) return -1;
    if (!aP && bP) return 1;
    return 0;
  });

export default function AccountPage() {
  const navigate = useNavigate();
  const { selecionados, limparSelecao } = React.useContext(SelectionContext);
  const { logout, isAuthenticated } = useAuth();

  // menu avatar
  const [menuEl, setMenuEl] = React.useState(null);
  const menuOpen = Boolean(menuEl);
  const handleOpenMenu = (e) => setMenuEl(e.currentTarget);
  const handleCloseMenu = () => setMenuEl(null);
  const doLogout = () => { handleCloseMenu(); logout(); navigate('/'); };

  const cliente = {
    nome: 'NOME DO CLIENTE',
    cupom: 'CUPOMAQUI',
    valorAcumulado: 65.0,
    validade: '28/10/25',
    posicoes: selecionados.length ? selecionados.slice(0, 6).map(pad2) : ['05','12','27','33','44','59'],
    premio: 'VOUCHER DE X EM COMPRAS NO SITE',
  };

  const history = React.useMemo(() => sortPendingFirst(MOCK_HISTORY), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Toolbar sx={{ position: 'relative', minHeight: 64 }}>
          <IconButton edge="start" color="inherit" onClick={() => navigate(-1)} aria-label="Voltar">
            <ArrowBackIosNewRoundedIcon />
          </IconButton>
          <Box
            component={RouterLink}
            to="/"
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box component="img" src={logoNewStore} alt="NEW STORE" sx={{ height: 40, objectFit: 'contain' }} />
          </Box>

          <IconButton color="inherit" sx={{ ml: 'auto' }} onClick={handleOpenMenu}>
            <AccountCircleRoundedIcon />
          </IconButton>
          <Menu
            anchorEl={menuEl}
            open={menuOpen}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {isAuthenticated && (
              <>
                <MenuItem onClick={() => { handleCloseMenu(); navigate('/conta'); }}>Área do cliente</MenuItem>
                <Divider />
                <MenuItem onClick={doLogout}>Sair</MenuItem>
              </>
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={3}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, letterSpacing: 1, textTransform: 'uppercase', display: { xs: 'none', md: 'block' }, opacity: 0.9 }}
          >
            NOME DO CLIENTE
          </Typography>

          {/* Cartão compacto */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Paper
              elevation={0}
              sx={{
                width: { xs: 'min(92vw, 420px)', sm: 'min(88vw, 500px)', md: '560px' },
                aspectRatio: '1.586 / 1',
                borderRadius: 5,
                position: 'relative',
                overflow: 'hidden',
                p: { xs: 1.5, sm: 2, md: 2.2 },
                bgcolor: '#181818',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundImage: `
                  radial-gradient(70% 120% at 35% 65%, rgba(255,255,255,0.20), transparent 60%),
                  radial-gradient(60% 120% at 80% 20%, rgba(255,255,255,0.10), transparent 60%),
                  radial-gradient(100% 140% at -10% 120%, rgba(0,0,0,0.45), transparent 60%)
                `,
                backgroundBlendMode: 'screen, lighten, normal',
              }}
            >
              <Box
                sx={{
                  pointerEvents: 'none',
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.08,
                  backgroundImage:
                    'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)',
                  backgroundSize: '3px 3px, 5px 5px',
                  backgroundPosition: '0 0, 10px 5px',
                }}
              />

              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1} sx={{ position: 'relative', height: '100%' }}>
                <Stack spacing={0.8} flex={1} minWidth={0}>
                  <Box>
                    <Typography variant="caption" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', letterSpacing: 1, opacity: 0.85, display: 'block' }}>
                      PRÊMIO: {cliente.premio}
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', letterSpacing: 1, opacity: 0.85, display: 'block' }}>
                      CARTÃO PRESENTE
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', letterSpacing: 1, opacity: 0.85, display: 'block' }}>
                      POSIÇÕES: {cliente.posicoes.join(', ')}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 'auto' }}>
                    <Box component="img" src={logoNewStore} alt="NS" sx={{ height: 18, opacity: 0.9 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 2, textTransform: 'uppercase', lineHeight: 1.1 }}>
                      {cliente.nome}
                    </Typography>
                  </Stack>

                  <Stack spacing={0.1} sx={{ mt: 'auto' }}>
                    <Typography variant="caption" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', letterSpacing: 1, opacity: 0.75 }}>
                      VÁLIDO ATÉ
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {cliente.validade}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack spacing={0.4} alignItems="flex-end" sx={{ ml: 1 }}>
                  <Typography variant="caption" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', letterSpacing: 1, opacity: 0.85 }}>
                    CÓDIGO DE DESCONTO:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, letterSpacing: 2, lineHeight: 1 }}>
                    {cliente.cupom}
                  </Typography>
                  <Typography variant="caption" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', letterSpacing: 1, opacity: 0.9, color: '#9AE6B4', textAlign: 'right' }}>
                    VALOR ACUMULADO:
                  </Typography>
                  <Typography sx={{ fontWeight: 900, color: '#9AE6B4' }}>
                    R$ {cliente.valorAcumulado.toFixed(2).replace('.', ',')}
                  </Typography>
                </Stack>
              </Stack>
            </Paper>
          </Box>

          <Paper variant="outlined" sx={{ p: { xs: 1, md: 2 } }}>
            <TableContainer>
              <Table size="medium" sx={{ minWidth: 560 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>SORTEIO</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>DIA</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>RESULTADO</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {history.map((row) => (
                    <TableRow key={`${row.numero}-${row.data}`} hover>
                      <TableCell sx={{ width: 120, fontWeight: 700 }}>{pad2(row.numero)}</TableCell>
                      <TableCell sx={{ width: 180 }}>{row.data}</TableCell>
                      <TableCell><StatusChip status={row.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction="row" justifyContent="flex-end" gap={1.5} sx={{ mt: 2 }}>
              <Button variant="outlined" color="error" onClick={limparSelecao}>
                Limpar meus números
              </Button>
              <Button variant="contained" color="success" onClick={() => alert('Resgatar cupom: ' + cliente.cupom)}>
                Resgatar cupom
              </Button>
              <Button variant="text" onClick={doLogout}>
                Sair
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}
