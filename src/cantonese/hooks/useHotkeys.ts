import React from 'react'
import { useTheme } from '@/cantonese/components/providers/ThemeProvider'
import { useSettings } from '@/components/providers/SettingsProvider'

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