import React from 'react';
type Ctx = { dark:boolean; toggle:()=>void }

export const ThemeCtx = React.createContext<Ctx>({dark:false,toggle:()=>{}})

export function useTheme(){ return React.useContext(ThemeCtx) }
