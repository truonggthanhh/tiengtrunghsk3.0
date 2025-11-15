import React from "react";
import { cn } from "@/lib/utils";

interface BackgroundTextureProps {
  variant?: 'default' | 'subtle';
}

export function BackgroundTexture({ variant = 'default' }: BackgroundTextureProps) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[-1]">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(%23n)" opacity="0.12"/></svg>')`
        }}
      />
      <div className={cn(
        "absolute -top-1/3 -left-1/3 h-[120%] w-[120%] rotate-6 blur-3xl",
        variant === 'default' ? "opacity-20" : "opacity-10"
      )} style={{background:'radial-gradient(600px circle at 20% 30%, var(--neon-cyan), transparent 60%), radial-gradient(600px circle at 80% 70%, var(--neon-pink), transparent 60%)'}}/>
      
      {variant === 'default' && (
        <div
          className="absolute inset-6 rounded-[2rem] border-2 border-ink/15"
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><circle cx="10" cy="10" r="3" fill="%23D14A41" opacity="0.28"/><circle cx="40" cy="30" r="2" fill="%231F6F5E" opacity="0.28"/><circle cx="25" cy="50" r="2" fill="%2350E3E6" opacity="0.28"/></svg>')`,
            maskImage:'radial-gradient(transparent, black 40%)',
            WebkitMaskImage:'radial-gradient(transparent, black 40%)'
          }}
        />
      )}
    </div>
  )
}