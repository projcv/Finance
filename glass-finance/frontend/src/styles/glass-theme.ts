export const glassTheme = {
    colors: {
        glass: {
            light: 'rgba(255, 255, 255, 0.1)',
            medium: 'rgba(255, 255, 255, 0.15)',
            dark: 'rgba(0, 0, 0, 0.1)',
            border: 'rgba(255, 255, 255, 0.2)',
            borderHover: 'rgba(255, 255, 255, 0.3)',
        },
        primary: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
        },
        secondary: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
        },
        success: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
        },
        warning: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
        },
        error: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
        },
    },

    gradients: {
        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        warm: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        cool: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        glassHover: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.1) 100%)',
    },

    shadows: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        glassLg: '0 12px 48px 0 rgba(31, 38, 135, 0.2)',
        glassXl: '0 20px 60px 0 rgba(31, 38, 135, 0.25)',
        glow: '0 0 20px rgba(99, 102, 241, 0.4)',
        glowLg: '0 0 30px rgba(99, 102, 241, 0.5)',
    },

    blur: {
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
    },

    borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
    },

    spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
    },

    transitions: {
        fast: '150ms',
        base: '300ms',
        slow: '500ms',
    },

    zIndex: {
        base: 0,
        dropdown: 1000,
        sticky: 1100,
        fixed: 1200,
        modalBackdrop: 1300,
        modal: 1400,
        popover: 1500,
        tooltip: 1600,
    },
} as const;

export type GlassTheme = typeof glassTheme;

// CSS Variable Generator
export const generateCSSVariables = () => {
    const cssVars: Record<string, string> = {};

    // Colors
    Object.entries(glassTheme.colors).forEach(([colorName, colorValues]) => {
        if (typeof colorValues === 'string') {
            cssVars[`--color-${colorName}`] = colorValues;
        } else {
            Object.entries(colorValues).forEach(([shade, value]) => {
                cssVars[`--color-${colorName}-${shade}`] = value;
            });
        }
    });

    // Gradients
    Object.entries(glassTheme.gradients).forEach(([name, value]) => {
        cssVars[`--gradient-${name}`] = value;
    });

    // Shadows
    Object.entries(glassTheme.shadows).forEach(([name, value]) => {
        cssVars[`--shadow-${name}`] = value;
    });

    // Blur
    Object.entries(glassTheme.blur).forEach(([name, value]) => {
        cssVars[`--blur-${name}`] = value;
    });

    return cssVars;
};

// Helper function to apply glass effect
export const getGlassStyles = (variant: 'light' | 'medium' | 'dark' = 'light') => {
    return {
        backdropFilter: `blur(${glassTheme.blur.lg})`,
        backgroundColor: glassTheme.colors.glass[variant],
        border: `1px solid ${glassTheme.colors.glass.border}`,
        boxShadow: glassTheme.shadows.glass,
    };
};

// Helper function for gradient backgrounds
export const getGradientBackground = (gradient: keyof typeof glassTheme.gradients) => {
    return {
        background: glassTheme.gradients[gradient],
    };
};

export default glassTheme;
