export type IntegrationMode = 'system_widget' | 'native_taskbar' | 'floating_overlay';

export interface DockApp {
  id: string;
  name: string;
  nameAr: string;
  packageName: string;
  iconName: string;
  color: string;
  gradient: string;
  badge?: number;
}

export interface DockSettings {
  integrationMode: IntegrationMode;
  blurRadius: number; // e.g. 24dp
  springStiffness: number; // e.g. 300
  springDamping: number; // e.g. 0.6
  enable120Hz: boolean;
  dockOpacity: number; // 0.15 - 0.5
  dockScale: number; // 1.0 - 1.4
  snapToEdge: boolean;
  hapticFeedback: boolean;
  showLabels: boolean;
  autoHide: boolean;
  // Widget specific settings
  widgetColumns: number; // 4, 5, or 6
  widgetTheme: 'frosted_glass' | 'material_you' | 'dark_oled';
}

export interface AndroidCodeFile {
  path: string;
  title: string;
  titleAr: string;
  language: 'kotlin' | 'xml' | 'groovy';
  descriptionAr: string;
  code: string;
}

export type SimulatedAppType = 'home' | 'phone' | 'messages' | 'camera' | 'chrome' | 'settings' | 'spotify';
