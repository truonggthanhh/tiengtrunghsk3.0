import React from 'react'
import { useSettings } from '@/cantonese/components/providers/SettingsProvider'
import { Button } from '@/components/ui/button'
import { SpellCheck } from 'lucide-react'

export default function JyutpingToggle() {
  const { showJyutping, toggleJyutping } = useSettings()

  return (
    <Button
      variant="ghost"
      onClick={toggleJyutping}
      className={`rounded-xl px-3 py-2 flex items-center gap-2 transition-colors ${showJyutping ? 'bg-jade text-cream hover:bg-jade/90' : 'bg-black/5 dark:bg-white/10 text-ink dark:text-cream hover:bg-black/10 dark:hover:bg-white/20'}`}
      aria-pressed={showJyutping}
      aria-label="Toggle Jyutping"
    >
      <SpellCheck className="h-5 w-5" />
      <span className="text-sm font-medium whitespace-nowrap">{showJyutping ? 'Tắt Việt Bính' : 'Bật Việt Bính'}</span>
    </Button>
  )
}