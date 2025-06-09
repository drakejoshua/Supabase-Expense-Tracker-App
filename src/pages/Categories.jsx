// import route styles
import "../Styles/Categories.css";

// import components
import Layout from "../Layout";
import AddButton from "../components/AddButton";
import Transaction from "../components/Transaction";
import * as Icons from 'react-icons/fa6';
import {
  FaBowlRice,
  FaCarSide,
  FaDollarSign,
  FaGear,
  FaPencil,
  FaTrash,
  FaPlugCircleBolt
} from "react-icons/fa6";
import Alert from "../components/Alert";
import AddCategoryForm from "../components/AddCategoryForm";
import { useEffect, useRef, useState, useContext } from "react";
import { ThemeContext } from "../providers/ThemeProvider";
import { Chart } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2'
import RouteError from '../components/RouteError'
import RouteLoader from '../components/RouteLoader'
import { AuthContext } from "../providers/AuthProvider";
import { supabaseClient } from "../providers/supabaseClient";
import { MONEY_ICONS } from "../providers/Icons";
import { Form, Popover } from "radix-ui";
import { CATEGORY_ICONS } from "../providers/Icons";
import IconSelect from "../components/iconSelect";



export default function Categories() {
  // route state, refs and contexts
  const formRef = useRef();
  const [ chartBgColor, setChartBgColor ] = useState(function() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--brand-black')
      .trim();
  });
  const { theme } = useContext(ThemeContext);       // get the current theme from the ThemeContext

  // state variables
  const [ isLoading, setIsLoading ] = useState( true );
  const [ error, setError ] = useState(null);
  const [ data, setData ] = useState([])

  // auth context
  const { userSession } = useContext( AuthContext );

  // chart data
  const [ chartData, setChartData ] = useState( null )

  // miscellaneous state variables
  const [ preferredCurrency, setPreferredCurrency ] = useState( Icons[ MONEY_ICONS.DOLLAR ] )
  const [ categoryEditIcon, setCategoryEditIcon ] = useState('a')
  const [ categoryEditName, setCategoryEditName ] = useState('')
  const editFormRef = useRef()

  // Function to submit the edit form
  // It checks the validity of the form, if valid, it submits the form
  // and fetches the user categories with their transactions.
  function submitForm() {
    if (formRef.current.checkValidity()) {
      formRef.current.requestSubmit();
      fetchUserCategoriesWithTheirTransactions()
      return "close-alert";
    } else {
      formRef.current.reportValidity();
    }
  }

  // Function to fetch user categories with their transactions
  // from the 'Categories' table in Supabase
  // It selects the category name, icon, category_id and all transactions
  // associated with each category, including transaction_id, date, 
  // type, title, description, category_id, and amount.
  // It also sets the chart data for the bar chart that shows spending by category.
  async function fetchUserCategoriesWithTheirTransactions() {
    if ( !isLoading ) {
      setIsLoading( true );
      setError(null);
      setData([])
    }

    try {
      const { data, error } = await supabaseClient.from('Categories').select(`
        name,
        icon,
        category_id,
        Transactions (
          transaction_id,
          date,
          type,
          title,
          description,
          category_id,
          amount
        )
      `);

      if ( error ) {
        setError( error )
      } else {
        setData( data )
        setChartData({
          labels: data.map( function( category ) { return category.name } ),
          datasets: [
            {
              label: 'Amount Spent:',
              data: data.map( function( category ) { 
                return category.Transactions.map( function( transaction ) {
                  return transaction.amount
                })
                .reduce( function( accumulator, transactionAmount ) {
                  return accumulator + transactionAmount
                }, 0 )
              })
            }
          ]
        })
      }
    } catch( err ) {
      setError( err )
    } finally {
      setIsLoading( false )
    }
  }

  // Function to delete a category by its ID from the 'Categories' table in Supabase
  // It deletes the category with the specified category_id and alerts the user if successful
  async function deleteCategoryUsingId( category_id ) {
    try {
      const { error } = await supabaseClient.from('Categories').delete()
        .eq('category_id', category_id )

      if ( error ) {
        alert( 'Error deleting category: ', error )
      } else {
        alert('Category successfully deleted')
      }
      
      return 'close-alert'
    } catch( err ) {
      alert( 'Error deleting category: ', err )
    }

  }

  // Function to edit a category
  // It checks the validity of the edit form, if valid, it updates the category
  // with the new name and icon in the 'Categories' table in Supabase
  async function editCategory( category ) {
    if ( editFormRef.current.reportValidity() ) {
      try {
        const { error } = await supabaseClient.from('Categories').
          update({
            name: categoryEditName || category.name,
            icon: ( categoryEditIcon == 'a' ) ? category.icon : categoryEditIcon
          })
          .eq('category_id', category.category_id )

        if ( error ) {
          alert('Error updating category: ', error)
        } else {
          alert('Category updated sucessfully')
        }
      } catch ( err ) {
        alert('Error updating category: ', err )
      }

      return 'close-alert'
    }
  }

  // useEffect to set the chart background color based on the current theme
  useEffect( function() {
    setChartBgColor( function() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--brand-black')
        .trim();
    });
  }, [ theme ])

  // useEffect to fetch user categories with their transactions and set the preferred currency
  // on component mount and when the userSession changes
  useEffect( function() {
    if ( userSession ) {
      fetchUserCategoriesWithTheirTransactions()

      setPreferredCurrency( function(){
        const user_preferred_currency = userSession.user.user_metadata.preferred_currency

        switch( user_preferred_currency ) {
          case 'dollar':
            return Icons[ MONEY_ICONS.DOLLAR ]
          case 'euro':
            return Icons[ MONEY_ICONS.EURO ]
          case 'naira':
            return Icons[ MONEY_ICONS.NAIRA ]
          case 'cedi':
            return Icons[ MONEY_ICONS.CEDI ]
          case 'franc':
            return Icons[ MONEY_ICONS.FRANC ]
          case 'rupee':
            return Icons[ MONEY_ICONS.RUPEE ]
          case 'peso':
            return Icons[ MONEY_ICONS.PESO ]
          case 'pound':
            return Icons[ MONEY_ICONS.POUND ]
          case 'yen':
            return Icons[ MONEY_ICONS.YEN ]
        }
      })
    }
  }, [ userSession ])
 
  return (
    <>
      <Layout>
        {/* Loader */}
        { isLoading && <RouteLoader/>}
        
        {/* Error */}
        { error && <RouteError/>}

        {/* Categories Section */}
        { data.length != 0 && <div className="categories">

          {/* Chart Area */}
          { chartData && <div className="categories--chart-area">
            <Bar
              data={ chartData }
  
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    ticks: {
                      color: chartBgColor,
                      font: {
                        family: 'Nunito, sans-serif',
                        size: 16,
                      },
                    },
                    grid: {
                      display: false, // Turn off X axis grid lines
                    },
                  },
                  y: {
                    display: false
                  },
                },
                plugins: {
                  legend: {
                    display: false, // Hide the legend
                  },

                  title: {
                    display: true,
                    text: 'Your Spending by Category',
                    color: chartBgColor,
                    align: 'start',
                    font: {
                      family: 'Nunito, sans-serif',
                      size: 25,
                      weight: 'bold',
                    },
                    padding: {
                      bottom: 30,
                      top: 20
                    }
                  }
                },
                elements: {
                  bar: {
                    borderRadius: 7,
                    backgroundColor: chartBgColor
                  }
                }
              }}
            />
          </div>}

          {/* Add New Category Alert */}
          <Alert
            trigger={<AddButton />}
            title="Add New Category"
            description="Fill in the details for your new category."
            action={<span>Add category</span>}
            onAction={submitForm}
          >
            <AddCategoryForm ref={formRef} />
          </Alert>
          
          {/* Categories List */}
          { 
            data.map( function( category, index ) {
              // get the icon for the category from react-icons/fa6
              const CategoryIcon = Icons[ category.icon ];

              // get the preferred currency icon from the MONEY_ICONS object
              const PreferredCurrency = preferredCurrency;

              // format the amount to have no decimal places using Intl.NumberFormat API
              const noDecimals = new Intl.NumberFormat('en-NG', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              });


              return <div className="categories--category" key={ index }>
                {/* Category Header with Icon, Name and Settings Button */}
                <div className="categories--category__header">
                  <CategoryIcon className="categories--category__header-icon" />

                  <span className="categories--category__header-title">
                    { category.name }
                  </span>

                  {/* Settings Button */}
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <button className="categories--category__header-settings-btn">
                        <FaGear className="categories--category__header-settings-icon" />
                      </button>
                    </Popover.Trigger>

                    <Popover.Portal>
                      <Popover.Content className="add-dropdown-options" side="bottom" align="end" sideOffset={10}>
                        {/* Edit Category */}
                        <Alert
                          trigger={
                            <div className="option">
                                <FaPencil/> edit category
                            </div>
                          }
                          title="edit category"
                          description="update the details for this category"
                          action={<span>edit category</span>}
                          onAction={ () => editCategory( category ) }
                        >
                          <Form.Root className="add-form" ref={editFormRef}>
                            {/* edit name */}
                            <Form.Field className='add-form__field'>
                              <div className="add-form__label-group">
                                <Form.Label className='add-form__label'>
                                  name:
                                </Form.Label>

                                <Form.Message className='add-form__message' match='valueMissing'>
                                  please enter a name for the category
                                </Form.Message>
                              </div>

                              <Form.Control asChild>
                                <input type="text" required value={ categoryEditName || category.name } 
                                  className='add-form__input' onChange={ (e) => setCategoryEditName( e.target.value ) }/>
                              </Form.Control>
                            </Form.Field>
                            
                            {/* edit icon */}
                            <Form.Field className='add-form__field'>
                              <div className="add-form__label-group">
                                <Form.Label className='add-form__label'>
                                  icon:
                                </Form.Label>

                                { categoryEditIcon == "" && <Form.Message className='add-form__message'>
                                  please choose an icon for the category
                                </Form.Message>}
                              </div>

                              <IconSelect iconArray={ Object.values(CATEGORY_ICONS).map( function( icon ) {
                                  return { icon: icon }
                                }) } 
                                value={ category.icon } setValue={ setCategoryEditIcon } />
                            </Form.Field>
                          </Form.Root>
                        </Alert>
                        
                        {/* Delete Category */}
                        <Alert
                          trigger={
                            <div className="option">
                                <FaTrash/> delete category
                            </div>
                          }
                          title="delete category"
                          description="are you sure you want to delete this category?"
                          action={<span>yes, delete category</span>}
                          onAction={ () => deleteCategoryUsingId( category.category_id ) }
                        ></Alert>
                      </Popover.Content>
                    </Popover.Portal>
                  </Popover.Root>
                </div>

                {/* Category Transactions List */}
                <div className="categories--category__transactions-list">
                  {   
                    category.Transactions.length != 0 && category.Transactions.map( function({ transaction_id, type, title, description, amount, date } ) {
                      // return each transaction using 'Transaction' component
                      return <Transaction
                          id={ transaction_id }
                          key={ transaction_id }
                          type={ type }
                          title={ title }
                          date={ new Date( date ).toLocaleString() }
                          category={ category.name }
                          amount={<>
                                    { type == 'income' ? "" : "-" }
                                    < PreferredCurrency />
                                    { noDecimals.format( amount ) }
                                  </>
                          }
                          description={ description }
                        />})
                  }
                  
                  {/* categoary transaction list if empty message */}
                  {   
                    category.Transactions.length == 0 && <div className="categories--category__no-transactions">
                      you have not added any transactions under this category
                    </div>
                  }
                </div>
              </div> })
          }
        </div>}
      </Layout>
    </>
  );
}
