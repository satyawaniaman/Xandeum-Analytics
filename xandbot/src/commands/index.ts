import type { Telegraf, Context } from "telegraf";
import { XandeumAPI } from "../api.js";
import { escapeMarkdown } from "../utils.js";

export function registerCommands(bot: Telegraf<Context>, apiBaseUrl: string) {
    const api = new XandeumAPI(apiBaseUrl);

    // /start - Welcome message
    bot.start((ctx) => {
        const welcomeMessage = `
🤖 *Welcome to Xandbot Assistant\\!*

Your AI\\-powered companion for Xandeum network analytics\\.

*Quick Commands:*
/nodes \\- Network overview
/stats \\- Quick statistics  
/node \\<ip\\> \\- Node details
/help \\- All commands

🌐 [Open Dashboard](https://www.xandeumstats.xyz)
        `.trim();

        ctx.replyWithMarkdownV2(welcomeMessage);
    });

    // /help - List all commands
    bot.help((ctx) => {
        const helpMessage = `
📚 *Xandbot Commands*

*General*
/start \\- Welcome message
/help \\- Show this help

*Network*
/nodes \\- Network overview with node counts
/stats \\- Quick network statistics
/node \\<ip\\> \\- Detailed info for a specific node

*Examples:*
\`/node 192\\.168\\.1\\.1\`

🌐 [Dashboard](https://www.xandeumstats.xyz) \\| [Telegram](https://t.me/XandAssistantbot)
        `.trim();

        ctx.replyWithMarkdownV2(helpMessage);
    });

    // /nodes - Network overview
    bot.command("nodes", async (ctx) => {
        try {
            await ctx.sendChatAction("typing");
            const data = await api.getPNodes();
            const summary = data.summary;
            const onlineTotal = summary.online_public + summary.online_private;
            const onlinePercent = ((onlineTotal / summary.total) * 100).toFixed(1);

            const message = `
📊 *Network Overview*

*Total pNodes:* ${summary.total}
*Online:* ${onlineTotal} \\(${escapeMarkdown(onlinePercent)}%\\)

├ 🟢 Public RPC: ${summary.online_public}
├ 🟡 Private: ${summary.online_private}  
└ ⚫ Offline: ${summary.offline}

_Updated: ${escapeMarkdown(new Date(data.timestamp).toLocaleTimeString())}_
            `.trim();

            await ctx.replyWithMarkdownV2(message);
        } catch (error) {
            console.error("Error fetching nodes:", error);
            await ctx.reply("❌ Failed to fetch network data. Please try again.");
        }
    });

    // /stats - Quick statistics
    bot.command("stats", async (ctx) => {
        try {
            await ctx.sendChatAction("typing");
            const stats = await api.getStats();
            const onlinePercent = ((stats.online / stats.total) * 100).toFixed(1);
            const publicPercent = ((stats.with_public_rpc / stats.total) * 100).toFixed(1);

            const message = `
⚡ *Network Statistics*

📊 Total Nodes: *${stats.total}*
🟢 Online: *${stats.online}* \\(${escapeMarkdown(onlinePercent)}%\\)
🌐 Public RPC: *${stats.with_public_rpc}* \\(${escapeMarkdown(publicPercent)}%\\)

_${escapeMarkdown(new Date(stats.timestamp).toLocaleTimeString())}_
            `.trim();

            await ctx.replyWithMarkdownV2(message);
        } catch (error) {
            console.error("Error fetching stats:", error);
            await ctx.reply("❌ Failed to fetch statistics. Please try again.");
        }
    });

    // /node <ip> - Specific node details
    bot.command("node", async (ctx) => {
        const args = ctx.message.text.split(" ").slice(1);
        const ip = args[0];

        if (!ip) {
            await ctx.reply("⚠️ Usage: /node <ip>\n\nExample: /node 192.168.1.1");
            return;
        }

        try {
            await ctx.sendChatAction("typing");
            const node = await api.getNode(ip);

            if (!node) {
                await ctx.reply(`❌ Node not found: ${ip}\n\nMake sure you entered the correct IP address.`);
                return;
            }

            const statusEmoji = getStatusEmoji(node.status);
            const location = [node.city, node.country].filter(Boolean).join(", ") || "Unknown";

            const message = `
🖥️ *Node Details*

*IP:* \`${escapeMarkdown(node.ip)}\`
*Status:* ${statusEmoji} ${escapeMarkdown(node.status.replace("_", " "))}

${node.version ? `*Version:* ${escapeMarkdown(node.version)}` : ""}
${node.uptimeHuman ? `*Uptime:* ${escapeMarkdown(node.uptimeHuman)}` : ""}
${node.cpuPercent !== null ? `*CPU:* ${node.cpuPercent.toFixed(1)}%` : ""}
${node.ramUsagePercent !== null ? `*RAM:* ${node.ramUsagePercent.toFixed(1)}%` : ""}
${node.fileSizeGB !== null ? `*Storage:* ${node.fileSizeGB.toFixed(2)} GB` : ""}

📍 *Location:* ${escapeMarkdown(location)}
${node.lastSeenAt ? `🕐 *Last Seen:* ${escapeMarkdown(new Date(node.lastSeenAt).toLocaleString())}` : ""}
            `.trim().replace(/\n{3,}/g, "\n\n");

            await ctx.replyWithMarkdownV2(message);
        } catch (error) {
            console.error("Error fetching node:", error);
            await ctx.reply("❌ Failed to fetch node details. Please try again.");
        }
    });

    // Handle unknown commands
    bot.on("text", (ctx) => {
        const text = ctx.message.text;
        if (text.startsWith("/")) {
            ctx.reply(`❓ Unknown command: ${text.split(" ")[0]}\n\nType /help to see available commands.`);
        }
    });
}

function getStatusEmoji(status: string): string {
    switch (status) {
        case "online_public":
            return "🟢";
        case "online_private":
            return "🟡";
        case "offline":
            return "⚫";
        default:
            return "❓";
    }
}
