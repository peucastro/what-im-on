'use client';

import { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { THEMES, FONT_FAMILY_MAP, FontFamily, BorderRadius, THEME_CACHE_KEY } from '@/utils/themes';
import { createClient } from '@/utils/supabase/client';

export default function VibeEditor() {
  const { preferences, setPreferences } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [originalPreferences] = useState(preferences);
  const supabase = createClient();

  const handleSave = async () => {
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase
        .from('user_preferences')
        .upsert(
          {
            user_id: user.id,
            ...preferences,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        alert('Failed to save vibe: ' + error.message);
      } else {
        // Update local cache so it persists on next load even without server roundtrip
        localStorage.setItem(THEME_CACHE_KEY, JSON.stringify(preferences));
        setIsOpen(false);
        // We don't use router.refresh() here to avoid potential hangs
        // The UI is already updated via setPreferences in the preview loop
      }
    }
    setIsSaving(false);
  };

  const handleCancel = () => {
    setPreferences(originalPreferences);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-app border border-app-border bg-app-nav px-3 py-1 text-sm font-medium text-app-font hover:bg-black hover:text-white transition-all lowercase"
      >
        ✏️ edit vibe
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-app border border-app-border bg-app-nav p-8 shadow-2xl relative overflow-hidden">
        {/* Subtitle / Background Texture for the modal itself to feel less "flat" */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-app-overlay" />
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-app-font lowercase mb-8 text-center tracking-tight">edit your vibe</h2>
          
          <div className="space-y-8">
            {/* Theme Selection */}
            <section>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-app-font opacity-40 mb-3 ml-1">theme</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPreferences({ ...preferences, theme_id: t.id })}
                    className={`px-3 py-2 text-xs rounded-app border transition-all lowercase ${
                      preferences.theme_id === t.id 
                        ? 'border-app-accent bg-app-accent text-white' 
                        : 'border-app-border text-app-font hover:border-app-accent'
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </section>

            {/* Border Radius */}
            <section>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-app-font opacity-40 mb-3 ml-1">corners</label>
              <div className="grid grid-cols-3 gap-2">
                {(['none', 'low', 'medium'] as BorderRadius[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setPreferences({ ...preferences, border_radius: r })}
                    className={`px-3 py-2 text-xs rounded-app border transition-all lowercase ${
                      preferences.border_radius === r 
                        ? 'border-app-accent bg-app-accent text-white' 
                        : 'border-app-border text-app-font hover:border-app-accent'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </section>

            {/* Font Family */}
            <section>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-app-font opacity-40 mb-3 ml-1">font</label>
              <div className="grid grid-cols-2 gap-2">
                {(['sans', 'mono', 'pixel', 'serif', 'comic'] as FontFamily[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setPreferences({ ...preferences, font_family: f })}
                    className={`px-3 py-2 text-xs rounded-app border transition-all lowercase ${
                      preferences.font_family === f 
                        ? 'border-app-accent bg-app-accent text-white' 
                        : 'border-app-border text-app-font hover:border-app-accent'
                    }`}
                    style={{ fontFamily: FONT_FAMILY_MAP[f] }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </section>

            {/* Pet Selection */}
            <section>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-app-font opacity-40 mb-3 ml-1">pet</label>
              <div className="grid grid-cols-3 gap-2">
                {['none', 'cat', 'dog', 'frog', 'ghost', 'slime'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreferences({ ...preferences, pet_id: p })}
                    className={`px-3 py-2 text-xs rounded-app border transition-all lowercase ${
                      preferences.pet_id === p 
                        ? 'border-app-accent bg-app-accent text-white' 
                        : 'border-app-border text-app-font hover:border-app-accent'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-10 flex flex-col gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full rounded-app bg-app-accent py-3 text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 transition-colors lowercase"
            >
              {isSaving ? 'saving...' : 'save vibe'}
            </button>
            <button
              onClick={handleCancel}
              className="w-full rounded-app py-3 text-app-font text-sm hover:bg-zinc-100 transition-colors lowercase"
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
