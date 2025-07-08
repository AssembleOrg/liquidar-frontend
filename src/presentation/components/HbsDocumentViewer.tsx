import React, { useEffect, useState, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestoreIcon from '@mui/icons-material/Restore';
import Handlebars from 'handlebars';

// Importar los templates como texto
import facturaTemplate from '../utils/templates/factura.hbs?raw';
import ticketTemplate from '../utils/templates/ticket.hbs?raw';

interface HbsDocumentViewerProps {
  template: 'factura' | 'ticket';
  data: Record<string, any>;
  children?: React.ReactNode;
}

const templates: Record<string, string> = {
  factura: facturaTemplate,
  ticket: ticketTemplate,
};

const HbsDocumentViewer: React.FC<HbsDocumentViewerProps> = ({ template, data, children }) => {
  const [zoom, setZoom] = useState(1);
  const [srcDoc, setSrcDoc] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const source = templates[template];
      const compiled = Handlebars.compile(source);
      let htmlResult = compiled(data);
      htmlResult = htmlResult.replace(
        /<body([^>]*)>/i,
        `<body$1><div style="position:fixed;top:40%;left:0;width:100%;text-align:center;z-index:1000;pointer-events:none;opacity:0.15;transform:rotate(-20deg);font-size:5vw;font-weight:bold;color:red;">NO VÁLIDO</div>`
      );
      setSrcDoc(htmlResult);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [template, data]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5));
  const handleZoomReset = () => setZoom(1);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        width: '100%',
        height: '100%',
        minHeight: 0,
        gap: 2,
        flex: 1,
      }}
    >
      {/* Visor tipo PDF */}
      <Box
        sx={{
          flex: '1 1 0',
          minWidth: { xs: '100%', md: 400 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          boxShadow: 3,
          p: 2,
          position: 'relative',
          overflow: 'auto',
          height: '100%',
          minHeight: 0,
        }}
      >
        {/* Controles de zoom */}
        <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center', color: 'black' }}>
          <IconButton onClick={handleZoomOut} size="small" sx={{ color: 'black' }}><ZoomOutIcon /></IconButton>
          <Typography variant="body2" sx={{ color: 'black' }}>{Math.round(zoom * 100)}%</Typography>
          <IconButton onClick={handleZoomIn} size="small" sx={{ color: 'black' }}><ZoomInIcon /></IconButton>
          <IconButton onClick={handleZoomReset} size="small" sx={{ color: 'black' }}><RestoreIcon /></IconButton>
        </Box>
        {/* Documento renderizado en iframe */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            minHeight: 0,
            mx: 'auto',
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 1,
            overflow: 'auto',
            position: 'relative',
            flex: 1,
          }}
        >
          <iframe
            ref={iframeRef}
            title="Documento HBS"
            srcDoc={srcDoc}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              borderRadius: 8,
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              background: 'white',
              transition: 'transform 0.2s',
              pointerEvents: 'auto',
              minHeight: 0,
            }}
            sandbox="allow-same-origin"
          />
        </Box>
      </Box>
      {/* Formulario o children */}
      <Box
        sx={{
          flex: '1 1 0',
          minWidth: { xs: '100%', md: 320 },
          maxWidth: { md: 500 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 2,
          p: 2,
          height: '100%',
          minHeight: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default HbsDocumentViewer; 