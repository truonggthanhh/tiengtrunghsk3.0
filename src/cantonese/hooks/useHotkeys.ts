import React from 'react'
import { useTheme } from '@/cantonese/components/providers/ThemeProvider.shared';
import { useSettings } from '@/cantonese/components/providers/SettingsProvider.shared';

type Opts = {
  onPrev?: ()=>void
  onNext?: ()=>void
  onFlip?: ()=>void
  onPick?: (i:number)=>void
}
export default function useHotkeys(opts:Opts){
  const {toggle:toggleTheme} = useTheme()
  const {toggleJyutping} = useSettings()

  React.useEffect(()=>{
    function onKey(e:KeyboardEvent){
      const target = e.target instanceof HTMLElement ? e.target : null;
      if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.isComposing ||
          target?.isContentEditable || target?.closest('input, textarea, select, button, a, summary, [role="button"], [role="combobox"], [contenteditable="true"]')) return;
      if(e.key==='ArrowLeft'){ opts.onPrev?.(); }
      else if(e.key==='ArrowRight'){ opts.onNext?.(); }
      else if(e.key===' '){ e.preventDefault(); opts.onFlip?.(); }
      else if(['1','2','3','4'].includes(e.key)){ opts.onPick?.(Number(e.key)-1) }
      else if(e.key.toLowerCase()==='h'){ toggleJyutping() }
      else if(e.key.toLowerCase()==='d'){ toggleTheme() }
    }
    window.addEventListener('keydown', onKey)
    return ()=>window.removeEventListener('keydown', onKey)
  },[opts, toggleJyutping, toggleTheme])
}