// import component's dependencies
import { useContext, useEffect, useState } from 'react'
import Layout from '../Layout'
import RouteHeading from '../components/RouteHeading'
import { Form, unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui'
import { FaArrowRightFromBracket, FaFloppyDisk, FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import IconSelect from '../components/iconSelect'
import '../Styles/Settings.css'
import { MONEY_ICONS } from '../providers/Icons'
import { AuthContext } from '../providers/AuthProvider'
import RouteError from '../components/RouteError'
import RouteLoader from '../components/RouteLoader'
import { supabaseClient } from '../providers/supabaseClient'
import { useNavigate } from 'react-router-dom'


export default function Settings() {
  // currency icon array data( with text describing currency and icon
  // representing the component name from react-icons/fa6 library )
  const currencyIconArray = [
    {
      icon: MONEY_ICONS.EURO,
      text: 'euro'
    },
    {
      icon: MONEY_ICONS.DOLLAR,
      text: 'dollar'
    },
    {
      icon: MONEY_ICONS.NAIRA,
      text: 'naira'
    },
    {
      icon: MONEY_ICONS.CEDI,
      text: 'cedi'
    },
    {
      icon: MONEY_ICONS.FRANC,
      text: 'franc'
    },
    {
      icon: MONEY_ICONS.RUPEE,
      text: 'rupee'
    },
    {
      icon: MONEY_ICONS.PESO,
      text: 'peso'
    },
    {
      icon: MONEY_ICONS.POUND,
      text: 'pound'
    },
    {
      icon: MONEY_ICONS.YEN,
      text: 'yen'
    },
  ]

  // react-router-dom navigate function
  const navigateTo = useNavigate()

  // UI loading states
  const [ isLoading, setIsLoading ] = useState( true );
  const [ error, setError ] = useState(null);
  const [ data, setData ] = useState( null );

  // auth state
  const { userSession, signOut } = useContext( AuthContext );

  // settings form state values
  const [ userName, setUserName ] = useState();
  const [ userEmail, setUserEmail ] = useState();
  const [ userPassword, setUserPassword ] = useState();
  const [ userPreferredCurrency, setUserPreferredCurrency ] = useState('FaDollarSign')

  // function to fetch user details on component mount and
  // populate form values on successful fetch
  async function fetchUserDetails() {
    try {
      setUserName(userSession.user.user_metadata.name);
      setUserEmail(userSession.user.email);
      setUserPreferredCurrency( function(){
        const user_preferred_currency = userSession.user.user_metadata.preferred_currency

        switch( user_preferred_currency ) {
          case 'dollar':
            return MONEY_ICONS.DOLLAR
          case 'euro':
            return MONEY_ICONS.EURO
          case 'naira':
            return MONEY_ICONS.NAIRA
          case 'cedi':
            return MONEY_ICONS.CEDI
          case 'franc':
            return MONEY_ICONS.FRANC
          case 'rupee':
            return MONEY_ICONS.RUPEE
          case 'peso':
            return MONEY_ICONS.PESO
          case 'pound':
            return MONEY_ICONS.POUND
          case 'yen':
            return MONEY_ICONS.YEN
        }
      })
  
      setData('loaded')
    } catch ( err ) {
      setError( err )
    } finally {
      setIsLoading( false )
    }

  }

  async function updateUserDetails( event ) {
    // prevent form default behaviour
    event.preventDefault()

    try {
      // check if password is to be modified( i.e. if it's has value ) and update accordingly
      if ( userPassword == "" ) {
        // password is not to be modified

        // update user auth data on supabase auth
        const { error } = await supabaseClient.auth.updateUser({
          email: userEmail,
          data: {
            name: userName,
            preferred_currency: currencyIconArray.find( ( currency ) => currency.icon == userPreferredCurrency ).text
          }
        })

        // update user data in 'Users' table on supabase
        const { userUpdateError } = await supabaseClient.from('Users').update(
          {
            name: userName,
            email: userEmail,
            preferred_currency: currencyIconArray.find( ( currency ) => currency.icon == userPreferredCurrency ).text
          }
        )
        .eq('user_id', userSession.user.id);

        // on successful update on both supabase auth and 'Users' table, alert users
        // with success message, if unsuccessful, alert user with error message
        if ( error || userUpdateError ) {
          alert('Error updating settings: ', error || userUpdateError )
        } else {
          alert('User Settings updated successfully. Please check your email for confirmation link')
          console.log( userSession )
        }

      } else {
        // password is to be modified

        // update user auth data on supabase auth
        const { error } = await supabaseClient.auth.updateUser({
          email: userEmail,
          password: userPassword,
          data: {
            name: userName,
            preferred_currency: currencyIconArray.find( ( currency ) => currency.icon == userPreferredCurrency ).text
          }
        })

        // update user data in 'Users' table on supabase
        const { userUpdateError } = await supabaseClient.from('Users').update(
          {
            name: userName,
            email: userEmail,
            preferred_currency: currencyIconArray.find( ( currency ) => currency.icon == userPreferredCurrency ).text
          }
        )
        .eq('user_id', userSession.user.id);


        // on successful update on both supabase auth and 'Users' table, alert users
        // with success message, if unsuccessful, alert user with error message
        if ( error || userUpdateError ) {
          alert('Error updating settings: ', error || userUpdateError )
        } else {
          alert('User Settings updated successfully. Please check your email for confirmation link')
        }
      }

    } catch( err ) {
      // if any error during execution, alert user with error message
      alert('Error updating settings: ', err )
    }
  }

  // function to sign out user from supabase auth and alert
  // user with success or error message
  async function signOutUser() {
    const { success } = await signOut();

    if ( success ) {
      alert('You have been logged out')

      navigateTo('/login')
    } else {
      alert('Error, logging you out')
    }
  }


  // useEffect to fetch user details on route mount and when userSession 
  // changes
  useEffect( function() {
    fetchUserDetails()
  }, [ userSession ])

  
  return (
    <>
      <Layout>
        {/* loader */}
        { isLoading && <RouteLoader/>}
                
        {/* error */}
        { error && <RouteError/>}

        { 
          data && <div className="settings">
            {/* route heading */}
            <RouteHeading>
              settings
            </RouteHeading>

            {/* setting's form */}
            <Form.Root className='settings--details-form' onSubmit={ updateUserDetails }>
              {/* name */}
              <Form.Field className='add-form__field'>
                <div className="add-form__label-group">
                  <Form.Label className='add-form__label'>
                    name:
                  </Form.Label>

                  <Form.Message className='add-form__message' match='valueMissing'>
                    your name can't be empty
                  </Form.Message>
                </div>

                <Form.Control asChild>
                  <input type="text" value={ userName } onChange={ (e) => setUserName(e.target.value) } className='add-form__input' required/>
                </Form.Control>
              </Form.Field>
              
              {/* email */}
              <Form.Field className='add-form__field'>
                <div className="add-form__label-group">
                  <Form.Label className='add-form__label'>
                    email:
                  </Form.Label>
                  
                  <Form.Message className='add-form__message' match='typeMismatch'>
                    your email is invalid
                  </Form.Message>
                  
                  <Form.Message className='add-form__message' match='valueMissing'>
                    your email can't be empty
                  </Form.Message>
                </div>

                <Form.Control asChild>
                  <input type="email" value={ userEmail } onChange={ (e) => setUserEmail(e.target.value) } className='add-form__input' required/>
                </Form.Control>
              </Form.Field>
              
              {/* preferred currency */}
              <Form.Field className='add-form__field'>
                <div className="add-form__label-group">
                  <Form.Label className='add-form__label'>
                    preferred currency:
                  </Form.Label>

                  { userPreferredCurrency == '' && <Form.Message className='add-form__message'>
                    you need a preferred currency
                  </Form.Message>}
                </div>

                <Form.Control asChild>
                  <IconSelect value={ userPreferredCurrency } setValue={ setUserPreferredCurrency } iconArray={ currencyIconArray }/>
                </Form.Control>
              </Form.Field>
              
              {/* password */}
              <Form.Field className='add-form__field'>
                <div className="add-form__label-group">
                  <Form.Label className='add-form__label'>
                    password:
                  </Form.Label>
                </div>

                <Form.Control asChild>
                  <PasswordToggleField.Root>
                    <div className='settings--details-form__password-ctn'>
                      <PasswordToggleField.Input className='settings--details-form__password-input' value={ userPassword } onChange={(e) => setUserPassword(e.target.value)}/>

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
              <Form.Submit className='settings--details-form__submit-btn'>
                <FaFloppyDisk className='settings--details-form__submit-icon'/>

                save profile info
              </Form.Submit>
            </Form.Root>

            {/* sign out button */}
            <button className="settings--log-out-btn" onClick={ signOutUser }>
              <FaArrowRightFromBracket className='settings--log-out-btn__icon'/>
              
              log out
            </button>
          </div>
        }
      </Layout>
    </>
  )
}
