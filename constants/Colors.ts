export const colors = {
  primary: "#3366FF", // Vibrant blue
  secondary: "#00C48C", // Teal green
  accent: "#FF9500", // Orange
  danger: "#FF3B30", // Red
  success: "#34C759", // Green
  warning: "#FFCC00", // Yellow
  info: "#5AC8FA", // Light blue
  background: "#F9FAFB", // Light gray
  card: "#FFFFFF", // White
  text: "#1F2937", // Dark gray
  border: "#E5E7EB", // Light gray
  notification: "#FF3B30", // Red
  placeholder: "#9CA3AF", // Gray
  darkBackground: "#111827", // Dark background
  darkCard: "#1F2937", // Dark card
  darkText: "#F9FAFB", // Dark text
  darkBorder: "#374151", // Dark border
  
  // Additional colors for UI enhancements
  lightPrimary: "#EEF2FF", // Light primary for backgrounds
  lightSecondary: "#E6F7F1", // Light secondary for backgrounds
  lightDanger: "#FFEEEE", // Light danger for backgrounds
  lightSuccess: "#E6F9ED", // Light success for backgrounds
  purple: "#8B5CF6", // Purple for variety
  pink: "#EC4899", // Pink for variety
  indigo: "#6366F1", // Indigo for variety
  
  // Gradients (start and end colors)
  gradientPrimary: ["#3366FF", "#5E5CE6"],
  gradientSecondary: ["#00C48C", "#00E6B0"],
  gradientDanger: ["#FF3B30", "#FF6B6B"],
  gradientSuccess: ["#34C759", "#4CD964"],
  gradientWarning: ["#FFCC00", "#FFD60A"],
  gradientAccent: ["#FF9500", "#FFAC33"],
};

export const theme = {
  light: {
    text: colors.text,
    background: colors.background,
    card: colors.card,
    border: colors.border,
    notification: colors.notification,
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    placeholder: colors.placeholder,
    lightPrimary: colors.lightPrimary,
    lightSecondary: colors.lightSecondary,
  },
  dark: {
    text: colors.darkText,
    background: colors.darkBackground,
    card: colors.darkCard,
    border: colors.darkBorder,
    notification: colors.notification,
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    placeholder: colors.placeholder,
    lightPrimary: "#1F2B5B", // Dark mode equivalent
    lightSecondary: "#1A3D33", // Dark mode equivalent
  },
};