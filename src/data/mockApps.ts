import { DockApp } from '../types';

export const DEFAULT_DOCK_APPS: DockApp[] = [
  {
    id: 'phone',
    name: 'Phone',
    nameAr: 'الهاتف',
    packageName: 'com.google.android.dialer',
    iconName: 'Phone',
    color: '#34C759',
    gradient: 'from-emerald-400 to-green-600',
    badge: 2
  },
  {
    id: 'messages',
    name: 'Messages',
    nameAr: 'الرسائل',
    packageName: 'com.google.android.apps.messaging',
    iconName: 'MessageSquare',
    color: '#007AFF',
    gradient: 'from-blue-400 to-indigo-600',
    badge: 5
  },
  {
    id: 'chrome',
    name: 'Chrome',
    nameAr: 'المتصفح',
    packageName: 'com.android.chrome',
    iconName: 'Compass',
    color: '#FF9500',
    gradient: 'from-amber-400 to-orange-600'
  },
  {
    id: 'camera',
    name: 'Camera',
    nameAr: 'الكاميرا',
    packageName: 'com.google.android.GoogleCamera',
    iconName: 'Camera',
    color: '#FF2D55',
    gradient: 'from-rose-500 to-red-700'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    nameAr: 'الموسيقى',
    packageName: 'com.spotify.music',
    iconName: 'Music',
    color: '#1DB954',
    gradient: 'from-green-400 to-emerald-700'
  },
  {
    id: 'settings',
    name: 'Settings',
    nameAr: 'الإعدادات',
    packageName: 'com.android.settings',
    iconName: 'Settings',
    color: '#8E8E93',
    gradient: 'from-slate-400 to-slate-600'
  }
];
