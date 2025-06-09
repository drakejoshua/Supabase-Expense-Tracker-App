// import dependencies
import "../Styles/Transactions.css";
import Layout from "../Layout";
import { useState, useRef, useEffect, useContext } from "react";
import { Popover, Toggle } from "radix-ui";
import Alert from "../components/Alert";
import * as Icons from 'react-icons/fa6'
import {
  FaA,
  FaArrowDownShortWide,
  FaArrowDownWideShort,
  FaArrowLeft,
  FaArrowRight,
  FaCircleDollarToSlot,
  FaFilter,
  FaMagnifyingGlass,
  FaRegCalendarCheck,
  FaTableList,
  FaClipboardList,
  FaFileCircleXmark,
} from "react-icons/fa6";
import Transaction from "../components/Transaction";
import AddTransactionForm from "../components/AddTransactionForm";
import AddButton from "../components/AddButton";
import RouteHeading from "../components/RouteHeading";
import { AuthContext } from "../providers/AuthProvider";
import { supabaseClient } from "../providers/supabaseClient";
import { MONEY_ICONS } from "../providers/Icons";
import useDebounce from "../hooks/useDebounce";
import RouteError from "../components/RouteError";
import RouteLoader from "../components/RouteLoader";



export default function Transactions() {
  // search form UI states
  const [toggleState, setToggleState] = useState(false);
  const formRef = useRef();
  const [ orderBy, setOrderBy ] = useState('title')
  const [ searchTerm, setSearchTerm ] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // UI loading states
  const [ isLoadingTransactions, setIsLoadingTransactions ] = useState( true );
  const [ error, setError ] = useState( null )
  const [ data, setData ] = useState( [] )

  // pagination data and state
  const rangeLength = 10
  const [ resultsToDisplay, setResultsToDisplay ] = useState(10)
  const [ totalResults, setTotalResults ] = useState(0);

  // auth state
  const { userSession } = useContext( AuthContext )
  const [ preferredCurrency, setPreferredCurrency ] = useState( Icons[ MONEY_ICONS.DOLLAR ] )


  // Function to submit the add new transaction form
  // It checks the validity of the form, if valid, it submits the form
  // and fetches the user transactions using search term
  function submitForm() {
    if (formRef.current.checkValidity()) {
      formRef.current.requestSubmit();
      fetchUserTransactionsUsingSearchTerm();
      return "close-alert";
    } else {
      formRef.current.reportValidity();
    }
  }


  // Function to fetch user transactions using search term
  // from the 'Transactions' table in Supabase
  // It selects the transaction type, title, description, category_id, amount, transaction_id, date,
  // associated with their category, including name, icon
  async function fetchUserTransactionsUsingSearchTerm() {
    const orderByColumn = ( orderBy != 'category' ) ? orderBy : 'name'
    const orderOptions = ( orderBy != 'category' ) ? { ascending: toggleState } : 
        { ascending: toggleState, referencedTable: 'Categories' }
    const selectQuery = `
              transaction_id,
              type,
              title,
              description,
              amount,
              date,
              Categories (
                name,
                icon
              )
            `

    if ( !isLoadingTransactions ) {
      setIsLoadingTransactions(true)
      setError(null)
      setData([])
    }

    try {
      if ( searchTerm == "" ) {
        const { data, error, count } = await supabaseClient
          .from('Transactions')
          .select( selectQuery, { count: 'exact' } )
          .order( orderByColumn, orderOptions )
          .range( resultsToDisplay - rangeLength, resultsToDisplay )

          if ( error ) {
            setError( error )
          } else {
            setData( data )
            setTotalResults( count )
          }
      } else {
        const { data, error, count } = await supabaseClient
          .from('Transactions')
          .select( selectQuery, { count: 'exact' } )
          .ilike('title', `%${ searchTerm }%`)
          .order( orderByColumn, orderOptions )
          .range( resultsToDisplay - rangeLength, resultsToDisplay )

          if ( error ) {
            setError( error )
          } else {
            setData( data )
            setTotalResults( count )
          }
      }
    } catch ( err ) {
      setError( err )
    } finally {
      setIsLoadingTransactions( false )
    }
  }

  // pagination function to display previous set of results based on rangeLength
  // and user-transactions
  function paginateNext() {
    // do bounds-checking to prevent improper pagination state
    if ( resultsToDisplay + rangeLength > totalResults ) {
      setResultsToDisplay( resultsToDisplay + rangeLength )
    } else {
      setResultsToDisplay( resultsToDisplay + ( ( resultsToDisplay + rangeLength ) - totalResults ) )
    }
  }

  // pagination function to display next set of results based on rangeLength
  // and user-transactions
  function paginatePrevious() {
    // do bounds-checking to prevent improper pagination state
    if ( resultsToDisplay - rangeLength > rangeLength ) {
      setResultsToDisplay( resultsToDisplay - rangeLength )
    } else {
      setResultsToDisplay( rangeLength )
    }
  }


  // useEffect to fetch route data on mount and set user preferred currency state
  useEffect( function() {
    if ( userSession ) {
      fetchUserTransactionsUsingSearchTerm()

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
  }, [ userSession, resultsToDisplay, debouncedSearchTerm, orderBy, toggleState ])

  
  return (
    <>
      <Layout>
        <div className="transactions">

          <RouteHeading>
            transactions
          </RouteHeading>

          {/* add new alert */}
          <Alert
            trigger={<AddButton />}
            title="Add New Transaction"
            description="Fill in the details for your new transaction."
            action={<span>Add Transaction</span>}
            onAction={submitForm}
          >
            <AddTransactionForm ref={formRef} />
          </Alert>

          {/* searchbar */}
          <div className="transactions--searchbar">
            {/* searchbar input */}
            <div className="transactions--searchbar__search">
              <FaMagnifyingGlass className="transactions--searchbar__search-icon" />
              <input
                type="text"
                className="transactions--searchbar__search-input"
                placeholder="Search Any Transaction"
                value={ searchTerm }
                onChange={ (e) => setSearchTerm( e.target.value )}
              />
            </div>

            {/* searchbar filters */}
            <Popover.Root>
              <Popover.Trigger asChild>
                <button className="transactions--searchbar__filter-btn">
                  <FaFilter className="transactions--searchbar__filter-btn-icon" />
                </button>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content align="end" side="bottom" sideOffset={8}>
                  <div className="transactions--searchbar__filter-options">
                    {/* title */}
                    <div className={`transactions--searchbar__filter-option ` +
                        `${ ( orderBy == 'title') ? 'transactions--searchbar__filter-option--selected' : ' '}`}
                        onClick={ () => setOrderBy("title")}
                      >
                      <FaA className="transactions--searchbar__filter-icon" />

                      <span className="transactions--searchbar__filter-text">
                        Title
                      </span>
                    </div>

                    {/* date */}
                    <div className={`transactions--searchbar__filter-option ` +
                        `${ ( orderBy == 'date') ? 'transactions--searchbar__filter-option--selected' : ' '}`}
                        onClick={ () => setOrderBy("date")}
                      >
                      <FaRegCalendarCheck className="transactions--searchbar__filter-icon" />

                      <span className="transactions--searchbar__filter-text">
                        Date
                      </span>
                    </div>

                    {/* amount */}
                    <div className={`transactions--searchbar__filter-option ` +
                        `${ ( orderBy == 'amount') ? 'transactions--searchbar__filter-option--selected' : ' '}`}
                        onClick={ () => setOrderBy("amount")}
                      >
                      <FaCircleDollarToSlot className="transactions--searchbar__filter-icon" />

                      <span className="transactions--searchbar__filter-text">
                        amount
                      </span>
                    </div>

                    {/* category */}
                    <div className={`transactions--searchbar__filter-option ` +
                        `${ ( orderBy == 'category') ? 'transactions--searchbar__filter-option--selected' : ' '}`}
                        onClick={ () => setOrderBy("category")}
                      >
                      <FaTableList className="transactions--searchbar__filter-icon" />

                      <span className="transactions--searchbar__filter-text">
                        category
                      </span>
                    </div>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            {/* searchbar order toggle */}
            <Toggle.Root
              className="transactions--searchbar__order-btn"
              pressed={toggleState}
              onPressedChange={setToggleState}
            >
              {/* descending order */}
              {toggleState && (
                <FaArrowDownShortWide className="transactions--searchbar__order-btn-icon" />
              )}

              {/* ascending order */}
              {!toggleState && (
                <FaArrowDownWideShort className="transactions--searchbar__order-btn-icon" />
              )}
            </Toggle.Root>
          </div>

          {/* transaction list */}
          { data.length != 0 && <>
            <div className="transactions--list">
              {
                data.map( function( transaction ) {
                  // get preferred currency icon component from react-icons/fa6 library
                  const PreferredCurrency = preferredCurrency;

                  // numeric formatter for transaction amounts using the Intl API
                  const noDecimals = new Intl.NumberFormat('en-NG', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  });

                  return <Transaction
                    id={ transaction.transaction_id }
                    type={ transaction.type }
                    title={ transaction.title }
                    date={ new Date( transaction.date ).toLocaleString() }
                    category={ transaction.Categories.name }
                    key={ transaction.transaction_id }
                    amount={<>
                      { transaction.type == 'income' ? "" : "-" }
                      < PreferredCurrency />
                      { noDecimals.format( transaction.amount ) }
                    </>}
                    description={ transaction.description }
                  />
                })
              }
            </div>

            {/* transaction list pagination */}
            <div className="transcations--list-pagination">
              {/* pagination count */}
              <span className="transcations--list-pagination__status">
                showing { ( totalResults > resultsToDisplay ) ? resultsToDisplay : totalResults } of { totalResults } entries
              </span>

              <div className="transcations--list-pagination__buttons">
                {/* previous button */}
                { ( resultsToDisplay > rangeLength ) && <button className="transcations--list-pagination__button" onClick={ paginatePrevious }>
                    <FaArrowLeft className="transcations--list-pagination__button-icon" />
                    previous
                </button>}

                {/* next button */}
                { ( resultsToDisplay < totalResults ) && <button className="transcations--list-pagination__button" onClick={ paginateNext }>
                    next
                    <FaArrowRight className="transcations--list-pagination__button-icon" />
                </button>}
              </div>
            </div>
          </> }
          
          {/* transaction list alt messages */}
          { ( data.length == 0 && !isLoadingTransactions && error == null ) && <>
            
            {/* no transactions created message */}
            { searchTerm == "" && <div className="transactions--not-found">
              <FaClipboardList className="transactions--not-found__icon"/>

              <h3 className="transactions--not-found__header">
                you don't have any transactions
              </h3>

              <p className="transactions--not-found__text">
                click the button at the bottom of the screen to add a new transaction
              </p>
            </div> }
            
            {/* no found transactions after searching with search term message */}
            { debouncedSearchTerm != "" && <div className="transactions--not-found">
              <FaFileCircleXmark className="transactions--not-found__icon"/>

              <h3 className="transactions--not-found__header">
                search term not found
              </h3>

              <p className="transactions--not-found__text">
                No transactions matching the search term "{ searchTerm }".
                Try a different keyword.
              </p>
            </div>}
          </> }

          {/* loader */}
          { isLoadingTransactions && <RouteLoader/> }
          
          {/* error */}
          { error && <RouteError handleRetry={ fetchUserTransactionsUsingSearchTerm }/> }
        </div>
      </Layout>
    </>
  );
}
