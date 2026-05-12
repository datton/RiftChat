# RIFT-FORK Notes

This is the **RiftChat** fork of [Reticulum MeshChat](https://github.com/liamcottle/reticulum-meshchat) by Liam Cottle.

- **Upstream license:** MIT (carried intact, see [`LICENSE`](LICENSE)).
- **Our additions:** MIT (matches upstream — no contamination).
- **Why fork:** speed to a Rift-branded, testable build on Debian. We need a working messenger now; we'll keep merging upstream improvements where they generalize, and contribute back where the change isn't Rift-specific.

When this fork and upstream MeshChat disagree, **upstream is canonical** for the Reticulum/LXMF protocol behavior. We change branding, defaults, and add Rift-specific features — we do not change protocol semantics.

---

## What we've changed so far

| File | Change | Why |
|---|---|---|
| [`src/frontend/index.html`](src/frontend/index.html) | `<title>` → `RiftChat`; Google Fonts preconnect for IBM Plex Mono + Space Grotesk + Cormorant Garamond + Michroma; `theme-color` + meta description | Browser tab branding + Rift Brand fonts loaded. Matches hub.rift.pw. |
| [`src/frontend/style.css`](src/frontend/style.css) | Full rewrite: Rift palette CSS vars (`--rift-void/asphalt/signal/phosphor/amber/citadel-red/ghost/static/whisper/deep`), body baseline, SVG noise overlay, card/signal-line/code/tag/button/form/scrollbar/selection patterns | Compiles into `public/style.css` via Tailwind/Vite. Visually matches hub.rift.pw. |
| [`tailwind.config.js`](tailwind.config.js) | Extended `theme.extend` with `colors.rift.*`, `fontFamily.{display,mono,poetic}`, `letterSpacing.{chrome,signal}`, `boxShadow.rift-glow` | Tailwind utility classes (e.g. `bg-rift-void`, `text-rift-signal`) now Rift-aware. |
| [`meshchat.py`](meshchat.py) | argparse description → RiftChat tagline + upstream credit | CLI `--help` now reads as RiftChat. |
| [`package.json`](package.json) | `name` → `riftchat`, `productName` → `RiftChat`, `appId` → `pw.rift.chat`, version reset to `0.1.0` | Electron/npm metadata. |
| [`src/frontend/components/interfaces/AddInterfacePage.vue`](src/frontend/components/interfaces/AddInterfacePage.vue) | **New "Rift Citadels" preset section above "Community Interfaces"** with three quick-add buttons: `a.citadel.rift.pw`, `b.citadel.rift.pw`, `connect.rift.pw` (all TCPClientInterface, port 4965). Themed with Signal-Cyan border + buttons. Community section description rewritten to clarify it's for reaching peers outside the Rift mesh. | User-facing "Add Interface" page now offers Rift hubs as the primary choice. |
| [`packaging/debian/postinst`](packaging/debian/postinst) | Seeds default Reticulum config at `/var/lib/riftchat/reticulum/config` on fresh install with: **3 Rift Citadels** (a/b/connect.rift.pw on port 4965, primary) + **4 community hubs enabled by default** (Amsterdam, Sydney RNS, BetweenTheBorders, dismail.de — geographically diverse) + **5 community hubs commented for opt-in** (interloper, noDNS1, The Outpost, Beleth, Rocket Tech) + LAN AutoInterface. Never overwritten on upgrade. Uses `deb-systemd-helper` for service lifecycle (enable+start on install, try-restart on upgrade, mask-on-remove, purge-on-purge). | First-boot RiftChat joins both the Rift mesh and the wider Reticulum network in seconds — no manual interface configuration, no RNode required. Community node list sourced from reticulum.network/connect_jp.html + directory.rns.recipes + rmap.world. |
| [`src/frontend/components/interfaces/AddInterfacePage.vue`](src/frontend/components/interfaces/AddInterfacePage.vue) | Expanded "Community Interfaces" preset list to include all 9 well-known community Reticulum hubs (Amsterdam, BetweenTheBorders, Sydney RNS, dismail.de, interloper, noDNS1, The Outpost, Beleth RNS Hub, Rocket Tech Hub) as one-click "Use Interface" buttons. Inline annotations on IP-only (noDNS1) and port-443 (Rocket Tech) entries. | Web UI now offers the full community hub catalog as quick-add options, in addition to the three Rift Citadels at the top. |
| [`packaging/debian/`](packaging/debian/) | Full Debian packaging: `control` (Architecture: all, Python+curl deps), `prerm` (stop on upgrade/remove), `postrm` (mask/purge), `conffiles` (preserves edits to systemd unit, `/etc/default/riftchat`, weekly cron), `copyright` (MIT + upstream credit), systemd unit with `dialout` SupplementaryGroup for RNode USB. **systemd readiness probe**: `ExecStartPost` curls `http://127.0.0.1:8000/` for up to 30s, so `systemctl start riftchat` only reports `active` once the UI is actually serving. `TimeoutStartSec=60`. | One `.deb` works on amd64 + arm64 via per-arch wheels resolved by pip at install time. Service health is verified before declaring up. |
| [`packaging/debian/etc/default/riftchat`](packaging/debian/etc/default/riftchat) + [`packaging/debian/etc/cron.weekly/riftchat-auto-update`](packaging/debian/etc/cron.weekly/riftchat-auto-update) | Operator-controlled weekly auto-upgrade. `/etc/default/riftchat` has `RIFTCHAT_AUTO_UPDATE=false` by default. When set to `true`, the cron runs `apt-get update && apt-get install -y --only-upgrade riftchat` weekly with 0–300s jitter (so a fleet doesn't all hit apt.rift.pw at the same minute). Logs to `journalctl -t riftchat-auto-update`. Both files are conffiles → operator edits survive `apt upgrade`. | Opt-in unattended upgrades. Default off (safer Debian default). Toggle: `sudo sed -i 's/AUTO_UPDATE=false/AUTO_UPDATE=true/' /etc/default/riftchat`. |
| Rift Citadel ports | Changed `4965` → **`4242`** everywhere — postinst seed, Vue UI presets, all install banners. | Aligns with the Reticulum community standard TCP port. Most community hubs (Sydney, BTB, interloper, Outpost, Beleth) already use 4242. Rift Citadel TCPServerInterface configs should match. |

The rest of the brand pass — logo files, favicons, About-page copy, default Propagation Nodes seeded — is tracked in the roadmap below.

---

## What we have NOT changed (intentional)

- The Reticulum + LXMF wire protocol — upstream owns this.
- The Vue UI structure — we'll restyle, not restructure.
- The Python backend architecture — works as-is.
- Liam Cottle's MIT license header in source files.
- The `donate.md` file (we won't repurpose his Bitcoin address or Ko-Fi; we'll add our own donation surface later under a Rift Advanced flap, off by default per [Adoption Strategy §1](../../../docs/ADOPTION_STRATEGY.md#1-the-reframe)).

---

## Repo layout

This fork lives at `apps/riftchat/source/` inside [TheRift](../../../) worktree. It is a **separate git repo** (its own `.git/`), not a submodule. The outer TheRift repo's `.gitignore` excludes `apps/riftchat/source/` so changes here don't accidentally get tracked by TheRift's main history.

When we publish this fork:

```bash
cd apps/riftchat/source
git remote rename origin upstream     # liamcottle/reticulum-meshchat → upstream
git remote add origin git@github.com:datton/riftchat.git
git checkout -b rift/main
git add -A && git commit -m "Initial RiftChat brand pass"
git push -u origin rift/main
```

---

## Brand pass roadmap (TODO)

In rough priority order. Pick items off as time allows.

### Highly visible (do first)
- [ ] Replace `logo/icon.png`, `logo/icon.ico`, `logo/icon.icns` with the Rift "Split Signal" mark per [Brand Style Guide §5](../../../docs/BRANDING_STYLE_GUIDE.md#5-logo-direction).
- [ ] Replace `logo/logo-chat-bubble.png` (used in README) with the Rift logo.
- [ ] Replace favicons in `src/frontend/favicons/`.
- [ ] CSS palette in `src/frontend/style.css` (or wherever Tailwind config sits) → Rift palette per [Brand Style Guide §6](../../../docs/BRANDING_STYLE_GUIDE.md#6-color-palette).
- [ ] Web font load → Space Grotesk + JetBrains Mono per [Brand Style Guide §7](../../../docs/BRANDING_STYLE_GUIDE.md#7-typography).
- [ ] About / Welcome screen copy → Rift voice per [Brand Style Guide §8](../../../docs/BRANDING_STYLE_GUIDE.md#8-brand-voice). Include explicit "Built on Reticulum MeshChat by Liam Cottle (MIT)" credit.
- [ ] README.md (this fork's) → Rift-flavored README that links back to upstream attribution.

### Functional (do after the visible pass)
- [ ] Default seeded Propagation Nodes → swap in project-operated Rift Citadels (TBD list).
- [ ] Empty / success / error state copy → Rift voice (see [Brand Style Guide §15](../../../docs/BRANDING_STYLE_GUIDE.md#15-ui-direction)).
- [ ] Strip Liam's donate / Ko-Fi / Bitcoin surface from the UI (footer/about/etc.); keep the `donate.md` file intact as upstream attribution.
- [ ] Rename `meshchat.py` → `riftchat.py` (or add a symlink/wrapper); update systemd unit and electron `main.js` accordingly.
- [ ] Rename storage default `./storage` → `./riftchat-storage` to avoid collisions when both apps run side-by-side on the same machine.
- [ ] Wallet / $CAST surface under an Advanced flap (off by default, per [Adoption Strategy](../../../docs/ADOPTION_STRATEGY.md#1-the-reframe)).

### Operational
- [ ] CI: every PR builds the Electron bundle for Win/Mac/Linux + the Debian `.deb`.
- [ ] Signed installers: Authenticode (Win), notarized `.dmg` (Mac), GPG-signed `.deb` to `apt.rift.pw`.
- [ ] Auto-update channel via the same Merkle pipeline rift-citadel will use.
- [ ] Self-hosted F-Droid repo at `repo.rift.pw` (once we have a mobile build path).

---

## Upstream tracking

```bash
# Pull new upstream changes into a working branch
git fetch upstream
git checkout -b merge-upstream-YYYYMMDD
git merge upstream/master   # or upstream/main, check actual branch name
# Resolve conflicts (usually in package.json branding fields, index.html title)
git checkout rift/main
git merge --no-ff merge-upstream-YYYYMMDD
```

When a fix we ship is generalizable (not Rift-specific), PR it back:

```bash
git checkout upstream/master
git checkout -b fix/the-thing-from-upstream-base
git cherry-pick <our commit on rift/main>
# Open PR against liamcottle/reticulum-meshchat
```

---

## How to publish (when ready)

We have not pushed this fork anywhere yet. To do so:

1. Create the empty repo on your GitHub: e.g. `github.com/datton/riftchat`. Do NOT initialize with a README — we already have one.
2. Inside `apps/riftchat/source/`:
   ```bash
   git remote rename origin upstream
   git remote add origin git@github.com:datton/riftchat.git
   git push -u origin HEAD
   ```
3. Update `apps/riftchat/DEBIAN-QUICKSTART.md` §2.B to point at the real fork URL.

---

## Credit

Built on **[Reticulum MeshChat](https://github.com/liamcottle/reticulum-meshchat)** by [Liam Cottle](https://github.com/liamcottle) (MIT). Reticulum (`rns`) and LXMF (`lxmf`) by [Mark Qvist](https://github.com/markqvist) under the Reticulum License. We stand on their shoulders.
