'use client';
import {
    Conversation,
    ConversationContent,
    ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import {
    Message,
    MessageContent,
    MessageResponse,
    MessageActions,
    MessageAction,
} from '@/components/ai-elements/message';
import {
    PromptInput,
    PromptInputBody,
    PromptInputFooter,
    PromptInputSubmit,
    PromptInputTextarea,
    type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { CopyIcon, RefreshCcwIcon, AlertCircle } from 'lucide-react';
import { Loader } from '@/components/ai-elements/loader';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ChatBot = () => {
    const [input, setInput] = useState('');
    const { messages, sendMessage, status, regenerate, error } = useChat();
    const [rateLimitError, setRateLimitError] = useState<string | null>(null);

    const handleSubmit = async (message: PromptInputMessage) => {
        const messageText = message.text?.trim();
        if (!messageText) {
            return;
        }

        // Clear input immediately
        setInput('');

        // Clear any previous rate limit error
        setRateLimitError(null);

        try {
            await sendMessage({ text: messageText });
        } catch (err) {
            // Check if it's a rate limit error
            const errorMsg = err instanceof Error ? err.message : String(err);
            if (errorMsg.includes('429') || errorMsg.toLowerCase().includes('rate limit')) {
                setRateLimitError('Too many requests. Please wait a moment before trying again.');
            }
            console.error('Chat error:', err);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <Conversation className="flex-1 min-h-0">
                <ConversationContent>
                    {/* Welcome message if no messages */}
                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Hi! I&apos;m Xandbot
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-sm">
                                I can help you understand the Xandeum network, pNode operations,
                                check network stats, and answer questions about the XAND token.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                {[
                                    'What is a pNode?',
                                    'Network status',
                                    'XAND token price',
                                ].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => {
                                            setInput(suggestion);
                                            handleSubmit({ text: suggestion, files: [] });
                                        }}
                                        className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    {messages.map((message) => (
                        <div key={message.id}>
                            {message.parts.map((part, i) => {
                                switch (part.type) {
                                    case 'text':
                                        return (
                                            <Message key={`${message.id}-${i}`} from={message.role}>
                                                <MessageContent>
                                                    <MessageResponse>
                                                        {part.text}
                                                    </MessageResponse>
                                                </MessageContent>
                                                {message.role === 'assistant' && (
                                                    <MessageActions>
                                                        <MessageAction
                                                            onClick={() => regenerate()}
                                                            label="Retry"
                                                        >
                                                            <RefreshCcwIcon className="size-3" />
                                                        </MessageAction>
                                                        <MessageAction
                                                            onClick={() =>
                                                                navigator.clipboard.writeText(part.text)
                                                            }
                                                            label="Copy"
                                                        >
                                                            <CopyIcon className="size-3" />
                                                        </MessageAction>
                                                    </MessageActions>
                                                )}
                                            </Message>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    ))}

                    {/* Loading state */}
                    {status === 'submitted' && <Loader />}
                </ConversationContent>
                <ConversationScrollButton />
            </Conversation>

            {/* Error alerts */}
            {(error || rateLimitError) && (
                <div className="px-4 pb-2">
                    <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                            {rateLimitError || error?.message || 'An error occurred'}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {/* Input */}
            <div className="border-t border-border p-4">
                <PromptInput onSubmit={handleSubmit}>
                    <PromptInputBody>
                        <PromptInputTextarea
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            placeholder="Ask about Xandeum..."
                            className="min-h-[44px] max-h-[120px]"
                        />
                    </PromptInputBody>
                    <PromptInputFooter className="justify-end">
                        <PromptInputSubmit
                            disabled={!input.trim()}
                            status={status}
                        />
                    </PromptInputFooter>
                </PromptInput>
            </div>
        </div>
    );
};

export default ChatBot;