// import component's dependencies
import { Form } from 'radix-ui'
import { Link, useNavigate } from 'react-router-dom'
import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui'
import { FaRegEyeSlash, FaRegEye, FaBolt, FaFloppyDisk, FaGoogle, FaTwitter } from 'react-icons/fa6'
import '../Styles/Signup.css'
import FormAltText from '../components/FormAltText'
import { AuthContext } from '../providers/AuthProvider'
import { useContext, useState } from 'react'


export default function Signup() {
  // auth state
  const { signUp } = useContext( AuthContext )

  // react-router-dom navigate function
  const navigateTo = useNavigate();

  // signup form values
  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");

  // UI loading states
  const [ loading, setLoading ] = useState( false );
  const [ error, setError ] = useState( "" )


  // function to submit signup user data to supabase on form-submit
  // and auth users. if signup data is accepted, redirect users to dashboard
  // else alert signup errors
  async function handleSubmit( event ) {
    // prevent form default behaviour
    event.preventDefault();

    // reset UI states
    setLoading( true )
    setError( "" )

    try {
      const { success, error } = await signUp( name, email, password );

      if ( success ) {
        navigateTo('/')
      } else {
        setError( error.message )
        console.log('error signing up: ', error )
        alert( error.message )
      }
    } catch( error ) {
      setError( error.message )
      alert( error.message )
      console.log('error signing up: ', error )
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
        {/* name */}
        <Form.Field className='add-form__field'>
            <div className="add-form__label-group">
                <Form.Label className='add-form__label'>
                    name:
                </Form.Label>

                <Form.Message match="valueMissing" className='add-form__message'>
                    Please enter your name
                </Form.Message>
            </div>
            
            <Form.Control asChild>
                <input type="text" required className='add-form__input' value={ name } onChange={( e ) => setName( e.target.value )}/>
            </Form.Control>
        </Form.Field>

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
                <PasswordToggleField.Input className='settings--details-form__password-input' value={ password } onChange={( e ) => setPassword( e.target.value )}/>

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

        {/* submit button */}
        <Form.Submit className='settings--details-form__submit-btn' disabled={loading}>
          { loading && <>loading...</> }
          { !loading && <>sign up</> }
        </Form.Submit>

        {/* alt text - form's navigate to signin/login alternative */}
        <FormAltText linkText='login' text="have an account?" link='login'/>
      </Form.Root>
    </div>
  )
}
