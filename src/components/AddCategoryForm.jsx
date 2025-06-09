/**
 * AddCategoryForm component allows users to create a new category by providing a name and selecting an icon.
 * Utilizes Radix UI's Form components for structure and validation, and integrates with Supabase for data storage.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} [props.className] - Additional class names for styling.
 * @param {React.Ref} [formRef] - Ref forwarded to the form element.
 * @returns {JSX.Element} The rendered AddCategoryForm component.
 */


// import component's dependencies
import { Form } from 'radix-ui'
import React, { useState } from 'react'
import IconSelect from './iconSelect';
import { CATEGORY_ICONS } from '../providers/Icons';
import { supabaseClient } from '../providers/supabaseClient';

// Define an array of icon objects to be used in the icon select component in the form
export const iconArray = [ 
    { icon: CATEGORY_ICONS.ENTERTAINMENT },
    { icon: CATEGORY_ICONS.GAMING },
    { icon: CATEGORY_ICONS.COURSES },
    { icon: CATEGORY_ICONS.WORK },
    { icon: CATEGORY_ICONS.SHOPPING },
    { icon: CATEGORY_ICONS.COOKING },
    { icon: CATEGORY_ICONS.HOUSING },
    { icon: CATEGORY_ICONS.BILLS },
    { icon: CATEGORY_ICONS.BOOK },
    { icon: CATEGORY_ICONS.BOOKMARK },
    { icon: CATEGORY_ICONS.CODING },
    { icon: CATEGORY_ICONS.CLOTHING }
]

const AddCategoryForm = React.forwardRef( function( { className, ...props }, formRef ) {
  // State to manage the selected icon and category name
  const [ selectedIcon, setSelectedIcon ] = useState('');
  const [ name, setName ] = useState('');

  // Function to add new category to the supabase database
  // It prevents the default form submission behavior, checks if an icon is selected,
  // and then attempts to insert the new category into the 'Categories' table.
  // If successful, it alerts the user; otherwise, it displays an error message.
  async function handleAddNewCategory( event ) {
    event.preventDefault();

    try {
        if ( selectedIcon != '' ) {
            const { error } = await supabaseClient.from('Categories').insert({
                name: name,
                icon: selectedIcon,
            })

            if ( error ) {
                alert( error )
            } else {
                alert('Category added sucessfully')
            }
        }
    } catch( err ) {
        alert( err )
    }
  }

  return (
    // Render the form using Radix UI's Form components
    <Form.Root className={"add-form " + className } ref={ formRef } { ...props } onSubmit={ handleAddNewCategory }>
        
        {/* name */}
        <Form.Field className='add-form__field'>
            <div className="add-form__label-group">
                <Form.Label className='add-form__label'>
                    name:
                </Form.Label>

                <Form.Message match="valueMissing" className='add-form__message'>
                    Please enter a name for the category
                </Form.Message>
            </div>
            
            <Form.Control asChild>
                <input type="text" required className='add-form__input' value={ name } 
                  onChange={ ( e ) => setName( e.target.value )}/>
            </Form.Control>
        </Form.Field>
        
        {/* icon-select */}
        <Form.Field className='add-form__field'>
            <div className="add-form__label-group">
                <Form.Label className='add-form__label'>
                    icon:
                </Form.Label>
    
                { selectedIcon == "" && <Form.Message className='add-form__message'>
                    Please select an icon for the category
                </Form.Message>}
            </div>

            <IconSelect iconArray={ iconArray } value={ selectedIcon } setValue={ setSelectedIcon } />
        </Form.Field>
    </Form.Root>
  )
})

AddCategoryForm.displayName = 'AddCategoryForm';


export default AddCategoryForm;
