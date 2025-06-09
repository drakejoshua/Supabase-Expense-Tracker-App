/**
 * AddTransactionForm component allows users to add a new transaction (expense or income)
 * by filling out a form with details such as type, title, amount, description, date, and category.
 * It fetches user categories from Supabase and handles form submission to insert a new transaction.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {React.Ref} [formRef] - Ref forwarded to the form element.
 * @returns {JSX.Element} The rendered AddTransactionForm component.
 */



// import component's dependencies
import { Form } from 'radix-ui'
import React, { useContext, useEffect, useState } from 'react'
import IconSelect from './iconSelect';
import FormLoader from './FormLoader';
import FormError from './FormError';
import { supabaseClient } from '../providers/supabaseClient';
import { AuthContext } from '../providers/AuthProvider';
import { CATEGORY_ICONS } from '../providers/Icons';

const AddTransactionForm = React.forwardRef( function( { className, ...props }, formRef ) {
  // supabase user-session data
  const { userSession } = useContext( AuthContext )

  // form values
  const [ type, setType ] = useState( CATEGORY_ICONS.EXPENSE );
  const [ category, setCategory ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ amount, setAmount ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ date, setDate ] = useState('');

  // array of icons for the type icon select
  const typeIconArray = [ 
    { 
        icon: CATEGORY_ICONS.EXPENSE,
        text: 'expense'
    },
    { 
        icon: CATEGORY_ICONS.INCOME,
        text: 'income'
    }
  ]
  
  // array of icons for the category icon select
  const [ categoryIconArray, setCategoryIconArray ] = useState([])

  // Form loading states
  const [ isCategoryLoading, setIsCategoryLoading ] = useState( true )
  const [ isCategoryLoaded, setIsCategoryLoaded ] = useState( false )
  const [ isCategoryError, setIsCategoryError ] = useState( false )

  // fetch user categories on component mount
  // this function fetches the categories from the 'Categories' table in the supabase database
  async function fetchUserCategories() {
    try {
        if ( userSession ) {
            const { data, error } = await supabaseClient.from('Categories').select('category_id, name, icon')

            if ( error ) {
                setIsCategoryError( true )
            }

            setCategoryIconArray( data.map( function( item ) {
                return { category_id: item.category_id, icon: item.icon, text: item.name }
            }) )
            setIsCategoryLoaded( true )
        }
    } catch( err ) {
        setIsCategoryError( true )
    } finally {
        setIsCategoryLoading( false )
    }
  }

  // useEffect to fetch user categories when the component mounts
  useEffect(function() {
    fetchUserCategories()
  }, [])


  // add new transaction to supabase on form submit
  async function handleAddNewTransaction( event ) {

    // prevent default form submission behavior
    event.preventDefault();

    try {
        if ( type != "" && category != "" ) {
            const { error } = await supabaseClient.from('Transactions').insert({
                type: type == CATEGORY_ICONS.EXPENSE ? 'expense' : 'income',
                title: title,
                description: description,
                category_id: categoryIconArray.find( ( categoryIcon ) => categoryIcon.icon == category ).category_id,
                amount: amount,
                date: date,
            })

            if ( error ) {
                alert(error)
            } else {
                alert('Transaction added successfully')
            }
        }
    } catch( err ) {
        alert(err)
    }
  }


  return (
    <Form.Root className={"add-form " + className } ref={ formRef } { ...props } onSubmit={ handleAddNewTransaction }>
        {/* type */}
        <Form.Field className='add-form__field'>
            <div className="add-form__label-group">
                <Form.Label className='add-form__label'>
                    Type:
                </Form.Label>
                
                { type == "" && <Form.Message className='add-form__message'>
                    please choose a type for the transaction
                </Form.Message>}
            </div>
            
            <IconSelect iconArray={ typeIconArray } value={ type } setValue={ setType } />
        </Form.Field>

        {/* title */}
        <Form.Field className='add-form__field'>
            <div className="add-form__label-group">
                <Form.Label className='add-form__label'>
                    Title:
                </Form.Label>

                <Form.Message match="valueMissing" className='add-form__message'>
                    Please enter a title for the transaction
                </Form.Message>
            </div>
            
            <Form.Control asChild>
                <input type="text" required className='add-form__input' value={ title } onChange={ (e) => setTitle( e.target.value ) }/>
            </Form.Control>
        </Form.Field>
        
        {/* amount */}
        <Form.Field className='add-form__field'>
            <div className="add-form__label-group">
                <Form.Label className='add-form__label'>
                Amount:
                </Form.Label>

                <Form.Message match="valueMissing" className='add-form__message'>
                Please enter an amount for the transaction
                </Form.Message>
                
                <Form.Message match="typeMismatch" className='add-form__message'>
                Please enter an amount for the transaction
                </Form.Message>
            </div>
            
            <Form.Control asChild>
                <input type="number" required className='add-form__input' value={ amount } onChange={ (e) => setAmount( e.target.value ) }/>
            </Form.Control>
        </Form.Field>

        {/* description */}
        <Form.Field className='add-form__field'>
            <div className="add-form__label-group">
                <Form.Label className='add-form__label'>
                Description:
                </Form.Label>

                <Form.Message match="valueMissing" className='add-form__message'>
                Please enter a description for the transaction
                </Form.Message>
            </div>
            
            <Form.Control asChild>
                <textarea type="text" required className='add-form__textarea' value={ description } onChange={ (e) => setDescription( e.target.value ) }/>
            </Form.Control>
        </Form.Field>
        
        {/* date */}
        <Form.Field className='add-form__field'>
            <div className="add-form__label-group">
                <Form.Label className='add-form__label'>
                    Date:
                </Form.Label>

                <Form.Message match="valueMissing" className='add-form__message'>
                    Please enter a Date for the transaction
                </Form.Message>
            </div>
            
            <Form.Control asChild>
                <input type="datetime-local" required className='add-form__input' 
                    value={date ? date.slice(0, 16) : ''}
                    onChange={(e) => {
                        const localDateTimeString = e.target.value;
                        const dateObj = new Date(localDateTimeString);
                        setDate(dateObj.toISOString());
                    }}
                />
            </Form.Control>
        </Form.Field>
        
        {/* category */}
        <Form.Field className='add-form__field'>
            <div className="add-form__label-group">
                <Form.Label className='add-form__label'>
                    category:
                </Form.Label>

                { category == "" && <Form.Message className='add-form__message'>
                    please choose a category for the transaction
                </Form.Message>}
            </div>
            
            { isCategoryLoaded && <IconSelect iconArray={ categoryIconArray } 
                value={ category } setValue={ setCategory } />}

            { isCategoryLoading && <FormLoader>
                loading your categories
            </FormLoader>}

            { isCategoryError && <FormError>
                error loading categories
            </FormError>}
        </Form.Field>
    </Form.Root>
  )
})

AddTransactionForm.displayName = 'AddTransactionForm';


export default AddTransactionForm;
