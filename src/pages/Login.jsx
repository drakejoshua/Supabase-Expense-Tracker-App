// import component's dependencies
import { Form } from 'radix-ui'
import { Link, useNavigate } from 'react-router-dom'
import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui'
import { FaRegEyeSlash, FaRegEye, FaBolt, FaFloppyDisk, FaGoogle, FaTwitter } from 'react-icons/fa6'
import '../Styles/Signup.css'
import FormAltText from '../components/FormAltText'
import { AuthContext } from '../providers/AuthProvider'
import { useContext, useEffect, useState } from 'react'


export default function Login() {
  // auth state
  const { userSession, signIn, signInWithoutPassword } = useContext( AuthContext )

  // react-router-dom navigate function
  const navigateTo = useNavigate();

  // login form values
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  // UI loading states
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( "" )

  // useEffect to check if any user logged-in and navigate to 
  // dashboard instead
  useEffect( function() {
    if ( userSession ) {
      navigateTo('/')
    }
  }, [ userSession ])

  // function to submit login credentials to supabase on form-submit
  // and auth users. if login crednetials is correct, redirect users to dashboard
  // else alert login errors
  async function handleSubmit( event ) {
    // prevent form default behaviour
    event.preventDefault();

    // reset UI states
    setLoading( true )
    setError( "" )

    try {
      const { success, error } = await signIn( email, password );

      if ( success ) {
        navigateTo('/')
      } else {
        setError( error.message )
        alert( error.message )
      }
    } catch( error ) {
      setError( error.message )
    } finally {
      setLoading( false )
    }
  }

  // function to login users passwordlessly if password is forgotten using
  // supabase magic link auth
  async function handleSignInWithoutPassword( ) {
    // reset UI state
    setLoading( true )
    setError( "" )

    try {
      const { success, error } = await signInWithoutPassword( email );

      if ( success ) {
        alert( "Check your email to sign-in" )
      } else {
        setError( error.message )
        alert( error.message )
      }
    } catch( error ) {
      setError( error.message )
    } finally {
      setLoading( false )
    }
  }

  return (
    <div className="signup">
      {/* logo */}
      <Link to={'/'} className="signup--logo">
        <FaBolt/>

        <span className="signup--logo__text">
            QuBooks
        </span>
      </Link>

      <Form.Root className="add-form" onSubmit={ handleSubmit }>
        {/* email */}
        <Form.Field className='add-form__field'>
            <div className="add-form__label-group">
                <Form.Label className='add-form__label'>
                    email:
                </Form.Label>

                <Form.Message match="valueMissing" className='add-form__message'>
                    Please enter your email
                </Form.Message>
                
                <Form.Message match="typeMismatch" className='add-form__message'>
                    Please enter a valid email
                </Form.Message>
            </div>
            
            <Form.Control asChild>
                <input type="email" required className='add-form__input' value={ email } onChange={( e ) => setEmail( e.target.value )}/>
            </Form.Control>
        </Form.Field>

        {/* password */}
        <Form.Field className='add-form__field'>
          <div className="add-form__label-group">
            <Form.Label className='add-form__label'>
              password:
            </Form.Label>

            <Form.Message className='add-form__message' match='valueMissing'>
              please enter a password
            </Form.Message>
          </div>

          <Form.Control asChild>
            <PasswordToggleField.Root>
              <div className='settings--details-form__password-ctn'>
                <PasswordToggleField.Input className='settings--details-form__password-input' 
                  value={ password } onChange={( e ) => setPassword( e.target.value )}/>

                <PasswordToggleField.Toggle className='settings--details-form__password-toggle'>
                  <PasswordToggleField.Icon className='settings--details-form__password-icon'
                    visible={<FaRegEyeSlash/>}
                    hidden={<FaRegEye/>}
                  />
                </PasswordToggleField.Toggle>
              </div>
            </PasswordToggleField.Root>
          </Form.Control>
        </Form.Field>

        {/* login options */}
        <div className="signup--form-options">
          <div className="signup--form-options__remember-option">
            <input type="checkbox" id='remember-checkbox' className='signup--form-options__remember-checkbox'/>

            <label htmlFor="remember-checkbox" className='signup--form-options__remember-label'>
              remember me
            </label>
          </div>

          <span to='/' className="signup--form-options__reset-option" onClick={ handleSignInWithoutPassword }>
            forgot password?
          </span>
        </div>

        {/* submit button */}
        <Form.Submit className='settings--details-form__submit-btn' disabled={ loading }  >
          { loading && <>loading...</> }
          { !loading && <>login</> }
        </Form.Submit>

        {/* alt text - form's navigate to signup alternative */}
        <FormAltText linkText='signup' text="don't have an account?" link='signup'/>
      </Form.Root>
    </div>
  )
}
