/**
 * FormError component displays an error message with an exclamation icon.
 *
 * @component
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The error message or content to display.
 * @returns {JSX.Element} The rendered error message component.
 */


import { FaTriangleExclamation } from "react-icons/fa6"


export default function FormError({ children }) {
  return (
    <div className="add-form__element--no-data">
        <FaTriangleExclamation className='add-form__error-icon'/>

        { children }
    </div>
  )
}
