import { useSettings } from '@/lib/settings';

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { settings, update, reset } = useSettings();

  return (
    <div className="fixed inset-0 z-50 flex justify-end fade-in" role="dialog" aria-label="Settings">
      <button className="absolute inset-0 bg-black/30" onClick={onClose} aria-label="Close settings" />
      <div className="relative w-full max-w-sm bg-canvas border-l border-divider h-full overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="eyebrow">Settings / Local Preferences</h2>
          <button onClick={onClose} aria-label="Close" className="p-1.5 border border-divider hover:border-lime">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <section className="mb-6">
          <div className="text-sm font-medium mb-2">Theme</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => update({ theme: 'light' })}
              className={`px-3 py-2 text-sm border transition-colors ${settings.theme === 'light' ? 'border-lime bg-lime/10' : 'border-divider hover:border-lime'}`}
            >
              Light
            </button>
            <button
              onClick={() => update({ theme: 'dark' })}
              className={`px-3 py-2 text-sm border transition-colors ${settings.theme === 'dark' ? 'border-lime bg-lime/10' : 'border-divider hover:border-lime'}`}
            >
              Dark
            </button>
          </div>
        </section>

        <section className="mb-6">
          <div className="text-sm font-medium mb-2">Motion</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => update({ motion: 'system' })}
              className={`px-3 py-2 text-sm border transition-colors ${settings.motion === 'system' ? 'border-lime bg-lime/10' : 'border-divider hover:border-lime'}`}
            >
              Follow system
            </button>
            <button
              onClick={() => update({ motion: 'off' })}
              className={`px-3 py-2 text-sm border transition-colors ${settings.motion === 'off' ? 'border-lime bg-lime/10' : 'border-divider hover:border-lime'}`}
            >
              Off
            </button>
          </div>
          <p className="mono text-[10px] ink2 mt-2">Operating-system reduced-motion is always respected.</p>
        </section>

        <section className="mb-6">
          <div className="text-sm font-medium mb-2">Content density</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => update({ density: 'comfortable' })}
              className={`px-3 py-2 text-sm border transition-colors ${settings.density === 'comfortable' ? 'border-lime bg-lime/10' : 'border-divider hover:border-lime'}`}
            >
              Comfortable
            </button>
            <button
              onClick={() => update({ density: 'compact' })}
              className={`px-3 py-2 text-sm border transition-colors ${settings.density === 'compact' ? 'border-lime bg-lime/10' : 'border-divider hover:border-lime'}`}
            >
              Compact
            </button>
          </div>
        </section>

        <section>
          <button
            onClick={() => {
              if (confirm('Reset all local preferences to defaults? Your lab notes and bookmarks are not affected.')) {
                reset();
              }
            }}
            className="w-full px-3 py-2 text-sm border border-divider hover:border-orange text-orange transition-colors"
          >
            Reset preferences
          </button>
          <p className="mono text-[10px] ink2 mt-2">
            Preferences are stored locally in your browser. No accounts, no sync.
          </p>
        </section>
      </div>
    </div>
  );
}
