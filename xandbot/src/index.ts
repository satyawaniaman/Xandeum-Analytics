import "dotenv/config";
import { Telegraf } from "telegraf";
import { registerCommands } from "./commands/index.js";

// Validate environment
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!BOT_TOKEN) {
    console.error("❌ TELEGRAM_BOT_TOKEN is required in .env");
    process.exit(1);
}

const API_BASE_URL = process.env.API_BASE_URL || "https://www.xandeumstats.xyz";
console.log(`📡 Using API: ${API_BASE_URL}`);
console.log(`🔑 Token: ${BOT_TOKEN.split(":")[0]}:****`);

// Initialize bot
console.log("🔄 Initializing bot...");
const bot = new Telegraf(BOT_TOKEN);

// Register all command handlers
registerCommands(bot, API_BASE_URL);

// Error handling
bot.catch((err, ctx) => {
    console.error(`❌ Error for ${ctx.updateType}:`, err);
    ctx.reply("⚠️ Something went wrong. Please try again later.").catch(() => { });
});

// Launch bot
console.log("🚀 Launching bot...");

async function startBot() {
    try {
        // Drop pending updates to avoid processing old messages
        await bot.telegram.deleteWebhook({ drop_pending_updates: true });
        console.log("📤 Cleared pending updates");

        // Get bot info first
        const botInfo = await bot.telegram.getMe();
        console.log(`✅ Connected as @${botInfo.username}`);

        // Start polling
        bot.launch({
            dropPendingUpdates: true
        });

        console.log("✅ Xandbot is running!");
        console.log("👋 Send /start in Telegram to test");
    } catch (err) {
        console.error("❌ Failed to start bot:", err);
        process.exit(1);
    }
}

startBot();

// Graceful shutdown
process.once("SIGINT", () => {
    console.log("\n👋 Shutting down...");
    bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
    console.log("\n👋 Shutting down...");
    bot.stop("SIGTERM");
});
