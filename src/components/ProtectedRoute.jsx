/**
 * ProtectedRoute is a React component that restricts access to its children
 * based on the user's authentication status. If the user is not authenticated,
 * it redirects them to the login page. While authentication status is being determined,
 * it displays a loading message.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components to render if the user is authenticated.
 * @returns {React.ReactNode} The protected content or a loading message.
 */


import { useContext, useEffect } from 'react'
import { AuthContext } from '../providers/AuthProvider'
import { useNavigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { userSession } = useContext( AuthContext );
  const navigateTo = useNavigate()

  useEffect( function() {
    if ( !userSession ) {
        navigateTo( '/login' )
    }
  }, [])

  if ( userSession?.user == null ) {
    return <div> loading... </div>
  }
   
  return <>{ children }</>
}
