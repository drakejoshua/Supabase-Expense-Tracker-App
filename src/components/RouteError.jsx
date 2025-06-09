/**
 * RouteError component displays an error message with a retry option.
 *
 * @component
 * @param {Object} props
 * @param {Function} props.handleRetry - Callback function to retry loading data when the retry button is clicked.
 * @returns {JSX.Element} The rendered error UI with a retry button.
 */


import { FaTriangleExclamation, FaRotateRight } from 'react-icons/fa6'

export default function RouteError({ handleRetry }) {
  return (
    <div className="route--error">
        <FaTriangleExclamation className="route--error__icon"/>

        <h3 className="route--error__heading">
          Error loading data
        </h3>
        
        <p className="route--error__error-text">
          there was an error loading the data
        </p>

        <button className="route--error__retry-btn" onClick={ handleRetry }>
          <FaRotateRight className="route--error__retry-icon"/>

          retry
        </button>
    </div>
  )
}
