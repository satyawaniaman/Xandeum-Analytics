# Xandbot - Telegram Bot for Xandeum Network

A Telegram bot that provides real-time pNode monitoring for the Xandeum network.

**Bot:** [@XandAssistantbot](https://t.me/XandAssistantbot)

## Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your TELEGRAM_BOT_TOKEN
   ```

3. **Run the bot:**
   ```bash
   # Development (with hot reload)
   pnpm dev
   
   # Production
   pnpm build
   pnpm start
   ```

## Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/help` | List all commands |
| `/nodes` | Network overview |
| `/stats` | Quick statistics |
| `/node <ip>` | Node details |

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TELEGRAM_BOT_TOKEN` | Bot token from @BotFather | ✅ |
| `API_BASE_URL` | Xandeum API URL | Default: `https://www.xandeumstats.xyz` |
