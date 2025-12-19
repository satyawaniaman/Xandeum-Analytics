import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

// Configure Google Generative AI with the API key from environment
const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// ============================================================================
// RATE LIMITING
// ============================================================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // requests per window
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const record = rateLimitMap.get(ip);

    if (!record || now > record.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return { allowed: true };
    }

    if (record.count >= RATE_LIMIT_MAX) {
        const retryAfter = Math.ceil((record.resetTime - now) / 1000);
        return { allowed: false, retryAfter };
    }

    record.count++;
    return { allowed: true };
}

// ============================================================================
// GUARDRAILS
// ============================================================================
const MAX_MESSAGE_LENGTH = 2000;

const INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?previous\s+instructions/i,
    /disregard\s+(all\s+)?prior\s+context/i,
    /forget\s+everything/i,
    /you\s+are\s+now\s+a/i,
    /act\s+as\s+if\s+you/i,
    /pretend\s+you\s+are/i,
    /system\s*:\s*/i,
    /\[INST\]/i,
    /\[\/INST\]/i,
];

function validateInput(message: string): { valid: boolean; error?: string } {
    if (message.length > MAX_MESSAGE_LENGTH) {
        return { valid: false, error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.` };
    }

    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(message)) {
            return { valid: false, error: "I can only help with questions about Xandeum, pNodes, and the storage network." };
        }
    }

    return { valid: true };
}

// ============================================================================
// CONTEXT - Load Documentation from File
// ============================================================================
import { readFileSync } from 'fs';
import path from 'path';

function loadDocsContext(): string {
    try {
        const docsPath = path.join(process.cwd(), 'lib', 'xandeum-docs.md');
        const content = readFileSync(docsPath, 'utf-8');
        // Limit to first ~60KB to stay within token limits
        return content.slice(0, 60000);
    } catch (error) {
        console.error('Failed to load docs:', error);
        return 'Documentation temporarily unavailable.';
    }
}

// Cache the docs content (loaded once at startup)
const DOCS_CONTEXT = loadDocsContext();

// ============================================================================
// SYSTEM PROMPT
// ============================================================================
function buildSystemPrompt(networkContext: string, tokenContext: string): string {
    return `You are Xandbot, the OFFICIAL and ONLY AI assistant for the Xandeum Network. You EXCLUSIVELY answer questions about Xandeum and related topics.

## STRICT TOPIC RESTRICTIONS
You ONLY answer questions about:
- Xandeum network, architecture, and ecosystem
- pNodes (provider nodes) - setup, operation, troubleshooting
- pods, xandminer, xandminerd software
- XAND token, XandSOL, staking, tokenomics
- Storage technology (erasure coding, PoPA, file systems)
- sedApps (storage-enabled dApps)
- The Xandeum Dashboard and analytics
- Solana blockchain (only in context of Xandeum integration)

If asked about ANY other topic (other cryptocurrencies, general questions, coding help unrelated to Xandeum, etc.), politely decline and say:
"I'm Xandbot, the Xandeum AI assistant. I can only help with questions about the Xandeum network, pNodes, XAND token, and related topics. Is there something about Xandeum I can help you with?"

## Your Capabilities
- Answer questions about Xandeum network architecture and components
- Explain pNode setup, management, and troubleshooting from the official documentation
- Interpret network statistics and node metrics shown on the dashboard
- Provide information about the XAND token and staking
- Guide users through the dashboard features
- Explain technical concepts like erasure coding, PoPA, and storage trilemma

## Guidelines
1. Be helpful, concise, and accurate
2. ALWAYS base your answers on the provided documentation context
3. If information is not in the docs, say so and suggest checking docs.xandeum.network
4. Format responses with markdown for readability
5. For pNode setup issues, reference the setup guide sections
6. Quote official documentation when helpful

## Official Documentation
${DOCS_CONTEXT}

## Live Network Data (Real-time)
${networkContext}

## XAND Token Data (Real-time)
${tokenContext}

Remember: You represent Xandeum officially. Be professional, accurate, and always stay on topic.`;
}

// ============================================================================
// DATA FETCHERS
// ============================================================================
async function fetchNetworkSummary(): Promise<string> {
    try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_BASE_URL}/pnodes/stats`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            return "Network data temporarily unavailable.";
        }

        const data = await response.json();
        return `Current Network Status:
- Total Nodes: ${data.total}
- Online Nodes: ${data.online}
- Nodes with Public RPC: ${data.with_public_rpc}
- Last Updated: ${data.timestamp}`;
    } catch {
        return "Network data temporarily unavailable.";
    }
}

async function fetchTokenData(): Promise<string> {
    try {
        const XAND_MINT = "XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx";
        const JUP_API_KEY = process.env.NEXT_PUBLIC_JUP_SWAP_V1_API_KEY;

        const response = await fetch(`https://api.jup.ag/ultra/v1/search?query=${XAND_MINT}`, {
            headers: JUP_API_KEY ? { "x-api-key": JUP_API_KEY } : {},
            signal: AbortSignal.timeout(5000),
        });

        if (!response.ok) {
            return "XAND token data temporarily unavailable.";
        }

        const data = await response.json();
        if (data && data[0]) {
            const t = data[0];
            const priceChange24h = t.stats24h?.priceChange?.toFixed(2) || "N/A";
            const volume24h = t.stats24h ? (t.stats24h.buyVolume + t.stats24h.sellVolume).toLocaleString() : "N/A";

            return `XAND Token (Live):
- Symbol: ${t.symbol}
- Price: $${t.usdPrice?.toFixed(6) || "N/A"}
- 24h Change: ${priceChange24h}%
- 24h Volume: $${volume24h}
- Liquidity: $${t.liquidity?.toLocaleString() || "N/A"}`;
        }
        return "XAND token data temporarily unavailable.";
    } catch {
        return "XAND token data temporarily unavailable.";
    }
}

// ============================================================================
// API HANDLER
// ============================================================================
export async function POST(req: Request) {
    // Get client IP for rate limiting
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0] || 'unknown';

    // Check rate limit
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
        return new Response(
            JSON.stringify({
                error: 'Rate limit exceeded',
                message: `Too many requests. Please wait ${rateLimitResult.retryAfter} seconds.`,
                retryAfter: rateLimitResult.retryAfter,
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(rateLimitResult.retryAfter),
                },
            }
        );
    }

    try {
        const { messages }: { messages: UIMessage[] } = await req.json();

        // Validate last user message
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === 'user') {
            const textPart = lastMessage.parts?.find(p => p.type === 'text');
            if (textPart && 'text' in textPart) {
                const validation = validateInput(textPart.text);
                if (!validation.valid) {
                    return new Response(
                        JSON.stringify({ error: 'Validation failed', message: validation.error }),
                        { status: 400, headers: { 'Content-Type': 'application/json' } }
                    );
                }
            }
        }

        // Fetch live context data in parallel
        const [networkContext, tokenContext] = await Promise.all([
            fetchNetworkSummary(),
            fetchTokenData(),
        ]);

        // Build system prompt with context
        const systemPrompt = buildSystemPrompt(networkContext, tokenContext);

        // Stream response using Gemini
        const result = streamText({
            model: google('gemini-2.0-flash'),
            messages: convertToModelMessages(messages),
            system: systemPrompt,
        });

        return result.toUIMessageStreamResponse({
            sendSources: true,
            sendReasoning: true,
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return new Response(
            JSON.stringify({ error: 'Internal error', message: 'Failed to process request' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}