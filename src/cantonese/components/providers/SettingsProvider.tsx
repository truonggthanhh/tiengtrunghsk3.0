"use client"
import React from 'react'

type Settings = {
  showJyutping: boolean
  toggleJyutping: ()=>void
}
const SettingsCtx = React.createContext<Settings>({showJyutping:true,toggleJyutping:()=>{}})
export function useSettings(){ return React.useContext(SettingsCtx) }

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