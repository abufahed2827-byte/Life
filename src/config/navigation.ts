import { Home, HeartPulse, Brain, GraduationCap, Palette, Heart, Bookmark, Settings, type LucideIcon } from 'lucide-react';

export type SectionId = 'dashboard' | 'health' | 'cbt' | 'academic' | 'studio' | 'wishlist' | 'savedlater' | 'settings';

export interface NavSection {
  id: SectionId;
  label: string;
  icon: LucideIcon;
  emoji: string;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: 'dashboard', label: 'الرئيسية', icon: Home, emoji: '🏠' },
  { id: 'health', label: 'الصحة والطب', icon: HeartPulse, emoji: '🏥' },
  { id: 'cbt', label: 'النفسية والتتبع', icon: Brain, emoji: '🧠' },
  { id: 'academic', label: 'الدراسة والمهام', icon: GraduationCap, emoji: '📚' },
  { id: 'studio', label: 'الاستوديو والمقتنيات', icon: Palette, emoji: '🎨' },
  { id: 'wishlist', label: 'أشياء في خاطري', icon: Heart, emoji: '💝' },
  { id: 'savedlater', label: 'للمشاهدة لاحقاً', icon: Bookmark, emoji: '🔖' },
];

export const SETTINGS_SECTION: NavSection = {
  id: 'settings',
  label: 'الإعدادات',
  icon: Settings,
  emoji: '⚙️',
};
