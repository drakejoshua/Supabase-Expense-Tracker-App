/**
 * Header component for the Supabase Expense Tracker application.
 * 
 * Renders the main navigation header, including theme toggle, authentication links,
 * user menu, and responsive menu toggle. Displays different options based on user authentication state.
 *
 * @component
 * @returns {JSX.Element} The rendered header component.
 */


// Import necessary dependencies and components
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../providers/ThemeProvider';
import { ResponsiveContext } from '../providers/ResponsiveProvider';
import { Popover } from 'radix-ui';
import { Link, useNavigate } from 'react-router-dom'
import { FaPlus, FaMoon, FaRegSun, FaBars } from 'react-icons/fa6'
import AddPopoverOptions from './AddPopoverOptions';
import { AuthContext } from '../providers/AuthProvider';
import Logo from './Logo';



export default function Header() {
  // Contexts for theme, responsive design, and authentication
  const { theme, toggleTheme } = useContext( ThemeContext )
  const { isMobileMenuNotOpen, setIsMobileMenuNotOpen } = useContext( ResponsiveContext )
  const [ isUserLoggedIn, setIsUserLoggedIn ] = useState( false);
  const { userSession, signOut } = useContext( AuthContext );
  const navigateTo = useNavigate();

  // Effect to check if the user is logged in based on the userSession context
  useEffect( function() {
    if ( userSession && userSession.user ) {
      setIsUserLoggedIn( true );
    } else {
      setIsUserLoggedIn( false );
    }
  }, [ userSession ])


  return (
    <header className='header'>
        {/* Mobile menu toggle button, only visible when user is logged in */}
        { isUserLoggedIn && <button className="menu-toggle-button" onClick={ function() { setIsMobileMenuNotOpen( !isMobileMenuNotOpen ) } }>
          <FaBars/>
        </button>}

        {/* Logo component */}
        <Logo/>

        {/* theme toggle button */}
        <button className="theme-toggle" onClick={ () => toggleTheme() }>
            { ( theme == 'light' ) && <FaMoon/>}
            { ( theme == 'dark' ) && <FaRegSun/>}
        </button>

        {/* auth links - only visible when user is not logged in */}
        { isUserLoggedIn == false && <div className="link-group">
            <Link className="add-new" to='login'>
                log in to your account
            </Link>
            
            <Link className="add-new-outlined" to='signup'>
                sign up
            </Link>
        </div>}

        {/* Add New button - only visible when user is logged in */}
        { isUserLoggedIn && <Popover.Root>
            <Popover.Trigger asChild>
                <button className="add-new">
                    <FaPlus className='add-new-icon'/> Add New
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content side='bottom' align='end' sideOffset={10}>
                    <AddPopoverOptions/>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>}
    </header>
  )
}
