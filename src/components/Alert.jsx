/**
 * Alert component using Radix UI's AlertDialog.
 * 
 * Renders a customizable alert dialog with a trigger, title, description, and action button.
 * The dialog can be controlled via internal state and supports custom actions on confirmation.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.trigger - The element that triggers the alert dialog.
 * @param {React.ReactNode} props.children - Additional content to render inside the dialog.
 * @param {string} props.title - The title displayed at the top of the alert dialog.
 * @param {string} props.description - The description text shown in the dialog.
 * @param {React.ReactNode} props.action - The content of the action button (e.g., button label).
 * @param {Function} props.onAction - Callback function called when the action button is clicked. If it returns 'close-alert', the dialog will close.
 *
 * @returns {JSX.Element} The rendered alert dialog component.
 */


// import component's dependencies
import { AlertDialog } from 'radix-ui'
import { useState } from 'react'
import { FaXmark } from 'react-icons/fa6'


export default function Alert({ trigger, children, title, description, action, onAction }) {
  // State to manage the open/close state of the alert dialog
  const [ isAlertOpen, setIsAlertOpen ] = useState( false );

  return (
    <AlertDialog.Root className="alert-dialog" open={ isAlertOpen }>
        {/* Trigger element/jsx - that opens the alert dialog */}
        <AlertDialog.Trigger asChild onClick={ () => setIsAlertOpen( !isAlertOpen )}>
            { trigger }
        </AlertDialog.Trigger>

        <AlertDialog.Portal>
            <AlertDialog.Overlay className="alert-dialog__overlay" />

            <AlertDialog.Content className="alert-dialog__content">

                <div className="alert-dialog__header">
                    {/* Close button */}
                    <AlertDialog.Cancel className='alert-dialog__cancel-btn' onClick={ () => setIsAlertOpen( !isAlertOpen )}>
                        <FaXmark className='alert-dialog__cancel-btn-icon'/>
                    </AlertDialog.Cancel>
                </div>

                {/* Title */}
                <AlertDialog.Title className='alert-dialog__title'>
                    { title }
                </AlertDialog.Title>

                {/* Description */}
                <AlertDialog.Description className='alert-dialog__description'>
                    { description }
                </AlertDialog.Description>

                {/* Children - additional content inside the dialog */}
                {
                    children
                }

                {/* Action button */}
                {/* contains logic to close the alert dialog on button click */}
                <AlertDialog.Action className='alert-dialog__action-btn'
                    onClick={async () => {
                        const result = await onAction();

                        if (result === 'close-alert') {
                            setIsAlertOpen(false);
                        }
                    }}
                >
                    { action }
                </AlertDialog.Action>

            </AlertDialog.Content>
        </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
