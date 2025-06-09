/**
 * RouteHeading component renders its children inside an <h1> element
 * with a "route-heading" CSS class. Useful for displaying page or route titles.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to display inside the heading.
 * @returns {JSX.Element} The rendered heading element.
 */


export default function RouteHeading({ children }) {
  return (
    <h1 className="route-heading">{ children }</h1>
  )
}
