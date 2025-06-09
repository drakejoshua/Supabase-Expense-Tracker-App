/**
 * IconSelect component renders a group of selectable icons using Radix UI's ToggleGroup.
 * Allows users to pick a single icon from a provided array, optionally displaying a label for each icon.
 *
 * @component
 * @param {Object[]} iconArray - Array of icon data objects, each containing an `icon` key (string, icon name from react-icons/fa6) and optional `text` (string).
 * @param {string} value - The currently selected icon's name.
 * @param {function} setValue - Callback to update the selected icon's value.
 *
 * @example
 * <IconSelect
 *   iconArray={[{ icon: 'FaBeer', text: 'Beer' }, { icon: 'FaCoffee', text: 'Coffee' }]}
 *   value={selectedIcon}
 *   setValue={setSelectedIcon}
 * />
 */


// import component's dependencies
import { Form } from 'radix-ui';
import { ToggleGroup } from 'radix-ui';
import * as icons from 'react-icons/fa6';


export default function IconSelect({ iconArray, value, setValue }) {
  return (
    <Form.Control asChild>
        <ToggleGroup.Root type='single' className='add-form__icon-select' value={ value } 
            onValueChange={ setValue } aria-label="Select an icon">
            {
                iconArray.map( function( iconData , index ) {
                    // get icon component from react-icons/fa6 using the icon name
                    const Icon = icons[ iconData.icon ];

                    return (
                        <div className="add-form__item-group" key={index}>
                            <ToggleGroup.Item key={ index } className='add-form__select-item' value={ iconData.icon }>
                                <Icon className='add-form__item-icon' />
                            </ToggleGroup.Item>

                            { iconData.text && <div className="add-form__select-text">
                                { iconData.text }
                            </div> }
                        </div>
                    )
                })
            }
        </ToggleGroup.Root>
    </Form.Control>
  )
}
