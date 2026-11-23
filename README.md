# Niya Gigs — Eric Ushie

A responsive portfolio with standalone website concepts and a seven-game browser arcade. Open `index.html` to begin. The arcade is built with native JavaScript and the Canvas 2D API; it does not require Phaser, TypeScript compilation, or a game-engine download.

## Main pages
- `index.html` — portfolio home, project collection, Lagos clock and live weather.
- `about.html` — about the developer.
- `services.html` — services and project types.
- `games.html` — seven full-screen games: RIFTBOUND, Greenhaven, Circuit Crown, Neon Arena, Bastion Zero, Hexbound Tactics and Driftline.
- `games.js` — game logic for all seven games.
- `manage.html` — private-by-convention project manager (open directly; access code: `qwerty`).

## Arcade controls
- **RIFTBOUND:** WASD / arrow keys to move; your shard weapon automatically targets nearby enemies. Click or Space to dash. Collect shards and choose an upgrade each time you level up.
- **GREENHAVEN:** click seed cards to select a crop; click a plot to plant or harvest; click Next Day to grow crops.
- **CIRCUIT CROWN:** select a machine and click a grid tile to place it. Click an occupied tile to remove it. Build a working miner/belt/assembler chain and hit production quotas.
- **NEON ARENA:** WASD / arrows to move; mouse to aim; click or Space to fire. It starts immediately with bots. With Supabase configured, it can also broadcast player positions in a shared room while bots keep matches populated.
- **BASTION ZERO:** select a tower, place it on a grid tile, then start a wave. Click an existing tower to upgrade it.
- **HEXBOUND TACTICS:** click one of your units, then a neighbouring tile to move or attack. The rival takes its turn automatically.
- **DRIFTLINE:** A/D or left/right to steer; Space to boost; avoid traffic and collect energy.

Every game takes over the browser viewport. Best scores are stored locally in the current browser. The games are designed to work without a backend; no account is needed to play.

## Optional Neon Arena online rooms (Supabase)
Neon Arena works offline immediately and uses bots as opponents. To enable its online-ready room layer:
1. Create a Supabase project.
2. In `games.js`, fill `SUPABASE_CONFIG.url`, `SUPABASE_CONFIG.anonKey`, and (optionally) `SUPABASE_CONFIG.room` with your project's URL, public anon/publishable key, and a room name.
3. Deploy the site over HTTPS and open the same room from two different browsers/devices.

This first online layer uses Supabase Realtime Broadcast to share player positions. It is an early multiplayer foundation, not yet a complete production multiplayer shooter: it does not include authoritative server-side hit validation, accounts, matchmaking, anti-cheat, or synchronized damage. Never put a Supabase service-role key in browser code. For a public release, add authentication, room permissions and server-authoritative game logic.

## Project websites
- `sharp-cuts.html` — barbershop concept.
- `prime-form.html`, `prime-form-calculator.html`, `prime-form-booking.html` — fitness website and tools.
- `luma-events.html` — event discovery concept.
- `aurel-living.html` — furniture storefront concept with an interactive demo basket.
- `bytebite.html` — cafe menu and basket demo.
- `orbit-studio.html` — creative studio website concept.

## Adding projects without editing code
1. Open `manage.html` and enter `qwerty`.
2. Fill in the project name, description, category, public website URL, features and your role.
3. Click **Download project-data.json**.
4. Upload/replace `project-data.json` in the same GitHub repository folder as `index.html`.
5. Wait for GitHub Pages to redeploy. The new project appears on the portfolio.

Entries are saved in local browser storage first. Export the JSON file to publish them to every visitor.

## Security and integrations
GitHub Pages is static hosting. The manager's `qwerty` check is a convenience gate only; it is not secure authentication because browser code is public. Do not store secrets or private data. For real protected multi-user editing, connect a backend such as Supabase Auth with server-side write policies.

Weather uses the public Open-Meteo forecast API and requires internet access. Time/date use the Africa/Lagos timezone. The weather panel gracefully reports when the API is unavailable.

All store, booking, event, cafe and studio content is demo/sample content unless separately connected to a real business service. The AUREL basket is a demo and does not process payments. The portfolio contact form opens an email draft; it does not send automatically.
