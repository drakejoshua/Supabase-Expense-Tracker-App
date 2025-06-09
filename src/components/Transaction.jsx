/**
 * Transaction component displays a single transaction's details and provides options to view more information or delete the transaction.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string|number} props.id - Unique identifier for the transaction
 * @param {'income'|'expense'} props.type - Type of the transaction
 * @param {string} props.title - Title or name of the transaction
 * @param {string} props.date - Date of the transaction
 * @param {string} props.category - Category of the transaction
 * @param {number|string} props.amount - Amount involved in the transaction
 * @param {string} props.description - Description or notes about the transaction
 * @returns {JSX.Element} The rendered Transaction component
 */


// import component's dependencies
import { FaCircleArrowUp, FaCircleArrowDown, FaPrint, FaTrashCan } from 'react-icons/fa6'
import Alert from './Alert'
import { supabaseClient } from '../providers/supabaseClient'


export default function Transaction({ id, type, title, date, category, amount, description }) {

  // Function to delete a transaction by its ID from
  // the 'Transactions' table in Supabase
  async function deleteTransactionUsingID() {
    const { error } = await supabaseClient.from('Transactions').delete()
        .eq('transaction_id', id )

    if ( error ) {
        alert('Error deleting transaction')
        console.log('transaction delete error: ', error)
    } else {
        alert('Transaction deleted successfully')
    }

    return 'close-alert'
  }

  return (
    <Alert
        trigger={
            // Trigger element - shows how the transaction looks like in the list
            // It displays the transaction type icon, title, date, category, and amount
            // and also triggers the alert dialog on click to show transaction details and 
            // delete option
            <div className="transaction transaction--hover">
                { type == 'income' && <FaCircleArrowDown className="transaction__icon"/>}
                { type == 'expense' && <FaCircleArrowUp className="transaction__icon"/>}

                <div className="transaction__details">
                    <span className="transaction__title">
                        { title }
                    </span>

                    <span className="transaction__date">
                        { date }
                    </span>
                </div>

                <span className="transaction__category transaction__category--parent-hover">
                    { category }
                </span>
                
                <span className="transaction__amount">
                    { amount }
                </span>
            </div>
        }

        title={ title }
        description={ description}
        action={
            <>
                <FaTrashCan className="transaction__delete-icon"/>

                <span className='transaction__delete-text'> Delete Transaction </span>
            </>
        }
        onAction={ deleteTransactionUsingID }
    >
        {/* Transaction receipt - shows detailed information about the transaction */}
        <div className="transaction__receipt">
            <div className="transaction__receipt-row">
                <span className="transaction__receipt-label">Type:</span>
                <span className="transaction__receipt-value">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </div>
            <div className="transaction__receipt-row">
                <span className="transaction__receipt-label">Date:</span>
                <span className="transaction__receipt-value">{date}</span>
            </div>
            <div className="transaction__receipt-row">
                <span className="transaction__receipt-label">Category:</span>
                <span className="transaction__receipt-value">{category}</span>
            </div>
            <div className="transaction__receipt-row">
                <span className="transaction__receipt-label">Amount:</span>
                <span className="transaction__receipt-value">{amount}</span>
            </div>
        </div>
    </Alert>
  )
}
