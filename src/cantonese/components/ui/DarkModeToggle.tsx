"use client"
import React from "react";
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/cantonese/components/providers/ThemeProvider'

export default function DarkModeToggle(){
  const {dark,toggle} = useTheme()
  return (
    <button onClick={toggle} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-ink/20 bg-white dark:bg-black/20 text-ink">
      {dark ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}
      <span className="text-xs">{dark? 'Light':'Dark'}</span>
    </button>
  )
}