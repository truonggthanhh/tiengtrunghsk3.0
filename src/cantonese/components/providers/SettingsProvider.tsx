import { SettingsCtx, useSettings } from './SettingsProvider.shared';
import React from 'react'

type Settings = {
  showJyutping: boolean
  toggleJyutping: ()=>void
}



export default function SettingsProvider({children}:{children:React.ReactNode}){
  const [show,setShow]=React.useState(true)
  React.useEffect(()=>{
    const s=localStorage.getItem('settings.jyutping'); if(s) setShow(s==='1')
  },[])
  React.useEffect(()=>{
    localStorage.setItem('settings.jyutping', show?'1':'0')
  },[show])

  return (
    <SettingsCtx.Provider value={{showJyutping:show, toggleJyutping:()=>setShow(v=>!v)}}>
      {children}
    </SettingsCtx.Provider>
  )
}