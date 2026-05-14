<h1 align="center">RIFTCHAT</h1>

<p align="center">
  <em>Memory for the Mesh, in conversation.</em>
</p>

<p align="center">
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-00E5FF.svg?style=flat-square&labelColor=050607">
  <img alt="Debian: amd64 + arm64" src="https://img.shields.io/badge/Debian-amd64%20%2B%20arm64-7CFF6B.svg?style=flat-square&labelColor=050607">
  <img alt="Reticulum: 1.x" src="https://img.shields.io/badge/Reticulum-1.x-FFB000.svg?style=flat-square&labelColor=050607">
  <img alt="LXMF: wire-compatible" src="https://img.shields.io/badge/LXMF-wire--compatible-FF3045.svg?style=flat-square&labelColor=050607">
</p>

<p align="center">
  <a href="https://rift.pw">rift.pw</a> ·
  <a href="https://github.com/datton/TheRift">github.com/datton/TheRift</a> ·
  <a href="RIFT-FORK.md">Change log</a>
</p>

---

> *Built for delay. Designed for survival.*

**RiftChat is a Reticulum-native messenger that works without the internet.**

It carries messages, voice notes, and file attachments across whatever transport is available — **LoRa radio, Bluetooth Low Energy, WiFi Direct, Ethernet, packet radio, or plain internet TCP** — because [Reticulum](https://reticulum.network) was built for exactly that. When the internet is up, it's just another pipe. When it isn't, the mesh keeps moving.

There is no central server. There is no account to create. There is no domain to own. Your identity is a cryptographic key on your device. Every message is encrypted end-to-end with Curve25519 + AES-256 and Perfect Forward Secrecy. The closest thing to a "server" is whichever peer on the mesh is online and willing to relay a packet — your laptop, a Raspberry Pi 200 km away, a friend's phone, a Citadel running in a rack in Frankfurt. Whichever is reachable, your message gets there.

RiftChat speaks **LXMF** on the wire. That means it interoperates natively with [Sideband](https://github.com/markqvist/Sideband), [Nomad Network](https://github.com/markqvist/NomadNet), and upstream [Reticulum MeshChat](https://github.com/liamcottle/reticulum-meshchat) — three other clients on the same protocol. Your contacts can be on any of them. RiftChat itself is a Rift-branded fork of Reticulum MeshChat by Liam Cottle (MIT-licensed; see [Built on](#built-on) below).

---

## Install

### Debian, Ubuntu, Raspberry Pi OS (amd64 + arm64)

```bash
curl -fsSL https://apt.rift.pw/install/riftchat | sudo bash
sudo systemctl enable --now riftchat
```

Open `http://localhost:8111` from any browser on the same network.

A single `Architecture: all` `.deb` works on both **amd64** (x86_64) and **arm64** (Pi 4/5, Apple Silicon Linux VMs, AWS Graviton). Native Python wheels for `aiohttp` / `cryptography` / `peewee` resolve per-architecture at install time.

The install creates a `riftchat` system user, sets up a venv at `/opt/riftchat/.venv`, seeds a Reticulum config with **three Rift Citadels + four geographically-diverse community hubs** so the node joins the mesh on first boot without manual setup. systemd lifecycle is wired via `deb-systemd-helper` — install enables and starts, upgrade does a `try-restart`, remove stops cleanly, purge nukes state.

Want unattended upgrades? `sudo sed -i 's/AUTO_UPDATE=false/AUTO_UPDATE=true/' /etc/default/riftchat`.

### From source (any OS with Python 3.11+)

```bash
git clone https://github.com/datton/RiftChat
cd RiftChat
python3 -m venv .venv && source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
npm install && npm run build-frontend     # compiles Vue + Tailwind into public/
python meshchat.py --host 0.0.0.0 --port 8111 --headless
```

UI at `http://localhost:8111`.

### Docker

```bash
docker compose up -d
```

Uses the upstream `Dockerfile` and `docker-compose.yml` — Rift branding still applies through the frontend.

---

## What you get out of the box

| | |
|---|---|
| **Joins the Rift mesh on first boot** | Three Rift Citadels (`a.citadel.rift.pw`, `b.citadel.rift.pw`, `connect.rift.pw` on port 4242) + four geographically-diverse community Reticulum hubs (Amsterdam, Sydney, BetweenTheBorders, dismail.de) pre-seeded into the default Reticulum config. **No RNode hardware required.** |
| **LXMF messaging** | Wire-compatible with Sideband, NomadNet, upstream Reticulum MeshChat, and any future LXMF client. |
| **Voice notes** | codec2 + Opus encoding works over LoRa-grade bandwidth. |
| **Files, images, attachments** | Inline previews, downloadable from either side. |
| **LXMF Propagation Nodes** | Messages addressed to you while offline arrive on next connection — discovered automatically via Reticulum announces. |
| **Multi-transport routing** | Reticulum opens all configured interfaces in parallel; whichever has reachability wins. LoRa, BLE, WiFi Direct, Ethernet, packet radio, plain TCP — same routing layer. |
| **systemd readiness probe** | `systemctl start riftchat` only reports `active` once the UI actually answers on port 8111. |
| **Operator-friendly** | Weekly opt-in auto-upgrades, dialout group for RNode USB, security-hardened systemd unit, journal-aware logging. |

---

## The five non-negotiables

These govern every decision in the codebase:

1. **Works without the internet.** Reticulum is the substrate, not TCP/IP. The thesis is the WAN-cable demo: yank the Ethernet, the conversation keeps flowing over LoRa or BLE.
2. **Derived from MeshChat (MIT).** Not derived from Sideband (CC BY-NC-SA, forbidden). RiftChat is a respectful Rift-branded fork of [Liam Cottle's work](https://github.com/liamcottle/reticulum-meshchat), not Sideband or anything else.
3. **No censorship-circumvention transports inside RiftChat.** Tor and I2P need internet and add operational complexity. Both live on Rift Citadels for operators who deliberately run them — not in the user-facing app. The thesis is offline-first, not internet-circumventing.
4. **Reticulum-native.** Official Python [`rns`](https://pypi.org/project/rns/) + [`lxmf`](https://pypi.org/project/lxmf/) from [reticulum.network](https://reticulum.network), nothing else. No Rust port (`reticulum-rs` is non-interoperable). No custom implementations.
5. **Rift brand uniform.** Matches [`hub.rift.pw`](https://rift.pw) — Void Black background, IBM Plex Mono + Space Grotesk, operational-console chrome. See the [Brand Style Guide](https://github.com/datton/TheRift/blob/main/docs/BRANDING_STYLE_GUIDE.md).

---

## Hardware (optional)

For LoRa coverage where there's no LAN and no internet:

1. Plug an [RNode](https://unsigned.io/rnode/) into USB.
2. Add yourself to the `dialout` group: `sudo usermod -aG dialout $USER && newgrp dialout`.
3. In RiftChat's UI: **Network → Interfaces → Add → RNodeInterface**, point at `/dev/serial/by-id/...`.

You're now talking to anyone with another RNode within radio range — typically 5–15 km in line-of-sight, with no internet in the chain.

---

## Configure

| Concern | Where |
|---|---|
| Reticulum interfaces (TCP hubs, RNodes, BLE, …) | `/var/lib/riftchat/reticulum/config`, or the UI's **Network → Interfaces** page |
| Web UI bind host/port | `ExecStart=` line in `/lib/systemd/system/riftchat.service`, or a systemd drop-in at `/etc/systemd/system/riftchat.service.d/override.conf` |
| Unattended weekly upgrades | `/etc/default/riftchat` — set `RIFTCHAT_AUTO_UPDATE=true` |
| Display name, propagation node, themes, ACLs | RiftChat UI → **Settings** |

Files under `/etc/` and `/var/lib/riftchat/` are conffiles — operator edits survive `apt upgrade`.

---

## What's in this repository

```
RiftChat/
├── meshchat.py                    Python entry point (RiftChat-branded)
├── src/frontend/                  Vue UI source — Rift palette, Plex Mono + Space Grotesk
├── public/                        Compiled frontend (generated by `npm run build-frontend`)
├── packaging/debian/              .deb sources: control, postinst, prerm, postrm, conffiles,
│                                    copyright, systemd unit, /etc/default, weekly cron, wrapper
├── electron/                      Electron desktop wrapper (upstream)
├── docker-compose.yml             Docker recipe (upstream)
├── requirements.txt               Python deps: rns, lxmf, aiohttp, peewee, websockets
├── RIFT-FORK.md                   Living change log + brand-pass roadmap
└── LICENSE                        MIT (Liam Cottle 2024 + Rift contributors 2026)
```

The brand-pass and Debian packaging are tracked in [RIFT-FORK.md](RIFT-FORK.md). The broader Rift project's plan and strategy docs live in the parent worktree: [`apps/riftchat/PLAN.md`](https://github.com/datton/TheRift/blob/main/apps/riftchat/PLAN.md), [`docs/ADOPTION_STRATEGY.md`](https://github.com/datton/TheRift/blob/main/docs/ADOPTION_STRATEGY.md), and the [Brand Style Guide](https://github.com/datton/TheRift/blob/main/docs/BRANDING_STYLE_GUIDE.md).

---

## Built on

- **[Reticulum MeshChat](https://github.com/liamcottle/reticulum-meshchat)** by [Liam Cottle](https://github.com/liamcottle) — MIT-licensed Vue + Python chat client. RiftChat is a fork. Liam's work made this possible in weeks rather than months.
- **[Reticulum](https://github.com/markqvist/Reticulum)** + **[LXMF](https://github.com/markqvist/LXMF)** by [Mark Qvist](https://github.com/markqvist) — the wire protocol that makes any of this work, including over LoRa, BLE, and disconnected mesh.
- **[`rmap.world`](https://rmap.world)** + **[`directory.rns.recipes`](https://directory.rns.recipes)** — community-maintained directories of public Reticulum hubs. The default community hubs seeded into RiftChat's config come from these.

We stand on their shoulders.

---

## The Rift family

RiftChat is the messaging face of the broader **[Rift project](https://github.com/datton/TheRift)** — sovereign, post-IP infrastructure built on Reticulum:

- **[github.com/datton/TheRift](https://github.com/datton/TheRift)** — the protocol stack, Citadel service architecture, ecosystem apps.
- **[rift.pw](https://rift.pw)** — entry hub + install index.
- **`rift-citadel`** — Python service stack for Citadel operators (settlement, name service, hardware market, gateway).
- **RiftChat** — *this repo*. The user-facing messenger.

The brand is shared. The wire protocol is shared. The mesh is shared.

---

## Contribute

The fork tracks upstream MeshChat. Pull requests welcome — especially fixes and improvements that generalize, which we'll PR back to Liam's repo. Rift-specific changes (palette, Citadel presets, default config, packaging) stay here.

```bash
git clone https://github.com/datton/RiftChat
cd RiftChat
git remote add upstream https://github.com/liamcottle/reticulum-meshchat
git fetch upstream
```

Periodically `git fetch upstream && git merge upstream/master` to pick up Liam's improvements.

See [RIFT-FORK.md](RIFT-FORK.md) for the full change log and the brand-pass roadmap.

---

## License

**MIT.** Both the upstream MeshChat code (© 2024 Liam Cottle) and the Rift additions (© 2026 Rift Contributors). See [LICENSE](LICENSE).

The MIT choice is deliberate — it keeps RiftChat **F-Droid friendly** and allows commercial use. **Sideband is CC BY-NC-SA**; we explicitly do not derive from Sideband source for that reason.

---

<p align="center">
<em>There is no cloud.<br>
There is no master.<br>
There is only The Rift.</em>
</p>
