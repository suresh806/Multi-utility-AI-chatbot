// Theme color configuration for dark and light modes

export const themeColors = {
  // Backgrounds
  bgPrimary: { dark: '#0f1720', light: '#ffffff' },
  bgSecondary: { dark: '#151a33', light: '#f8f9fa' },
  bgTertiary: { dark: '#1a2433', light: '#f5f7fa' },
  
  // Text colors
  textPrimary: { dark: '#e8f0ff', light: '#1f2937' },
  textSecondary: { dark: '#a8afc7', light: '#6b7280' },
  textMuted: { dark: '#6b7280', light: '#9ca3af' },
  
  // Borders
  borderPrimary: { dark: '#1f2d42', light: '#e5e7eb' },
  borderSecondary: { dark: '#2a3f5f', light: '#f0f0f0' },
  
  // Cards
  cardBg: { dark: '#1f2d42', light: 'white' },
  cardBorder: { dark: '#2a3f5f', light: '#e5e7eb' },
  
  // Accents
  accent: '#0ea5a4',
  accentLight: '#06968d',
  
  // Interactive
  inputBg: { dark: '#0a0e27', light: '#ffffff' },
  inputBorder: { dark: '#1f2d42', light: '#e5e7eb' },
  hoverBg: { dark: '#2a3f5f', light: '#f3f4f6' },
  
  // Special
  placeholder: { dark: '#6b7280', light: '#d1d5db' },
};

// Helper function to get color based on dark mode
export const getColor = (colorKey, darkMode) => {
  const colorConfig = themeColors[colorKey];
  if (typeof colorConfig === 'object' && colorConfig.dark && colorConfig.light) {
    return darkMode ? colorConfig.dark : colorConfig.light;
  }
  return colorConfig; // Return as-is if not a dark/light pair
};

// Helper function to generate style object with theme-aware colors
export const getThemedStyles = (darkMode, styles) => {
  const result = {};
  Object.entries(styles).forEach(([key, value]) => {
    if (typeof value === 'object' && value.dark && value.light) {
      result[key] = darkMode ? value.dark : value.light;
    } else {
      result[key] = value;
    }
  });
  return result;
};
