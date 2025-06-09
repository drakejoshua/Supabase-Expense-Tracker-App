/**
 * Logo component that displays the application logo and name.
 * Acts as a link to the home page.
 *
 * @component
 * @returns {JSX.Element} A clickable logo with an icon and app name.
 */

import { Link } from "react-router-dom"
import { FaBolt } from "react-icons/fa6"

export default function Logo() {
  return (
    <Link to={'/'} className="layout-logo">
        <FaBolt/>

        <span className="layout-logo-text">
            QuBooks
        </span>
    </Link>
  )
}
