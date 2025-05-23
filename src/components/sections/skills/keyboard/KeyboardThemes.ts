
/**
 * Define keyboard theme interface
 */
export interface KeyboardTheme {
  name: string;
  baseColor: string;
  keycapColor: string;
  textColor: string;
  accentColor: string;
  rgbLight: boolean;
  soundType: 'blue' | 'brown' | 'red' | 'silent';
}

/**
 * Default theme for the keyboard
 */
export const defaultTheme: KeyboardTheme = {
  name: 'Default',
  baseColor: '#111111', // Very dark gray, almost black for mechanical keyboard base
  keycapColor: '#222222', // Dark gray for non-skill keycaps
  textColor: '#ffffff',
  accentColor: '#00ff88', // Bright green accent for RGB effects
  rgbLight: true, // Enable RGB lighting effects
  soundType: 'blue', // Clicky blue switch sound
};
