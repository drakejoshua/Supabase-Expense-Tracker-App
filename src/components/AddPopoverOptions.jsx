/**
 * AddPopoverOptions component provides dropdown options for adding new transactions or categories.
 * It renders two alert dialogs, each containing a form (AddTransactionForm or AddCategoryForm) and handles their submission and validation.
 *
 */


// import component's dependencies
import AddTransactionForm from './AddTransactionForm';
import AddCategoryForm from './AddCategoryForm';
import Alert from './Alert';
import { useRef } from 'react';
import { FaDollarSign, FaTableList } from 'react-icons/fa6'


export default function AddPopoverOptions() {

  // Reference for the Add New Transaction form
  // This is used to access the form methods for validation and submission
  const AddNewTransactionFormRef = useRef();

  // Function to handle the submission of the Add New Transaction form
  function submitAddNewTransactionForm() {
    if (AddNewTransactionFormRef.current.checkValidity()) {
      AddNewTransactionFormRef.current.requestSubmit();
      return "close-alert";
    } else {
      AddNewTransactionFormRef.current.reportValidity();
    }
  }
  
  // Reference for the Add New Category form
  // This is used to access the form methods for validation and submission
  const AddNewCategoryFormRef = useRef();

  // Function to handle the submission of the Add New Category form
  function submitAddNewCategoryForm() {
    if (AddNewCategoryFormRef.current.checkValidity()) {
      AddNewCategoryFormRef.current.requestSubmit();
      return "close-alert";
    } else {
      AddNewCategoryFormRef.current.reportValidity();
    }
  }

  return (
    <div className={`add-dropdown-options`}>
        {/* Alert for adding a new transaction */}
        <Alert
            trigger={
            <div className="option">
                <FaDollarSign/> add new transaction
            </div>
            }
            title="Add New Transaction"
            description="Fill in the details for your new transaction."
            action={<span>Add Transaction</span>}
            onAction={submitAddNewTransactionForm}
        >
            <AddTransactionForm ref={AddNewTransactionFormRef} />
        </Alert>
        
        {/* Alert for adding a new category */}
        <Alert
            trigger={
            <div className="option">
                <FaTableList/> add new category
            </div>
            }
            title="Add New Category"
            description="Fill in the details for your new category."
            action={<span>Add category</span>}
            onAction={submitAddNewCategoryForm}
        >
            <AddCategoryForm ref={AddNewCategoryFormRef} />
        </Alert>
    </div>
  )
}
