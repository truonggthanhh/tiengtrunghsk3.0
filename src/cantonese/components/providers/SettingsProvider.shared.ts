import React from 'react'
type Settings = {
  showJyutping: boolean
  toggleJyutping: ()=>void
}

export const SettingsCtx = React.createContext<Settings>({showJyutping:true,toggleJyutping:()=>{}})

export function useSettings(){ return React.useContext(SettingsCtx) }
