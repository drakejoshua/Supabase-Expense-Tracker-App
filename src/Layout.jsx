/**
 * Layout component that serves as the main structural wrapper for the application.
 * 
 * It includes a header and a responsive sidebar navigation with links to key sections:
 * Dashboard, Transactions, Categories, and Settings. The navigation adapts its visibility
 * based on the `isMobileMenuNotOpen` value from the ResponsiveContext, allowing for a
 * mobile-friendly design. The main content is rendered via the `children` prop.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to be displayed within the layout.
 * @returns {JSX.Element} The rendered layout structure with navigation and content area.
 */


// import component's dependencies
import { FaGears, FaTableList, FaChalkboardUser, FaCircleDollarToSlot } from 'react-icons/fa6'
import { NavLink } from 'react-router-dom'
import Header from './components/Header'
import { useContext } from 'react'
import { ResponsiveContext } from './providers/ResponsiveProvider'

export default function Layout({ children }) {
  // use ResponsiveContext to determine if the mobile menu is not open
  const { isMobileMenuNotOpen } = useContext( ResponsiveContext )

  return (
      <div className='layout'>
        {/* Render Header component at the top of the layout */}
        <Header/>

        <div className="layout-flex">
          {/* Render navigation links in a sidebar */}
          {/* The className is conditionally applied based on the isMobileMenuNotOpen value */}
          <nav className={`layout-nav ${ isMobileMenuNotOpen ? "open": "" }`}>
              <NavLink to={'/'} className={'layout-nav-link'}>
                  <FaChalkboardUser/> Dashboard 
              </NavLink>

              <NavLink to={'/transactions'} className={'layout-nav-link'}>
                  <FaCircleDollarToSlot/> transactions 
              </NavLink>

              <NavLink to={'/categories'} className={'layout-nav-link'}>
                  <FaTableList/> categories 
              </NavLink>

              <NavLink to={'/settings'} className={'layout-nav-link'}>
                  <FaGears/> settings 
              </NavLink>
          </nav>

          <div className='layout-content-ctn'>
            <div className="layout-content">
              {
                children
              }
            </div>
          </div>
        </div>
      </div>
  )
}
