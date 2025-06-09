// import provider's dependencies
import React, { useEffect } from 'react'
import useTheme from '../hooks/useTheme'

// create and export provider's context
export const ThemeContext = React.createContext()

export default function ThemeProvider({ children }) {
  // get current theme and theme-toggler function from
  // 'useTheme' custom hook( which retrieves it either using media query 
  // or from local-storage based on user preferences )
  const [ theme, toggleTheme ] = useTheme('supabase-expense-tracker-theme');

  // useEffect to watch for changes in 'theme' value and update
  // app's style/CSS global variables accordingly
  useEffect( function() {
    if ( theme == 'dark' ) {
        document.documentElement.style.setProperty('--brand-white','#333')
        document.documentElement.style.setProperty('--brand-black','#ffffff')
        document.documentElement.style.setProperty('--brand-pale-white','#5e5e5e')
        document.documentElement.style.setProperty('--brand-white-half-opacity','#333333cf')
        document.documentElement.style.setProperty('--brand-black-half-opacity','#ffffffcf')
        document.documentElement.style.setProperty('--brand-pale-white-half-opacity','#5e5e5ecf')
    } else {
        document.documentElement.style.setProperty('--brand-white','#ffffff')
        document.documentElement.style.setProperty('--brand-black','#333')
        document.documentElement.style.setProperty('--brand-pale-white','#dfdfdf')
        document.documentElement.style.setProperty('--brand-white-half-opacity','#ffffffcf')
        document.documentElement.style.setProperty('--brand-black-half-opacity','#333333cf')
        document.documentElement.style.setProperty('--brand-pale-white-half-opacity','#f0f0f0cf')
    }
  }, [ theme ])

  return (
    <ThemeContext.Provider value={ { theme, toggleTheme } }>
      {
        children
      }
    </ThemeContext.Provider>
  )
}
