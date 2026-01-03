export const COUNTRIES = [
  { code: 'DE', name: 'Germany', flag: '🇩🇪', description: 'Top engineering and research programs' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', description: 'Rich academic heritage' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', description: 'Growing education hub' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', description: 'International business hub' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', description: 'World-class universities' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', description: 'Excellent study environment' },
  { code: 'US', name: 'United States', flag: '🇺🇸', description: 'Leading global universities' },
  { code: 'FR', name: 'France', flag: '🇫🇷', description: 'Arts and sciences excellence' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', description: 'Vibrant culture and education' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', description: 'Affordable quality education' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', description: 'Central European programs' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', description: 'Ancient academic traditions' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', description: 'High-quality education programs' },
]

export const LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'DE', name: 'German' },
  { code: 'IT', name: 'Italian' },
  { code: 'PL', name: 'Polish' },
  { code: 'FR', name: 'French' },
  { code: 'ES', name: 'Spanish' },
  { code: 'PT', name: 'Portuguese' },
]

export const LANGUAGE_NORMALIZATION: Record<string, string> = {
  'english': 'EN',
  'en': 'EN',
  'german': 'DE',
  'de': 'DE',
  'deutsch': 'DE',
  'italian': 'IT',
  'it': 'IT',
  'italiano': 'IT',
  'polish': 'PL',
  'pl': 'PL',
  'polski': 'PL',
  'french': 'FR',
  'fr': 'FR',
  'français': 'FR',
  'spanish': 'ES',
  'es': 'ES',
  'español': 'ES',
  'portuguese': 'PT',
  'pt': 'PT',
  'português': 'PT',
}

export const DEGREE_LEVELS = [
  { value: 'BACHELOR', label: "Bachelor's Program", icon: '🎓' },
  { value: 'MASTER', label: "Master's Program", icon: '🎯' },
]
