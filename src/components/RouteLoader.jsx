/**
 * RouteLoader component displays a loading spinner and message
 * to indicate that a page or route is currently loading.
 *
 * @component
 * @returns {JSX.Element} A loading indicator with spinner and text.
 */


import { FaSpinner } from 'react-icons/fa6'

export default function RouteLoader() {
  return (
    <div className="route--loading">
    <FaSpinner className="route--loading__spinner"/>
    
    <span className="route--loading__text">
        loading page...
    </span>
    </div>
  )
}
