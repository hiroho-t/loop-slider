'use client';

import { memo } from 'react';
import {
  Box,
  Typography,
  Slider,
  TextField,
  InputAdornment,
} from '@mui/material';
import { CarouselSettings as ICarouselSettings } from '@/types/carousel';
import { getSpeedLabel } from '@/utils/carousel';

interface CarouselSettingsProps {
  settings: ICarouselSettings;
  onSettingsChange: (settings: Partial<ICarouselSettings>) => void;
}

const CarouselSettingsComponent = memo(({ settings, onSettingsChange }: CarouselSettingsProps) => {
  const handleSpeedChange = (_: Event, value: number | number[]) => {
    const speed = Array.isArray(value) ? value[0] : value;
    onSettingsChange({ speed });
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      return;
    }
    const width = parseInt(value, 10);
    if (!isNaN(width) && width >= 100 && width <= 1000) {
      onSettingsChange({ width });
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 4, 
      mt: 2,
      '@media (max-width: 840px)': {
        flexDirection: 'column',
      }
    }}>
      <Box sx={{ 
        flex: 1,
        '@media (max-width: 840px)': {
          width: '100%',
        }
      }}>
        <Box
          sx={{
            p: 3,
            height: '100%',
            bgcolor: 'white',
            borderRadius: 3,
            border: 1,
            borderColor: '#ccc',
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600} component="h2">
            ループ速度
          </Typography>
          
          <Box sx={{ px: 2, mt: 3 }}>
            <Slider
              value={settings.speed}
              onChange={handleSpeedChange}
              min={1}
              max={50}
              valueLabelDisplay="off"
              aria-label="ループ速度"
              sx={{
                height: 8,
                '& .MuiSlider-thumb': {
                  width: 24,
                  height: 24,
                  boxShadow: 'none',
                  bgcolor: '#333',
                },
                '& .MuiSlider-track': {
                  border: 'none',
                  bgcolor: '#333',
                },
                '& .MuiSlider-rail': {
                  bgcolor: '#999',
                },
                mb: 2,
              }}
            />
            
            <Typography
              variant="body1"
              align="center"
              fontWeight={600}
              color="#999"
              sx={{ fontSize: '1.1rem' }}
            >
              {getSpeedLabel(settings.speed)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ 
        flex: 1,
        '@media (max-width: 840px)': {
          width: '100%',
        }
      }}>
        <Box
          sx={{
            p: 3,
            height: '100%',
            bgcolor: 'white',
            borderRadius: 3,
            border: 1,
            borderColor: '#ccc',
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600} component="h2">
            画像の横幅
          </Typography>
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 3,
            }}
          >
            <TextField
              type="number"
              value={settings.width}
              onChange={handleWidthChange}
              aria-label="画像の横幅"
              label="横幅 (px)"
              slotProps={{
                input: {
                  inputProps: {
                    min: 100,
                    max: 1000,
                    style: { textAlign: 'center' },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Typography fontWeight={600} color="text.secondary">
                        px
                      </Typography>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                width: 120,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

CarouselSettingsComponent.displayName = 'CarouselSettings';

export const CarouselSettings = CarouselSettingsComponent;