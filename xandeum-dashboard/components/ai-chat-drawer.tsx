'use client';

import { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import ChatBot from '@/components/chatbot';

interface AIChatDrawerProps {
    trigger?: React.ReactNode;
}

export function AIChatDrawer({ trigger }: AIChatDrawerProps) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            {trigger ? (
                <div onClick={() => setOpen(true)}>{trigger}</div>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOpen(true)}
                    className="gap-2 h-8 text-muted-foreground hover:text-foreground hover:bg-accent border-border"
                >
                    <span className="hidden sm:inline">Ask AI</span>
                </Button>
            )}
            <SheetContent
                side="right"
                className="w-full sm:max-w-xl p-0 flex flex-col"
                showCloseButton={true}
            >
                <SheetHeader className="px-4 pt-4 pb-2 border-b border-border">
                    <SheetTitle className="flex items-center gap-2">
                        Xandbot AI Assistant
                    </SheetTitle>
                    <SheetDescription>
                        Ask questions about Xandeum, pNodes, and the storage network
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-hidden">
                    <ChatBot />
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default AIChatDrawer;
