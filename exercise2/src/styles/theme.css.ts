import { createTheme, createThemeContract, globalStyle } from '@vanilla-extract/css'

export const vars = createThemeContract({
  color: {
    bg: null,
    surface: null,
    text: null,
    textMuted: null,
    border: null,
    focus: null,
    primary: null,
    primaryHover: null,
    primaryText: null,
    secondary: null,
    secondaryHover: null,
    secondaryText: null,
    danger: null,
    dangerHover: null,
    dangerText: null,
    successBg: null,
    successText: null,
    warningBg: null,
    warningText: null,
    errorBg: null,
    errorText: null,
    neutralBg: null,
    neutralText: null,
  },
  space: { xs: null, sm: null, md: null, lg: null, xl: null },
  font: { body: null, heading: null },
  fontSize: { sm: null, md: null, lg: null, xl: null },
  fontWeight: { regular: null, medium: null, bold: null },
  radius: { sm: null, md: null, lg: null, pill: null },
  shadow: { sm: null, md: null },
})

const shared = {
  space: { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '40px' },
  font: {
    body: "'Inter', system-ui, 'Segoe UI', Roboto, sans-serif",
    heading: "'Inter', system-ui, 'Segoe UI', Roboto, sans-serif",
  },
  fontSize: { sm: '0.8125rem', md: '1rem', lg: '1.25rem', xl: '1.75rem' },
  fontWeight: { regular: '400', medium: '500', bold: '650' },
  radius: { sm: '4px', md: '8px', lg: '14px', pill: '999px' },
}

export const lightTheme = createTheme(vars, {
  ...shared,
  color: {
    bg: '#f2f2f2',
    surface: '#ffffff',
    text: '#111111',
    textMuted: '#666666',
    border: '#dcdcdc',
    focus: '#000000',
    primary: '#161616',
    primaryHover: '#3a3a3a',
    primaryText: '#ffffff',
    secondary: '#e6e6e6',
    secondaryHover: '#d6d6d6',
    secondaryText: '#161616',
    danger: '#b3261e',
    dangerHover: '#8f1d17',
    dangerText: '#ffffff',
    successBg: '#dcebdf',
    successText: '#1e5a2e',
    warningBg: '#f1e4bd',
    warningText: '#6a4c00',
    errorBg: '#f2d9d7',
    errorText: '#8f1d17',
    neutralBg: '#e6e6e6',
    neutralText: '#333333',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.12)',
    md: '0 4px 12px rgba(0, 0, 0, 0.18)',
  },
})

export const darkTheme = createTheme(vars, {
  ...shared,
  color: {
    bg: '#0d0d0d',
    surface: '#171717',
    text: '#ededed',
    textMuted: '#9a9a9a',
    border: '#2e2e2e',
    focus: '#ffffff',
    primary: '#f0f0f0',
    primaryHover: '#cfcfcf',
    primaryText: '#111111',
    secondary: '#262626',
    secondaryHover: '#333333',
    secondaryText: '#ededed',
    danger: '#e5645b',
    dangerHover: '#ec7f77',
    dangerText: '#1f0705',
    successBg: '#17301f',
    successText: '#7fcf98',
    warningBg: '#362c0e',
    warningText: '#e0c15a',
    errorBg: '#3d1a18',
    errorText: '#ee8f88',
    neutralBg: '#262626',
    neutralText: '#bdbdbd',
  },
  shadow: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.6)',
    md: '0 4px 12px rgba(0, 0, 0, 0.7)',
  },
})

globalStyle('html, body, #root', { margin: 0, minHeight: '100%' })
globalStyle('body', {
  backgroundColor: vars.color.bg,
  color: vars.color.text,
  fontFamily: vars.font.body,
  fontSize: vars.fontSize.md,
  lineHeight: 1.5,
})
globalStyle('*, *::before, *::after', { boxSizing: 'border-box' })
