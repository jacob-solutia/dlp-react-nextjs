"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { signOut } from "@/lib/auth-client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { HugeiconsIcon } from "@hugeicons/react"
import { UnfoldMoreIcon, LogoutIcon } from "@hugeicons/core-free-icons"
import { ModeToggle } from "@/components/mode-toggle"

// Generated avatar from the user's name. The host must be allowlisted in
// next.config.ts under images.remotePatterns for next/image to load it.
function avatarUrl(name: string) {
  return `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(name)}`
}

// next/image avatar with a fallback to initials if the image fails to load.
function UserAvatar({ name, src }: { name: string; src: string }) {
  const [failed, setFailed] = React.useState(false)
  const initials =
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"

  if (failed) {
    return (
      <span className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-lg text-sm">
        {initials}
      </span>
    )
  }

  return (
    <Image
      src={src}
      alt={name}
      width={32}
      height={32}
      onError={() => setFailed(true)}
      className="size-8 shrink-0 rounded-lg object-cover"
    />
  )
}

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const src = user.avatar || avatarUrl(user.name)

  async function handleSignOut() {
    await signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar name={user.name} src={src} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-60"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar name={user.name} src={src} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <ModeToggle />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleSignOut}>
              <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
