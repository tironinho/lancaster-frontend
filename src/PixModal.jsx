// src/PixModal.jsx
import * as React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Stack, Typography, TextField, Button, IconButton, LinearProgress
} from '@mui/material';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';

export default function PixModal({ open, onClose, loading, data, onCopy, onRefresh, amount }) {
  // --- Normalização e fontes do QR ---
  const rawB64 = (data?.qr_code_base64 || '').replace(/\s/g, ''); // remove quebras de linha/espacos
  const copyPaste = data?.copy_paste_code || data?.qr_code || '';

  // fonte 1: base64 vindo do backend
  const b64Src = rawB64 ? `data:image/png;base64,${rawB64}` : '';

  // fonte 2: gerador externo (qrserver)
  const qrServerSrc = copyPaste
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(copyPaste)}`
    : '';

  // fonte 3 (fallback final): quickchart
  const quickChartSrc = copyPaste
    ? `https://quickchart.io/qr?size=240&text=${encodeURIComponent(copyPaste)}`
    : '';

  // URL atual da imagem (começa no base64, depois qrserver, depois quickchart)
  const initialSrc = b64Src || qrServerSrc || '';
  const [imgSrc, setImgSrc] = React.useState(initialSrc);

  // se os dados mudarem, recalcula a imagem inicial
  React.useEffect(() => {
    const next = (rawB64 ? `data:image/png;base64,${rawB64}` : (qrServerSrc || ''));
    setImgSrc(next);
  }, [rawB64, qrServerSrc]);

  // onError: troca para o próximo provedor automaticamente
  const handleImgError = React.useCallback(() => {
    // se já tentou qrserver, vai para quickchart; se estava em b64, tenta qrserver
    if (imgSrc === b64Src && qrServerSrc) {
      setImgSrc(qrServerSrc);
    } else if (imgSrc === qrServerSrc && quickChartSrc) {
      setImgSrc(quickChartSrc);
    } else {
      // sem mais o que tentar: deixa vazio para não mostrar imagem quebrada
      setImgSrc('');
    }
  }, [imgSrc, b64Src, qrServerSrc, quickChartSrc]);

  const formattedAmount = (amount || data?.amount || 0).toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL'
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Pagamento via PIX</DialogTitle>
      <DialogContent dividers>
        {loading && <LinearProgress />}
        {!loading && data && (
          <Stack spacing={2}>
            <Typography>
              Valor: <strong>{formattedAmount}</strong>
            </Typography>

            {/* --- QR Code (não altera layout/tamanho) --- */}
            {(rawB64 || copyPaste) && imgSrc && (
              <img
                src={imgSrc}
                alt="QR Code PIX"
                width={240}
                height={240}
                loading="eager"
                referrerPolicy="no-referrer"
                onError={handleImgError}
                style={{
                  width: 240,
                  height: 240,
                  display: 'block',
                  margin: '0 auto',
                  borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.1)',
                  objectFit: 'contain',
                  background: 'transparent'
                }}
              />
            )}

            <Typography variant="body2">Copia e cola:</Typography>
            <TextField
              fullWidth
              size="small"
              value={copyPaste}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <IconButton onClick={onCopy} edge="end" aria-label="copiar">
                    <ContentCopyRoundedIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Escaneie o QR ou use o texto acima no seu aplicativo bancário.
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onRefresh} variant="outlined" color="success">Já paguei</Button>
        <Button onClick={onClose} variant="text">Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
}
