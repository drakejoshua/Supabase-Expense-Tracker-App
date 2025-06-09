// import provider's dependencies
import { createContext, useEffect, useState } from 'react'
import { supabaseClient } from './supabaseClient'
import { CATEGORY_ICONS } from './Icons'

// create and export provider's context
export const AuthContext = createContext()


export default function AuthProvider({ children }) {
  // stateful variable to auth session
  const [ userSession, setUserSession ] = useState( null );

  // function to sign-up new users to supabase using their name, 
  // email and password as provided and also insert default categories 
  // for new users into 'Categories' table, if successful, return new user data
  // else return error
  async function signUp( name, email, password ) {
    try {
        // sign up the user with email and password to Supabase
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    preferred_currency: 'dollar'
                }
            }
        })

        // if there is an error during sign up, return the error
        if ( error ) {
            return { success: false, error: error, data: null }
        }

        // if sign up is successful, insert the user data into the 'Users' table
        // insert default categories for new users into the 'Categories' table
        // using the data from the session
        const { insertError } = await supabaseClient
            .from('Users')
            .insert({
                created_at: data.session.user.created_at,
                name: data.session.user.user_metadata.name,
                email: data.session.user.email,
                preferred_currency: data.session.user.user_metadata.preferred_currency
            })
        const { insertCategoryError } = await supabaseClient
            .from('Categories')
            .insert(
                [
                    {
                        name: 'income',
                        icon: CATEGORY_ICONS.INCOME
                    },
                    {
                        name: 'expense',
                        icon: CATEGORY_ICONS.EXPENSE
                    },
                    {
                        name: 'food',
                        icon: CATEGORY_ICONS.FOOD
                    },
                    {
                        name: 'healthcare',
                        icon: CATEGORY_ICONS.HEALTHCARE
                    },
                    {
                        name: 'utility',
                        icon: CATEGORY_ICONS.UTILITY
                    },
                    {
                        name: 'transport',
                        icon: CATEGORY_ICONS.TRANSPORT
                    },
                ]
            )
        
        // if there is an error during the insert, return the error
        if ( insertError || insertCategoryError ) {
            console.log('database error ', insertCategoryError, insertError )
            return { success: false, error: insertError || insertCategoryError, data: null }
        }

        // if everything is successful, return the new user data
        return { success: true, data, error: null }
    } catch( error ) {
        // return any errors during the execution of signup code
        return { success: false, error: error, data: null }
    }
  }
  
  // function to sign-in users into app using their
  // email and password as provided using supabase auth
  // if successful, return user data else return error
  async function signIn( email, password ) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        })

        if ( error ) {
            return { success: false, error: error, data: data }
        }

        return { success: true, data }
    } catch( error ) {
        console.log('signin error ', error )
        return { success: false, error: error }
    }
  }
  
  // function to sign-in users into app using their
  // email as provided using supabase auth ( magic link )
  // if successful, return user data else return error
  async function signInWithoutPassword( email ) {
    try {
        const { data, error } = await supabaseClient.auth.signInWithOtp({
            email: email,
            options: {
                emailRedirectTo: 'http://localhost:5173/'
            }
        })

        if ( error ) 
            return { success: false, error: error, data: data }

        return { success: true, error: error, data: data }
    } catch ( error ) {
        console.log('sign in without password error ', error )
        return { success: false, error: error, data: null }
    }
  }

  // function to sign-out users out of the app using supabase auth
  // if successful, return success object else error object
  async function signOut() {
    try {
        const { error } = await supabaseClient.auth.signOut()

        if ( error ) {
            return { success: false, error: error, data: null }
        }

        return { success: true, error: error, data: null }
    } catch ( err ) {
        return { success: false, error: err, data: null }
    }
  }

  // useEffect to get and update current signed-in session data from supabase
  //  if any and also watch out for auth event/changes
  useEffect( function() {
    // get and update current signed-in session data
    supabaseClient.auth.getSession().then( function({ data }) {
        setUserSession( data.session )
    })

    // watch out for auth event/changes
    supabaseClient.auth.onAuthStateChange( function( event, session ) {
        setUserSession( session )
    })
  }, [])

  return (
    <AuthContext value={ { userSession, signIn, signUp, signInWithoutPassword, signOut } }>
        { children }
    </AuthContext>
  )
}
