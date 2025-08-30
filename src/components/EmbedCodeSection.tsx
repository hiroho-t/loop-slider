'use client';

import { useState } from 'react';
import { Box, Paper, Typography, Button, Alert } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { copyToClipboard } from '@/utils/carousel';

interface EmbedCodeSectionProps {
  embedCode: string;
}

export const EmbedCodeSection = ({ embedCode }: EmbedCodeSectionProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(embedCode);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!embedCode) {
    return null;
  }

  return (
    <Box
      sx={{
        p: 4,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight={600} component="h2">
          iframe埋め込みコード
        </Typography>

        <Box
          component="pre"
          role="region"
          aria-label="埋め込みコード"
          sx={{
            bgcolor: '#f8f9fa',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            p: 2,
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            color: 'text.secondary',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            maxHeight: 200,
            overflow: 'auto',
            mb: 2,
          }}
        >
          {embedCode}
        </Box>

        <Button
          variant="contained"
          onClick={handleCopy}
          startIcon={copied ? <Check /> : <ContentCopy />}
          aria-label={copied ? 'コピー完了' : 'コードをクリップボードにコピー'}
          sx={{
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: copied ? 'success.main' : '#333',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: copied ? 'success.dark' : '#666',
              transform: 'translateY(-2px)',
              boxShadow: 'none',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {copied ? 'コピー完了！' : 'コードをコピー'}
        </Button>

        {copied && (
          <Alert severity="success" sx={{ mt: 2 }}>
            埋め込みコードをクリップボードにコピーしました
          </Alert>
        )}
      </Paper>
    </Box>
  );
};
