"use client"
import React from 'react'

type Ctx = { dark:boolean; toggle:()=>void }
const ThemeCtx = React.createContext<Ctx>({dark:false,toggle:()=>{}})

export function useTheme(){ return React.useContext(ThemeCtx) }

export default function ThemeProvider({children}:{children:React.ReactNode}){
  const [dark,setDark]=React.useState(false)

  React.useEffect(()=>{
    const saved = localStorage.getItem('theme.dark')
    if(saved){ setDark(saved==='1') }
  },[])
  
  React.useEffect(()=>{
    if(typeof document!=='undefined'){
      document.documentElement.classList.toggle('dark', dark)
    }
    localStorage.setItem('theme.dark', dark?'1':'0')
  },[dark])

  return <ThemeCtx.Provider value={{dark,toggle:()=>setDark(d=>!d)}}>{children}</ThemeCtx.Provider>
}