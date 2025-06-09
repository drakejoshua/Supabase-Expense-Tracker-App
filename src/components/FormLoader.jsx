/**
 * FormLoader component displays a loading spinner and optional child elements.
 * for indicating loading states within forms.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elements to render alongside the spinner.
 * @returns {JSX.Element} The rendered loader component.
 */
import { FaSpinner } from "react-icons/fa6"


export default function FormLoader({ children }) {
  return (
    <div className="add-form__element--no-data">
        <FaSpinner className='add-form__loading-spinner'/>

        { children }
    </div>
  )
}
