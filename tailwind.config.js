import formsPlugin from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config}
 *
 * RiftChat Tailwind configuration.
 * Palette extends with Rift Brand Style Guide colors so utility classes like
 * `bg-rift-void`, `text-rift-signal`, `border-rift-whisper` work out of the box.
 * Matches the palette used at hub.rift.pw and the Rift agent admin.
 */
module.exports = {
    darkMode: 'selector',
    content: [
        "./src/frontend/index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx,html}",
    ],
    theme: {
        extend: {
            colors: {
                rift: {
                    void:          '#050607',
                    asphalt:       '#12171A',
                    signal:        '#00E5FF',
                    phosphor:      '#7CFF6B',
                    amber:         '#FFB000',
                    'citadel-red': '#FF3045',
                    ghost:         '#E8F1F2',
                    static:        '#6B7478',
                    whisper:       '#2a2f33',
                    deep:          '#0a0d0f',
                },
            },
            fontFamily: {
                display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
                mono:    ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
                poetic:  ['"Cormorant Garamond"', 'Georgia', 'serif'],
            },
            letterSpacing: {
                chrome: '0.25em',
                signal: '0.08em',
            },
            boxShadow: {
                'rift-glow': '0 0 20px rgba(0,229,255,.25), 0 0 60px rgba(0,229,255,.08)',
                'rift-card-hover': '0 0 30px rgba(0,229,255,.05)',
            },
        },
    },
    plugins: [
        formsPlugin,
    ],
}
