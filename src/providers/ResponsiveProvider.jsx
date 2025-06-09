// import provider's dependencies
import { createContext, useEffect, useState } from 'react'

// create and export provider's context
export var ResponsiveContext = createContext()

export default function ResponsiveProvider({ children }) {
  // responsiveness state
  const [ isMobileMenuNotOpen, setIsMobileMenuNotOpen ] = useState( true )

  // useEffect to check if window's width is less then 1100px and
  // update responsiveness state accordingly
  useEffect( function() {
    if ( window.innerWidth < 1100 ) {
      setIsMobileMenuNotOpen( false )
    }
  }, [])

  return (
    <ResponsiveContext.Provider value={ { isMobileMenuNotOpen, setIsMobileMenuNotOpen } }>
        { children }
    </ResponsiveContext.Provider>
  )
}
