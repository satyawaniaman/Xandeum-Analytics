import Link from "next/link";
import { MenuIcon } from "@/components/ui/menu";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Menu } from "@/components/dashboard-panel/menu";
import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet";

export function SheetMenu() {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="ghost" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:w-72 px-3 h-full flex flex-col bg-card border-border" side="left">
        <SheetHeader>
          <Button
            className="flex justify-center items-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="https://images.archbee.com/ePevXmvzgG-7aqJ72Gpg_/syZjHGO-CjsEK5FAwqEeW_ljxyedtmkpohjqlo5qwmi-xandeumlogom1.png"
                alt="Xandeum Analytics"
                width={28}
                height={28}
              />
              <SheetTitle className="font-semibold text-base text-foreground">Xandeum Analytics</SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen />
      </SheetContent>
    </Sheet>
  );
}