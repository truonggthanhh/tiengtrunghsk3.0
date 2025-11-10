"use client"
import React from 'react'
import { useSettings } from '@/cantonese/components/providers/SettingsProvider'

interface JyutpingTextProps {
  children: React.ReactNode; // The Chinese text
  jyutping?: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export default function JyutpingText({ children, jyutping, className, tag: Tag = 'div' }: JyutpingTextProps) {
  const { showJyutping } = useSettings()

  return (
    <Tag className={className}>
      <div>{children}</div>
      {showJyutping && jyutping && (
        <div className="text-xs text-black/60 dark:text-white/60 opacity-80 font-normal mt-0.5">{jyutping}</div>
      )}
    </Tag>
  )
}