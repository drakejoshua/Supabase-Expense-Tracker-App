import React from 'react'
import { FaPlus } from 'react-icons/fa6'

// This component is used to render a button with a plus icon at the bottom right of the screen.
// It is used to add new categories and transactions.
const AddButton = React.forwardRef( ( { className, ...props }, ref ) => {
  return (
    <button className={`add-btn ${ className }`} {...props} ref={ref}>
      <FaPlus className='add-btn__icon'/>
    </button>
  )
})

AddButton.displayName = 'AddButton';


export default AddButton;