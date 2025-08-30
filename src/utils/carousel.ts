export const getSpeedLabel = (speed: number): string => {
  if (speed <= 5) return '極めて遅い';
  if (speed <= 10) return '非常に遅い';
  if (speed <= 15) return 'とても遅い';
  if (speed <= 20) return '遅い';
  if (speed <= 25) return 'やや遅い';
  if (speed <= 30) return '普通';
  if (speed <= 35) return 'やや速い';
  if (speed <= 40) return '速い';
  if (speed <= 45) return '非常に速い';
  return '極めて速い';
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text.trim()) return false;
  
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

export const validateImageDimensions = (width: number): boolean => {
  return width >= 100 && width <= 1000;
};