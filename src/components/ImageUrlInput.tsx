'use client';

import { useState, memo } from 'react';
import { Box, TextField, Button, Alert } from '@mui/material';

interface ImageUrlInputProps {
  onLoadImage: (url: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const MAX_URL_LENGTH = 2048;

export const ImageUrlInput = memo(({ onLoadImage, isLoading, error }: ImageUrlInputProps) => {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.length > MAX_URL_LENGTH) {
      return;
    }
    await onLoadImage(url.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box
      sx={{
        p: 5,
        borderRadius: 3,
        textAlign: 'center',
        bgcolor: '#f4f4f4',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          '@media (max-width: 840px)': {
            flexDirection: 'column',
          },
        }}
      >
        <TextField
          fullWidth
          value={url}
          onChange={(e) => {
            if (e.target.value.length <= MAX_URL_LENGTH) {
              setUrl(e.target.value);
            }
          }}
          onKeyDown={handleKeyPress}
          placeholder="https://example.com/image.svg"
          inputProps={{
            'aria-label': '画像URL入力欄',
          }}
          variant="outlined"
          sx={{
            maxWidth: 500,
            bgcolor: '#fff',
            '& .MuiOutlinedInput-root': {
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ccc',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#ccc',
                borderWidth: '1px',
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          aria-label={isLoading ? '画像を読み込み中' : '画像を読み込み'}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            bgcolor: '#333',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#666',
              boxShadow: 'none',
            },
          }}
        >
          {isLoading ? '読み込み中...' : '画像を読み込み'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
          {error}
        </Alert>
      )}
    </Box>
  );
});
