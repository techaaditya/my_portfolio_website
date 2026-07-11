import { useSound } from './SoundProvider';

/** HUD sound toggle — a small instrument switch with a live level glyph. */
export function SoundToggle() {
  const { enabled, toggle } = useSound();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'SND ON — mute UI sound' : 'SND OFF — enable UI sound'}
      className="readout pointer-events-auto flex items-center gap-2 border border-[color:var(--line-strong)] px-3 py-1.5 transition-colors hover:border-cyan/60 hover:text-ice"
    >
      <span aria-hidden="true" className="flex items-end gap-[2px]">
        {[3, 6, 4].map((h, i) => (
          <span
            key={i}
            className={enabled ? 'bg-cyan' : 'bg-dim/50'}
            style={{ width: 2, height: enabled ? h + 2 : 2, transition: 'height .25s' }}
          />
        ))}
      </span>
      SND {enabled ? 'ON' : 'OFF'}
    </button>
  );
}
