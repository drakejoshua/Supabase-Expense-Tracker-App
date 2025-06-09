import Layout from './Layout'
import "./Styles/Dashboard.css";
import Header from './components/Header'
import SampleImage from './Assets/Sample.jpg'
import { FaArrowRight, 
       FaChartPie, 
       FaCircleDollarToSlot, 
       FaDollarSign,
       FaLayerGroup, 
       FaUserPlus, 
       FaPlus, 
       FaBowlRice, 
       FaPlugCircleBolt, 
       FaCarSide,
       FaHeartCircleCheck,
       FaCircleArrowUp,
       FaCircleArrowDown,
       FaTableList,
       FaTriangleExclamation,
       FaArrowRotateRight} from 'react-icons/fa6'
import * as Icons from 'react-icons/fa6'
import Transaction from './components/Transaction';
import { Popover } from 'radix-ui';
import AddButton from './components/AddButton';
import AddPopoverOptions from './components/AddPopoverOptions';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './providers/ThemeProvider';
import { Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { AuthContext } from './providers/AuthProvider';
import { supabaseClient } from './providers/supabaseClient';
import { MONEY_ICONS } from './providers/Icons';



export default function Dashboard() {
  // theme state
  const { theme } = useContext(ThemeContext);



  // chart-color state and useEffect - to control the color of the dashboard chart
  // based on theme changes
  const [ chartBgColor, setChartBgColor ] = useState(function() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--brand-black')
      .trim();
  });
  useEffect( function() {
    setChartBgColor( function() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--brand-black')
        .trim();
    });
  }, [ theme ])



  // UI loading states
  const [ isLoading, setIsLoading ] = useState( true );
  const [ error, setError ] = useState( null );
  const [ data, setData ] = useState( null );
  const [ preferredCurrency, setPreferredCurrency ] = useState( Icons[ MONEY_ICONS.DOLLAR ] )



  // sample chart data
  const USER_CATEGORIES_WITH_AMOUNT = [
    { name: 'Food', amountSpent: 1200 },
    { name: 'Transport', amountSpent: 3500 },
    { name: 'Utility', amountSpent: 700 },
    { name: 'Healthcare', amountSpent: 2000 },
  ];


  // fetch the user categories
  async function getUserTransactionsWithCategories() {
    const { data, error } = await supabaseClient
      .from('Transactions')
      .select(`
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
      `)
      .eq('user_id', userSession?.user?.id )
      .order('date', { ascending: false })

    if ( error ) {
      return { success: false, error: error, data: null }
    }

    return { success: true, error: null, data: data }
  }


  // get user's top 4 categories by amount 
  function getTopCategories(data, topN = 4) {
    const categoryTotals = {};

    data.forEach(entry => {
      const name = entry.Categories.name;
      const icon = entry.Categories.icon;
      const amount = entry.amount;

      if (!categoryTotals[name]) {
        categoryTotals[name] = { icon, name, total: 0 };
      }

      categoryTotals[name].total += amount;
    });

    return Object.values(categoryTotals)
      .sort((a, b) => b.total - a.total)
      .slice(0, topN);
  }

  function getTotalIncome( data ) {
    const totalIncome = data.reduce( function( accumulator, transaction ){
      if ( transaction.type == 'income' ) {
        return accumulator + transaction.amount
      } else {
        return accumulator
      }
    }, 0);

    return totalIncome;
  }
  
  function getTotalExpenses( data ) {
    const totalExpenses = data.reduce( function( accumulator, transaction ){
      if ( transaction.type == 'expense' ) {
        return accumulator + transaction.amount
      } else {
        return accumulator
      }
    }, 0);

    return totalExpenses;
  }


  // initialize dashboard data
  async function fetchDashboardData() {
    try {
      const userData = await getUserTransactionsWithCategories();

      // const categoriesData = calculateHighestFourCategories( userCategories )
      
      if ( userData.success ) {
        setData( userData.data )
      } else {
        setError( userData.error )
      }
    } catch ( err ) {
      setError( err )
    } finally {
      setIsLoading( false )
    }

  }



  // route auth state and effect - to control the auth data and state
  // for displaying the right markup - whether landing page or dashboard
  const { userSession } = useContext( AuthContext );
  const [ isUserLoggedIn, setIsUserLoggedIn ] = useState( false );

  useEffect( function() {
    if ( userSession ) {
      fetchDashboardData()
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

      console.log( userSession  )

      setIsUserLoggedIn( true );
    } else {
      setIsUserLoggedIn( false );
    }
  }, [ userSession ])



  // if any logged in user, return the dashboard markup
  if ( isUserLoggedIn ) {
    const PreferredCurrency = preferredCurrency;
    const noDecimals = new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return (
      <Layout>
        { data != null && <div className="dashboard">
          <h3 className='dashboard--greeting'>welcome, { userSession.user.user_metadata.name }</h3>

          <h1 className="dashboard--balance">
            < PreferredCurrency />
            { noDecimals.format( getTotalIncome( data ) - getTotalExpenses( data ) ) }
          </h1>

          <Popover.Root>
              <Popover.Trigger asChild>
                <AddButton/>
              </Popover.Trigger>

              <Popover.Portal>
                  <Popover.Content side='bottom' align='end' sideOffset={10}>
                    <AddPopoverOptions/>
                  </Popover.Content>
              </Popover.Portal>
          </Popover.Root>

          <section className="dashboard--summary">
            <div className="dashboard--summary__income-summary dashboard--general__child--border-hover">
              <div className="dashboard--summary__title">
                total income
              </div>

              <div className="dashboard--summary__value">
                < PreferredCurrency />
                { noDecimals.format( getTotalIncome( data ) ) }
              </div>
            </div>
            
            <div className="dashboard--summary__expense-summary dashboard--general__child--border-hover">
              <div className="dashboard--summary__title">
                total expenses
              </div>

              <div className="dashboard--summary__value">
                < PreferredCurrency />
                { noDecimals.format( getTotalExpenses( data ) ) }
              </div>
            </div>
          </section>

          <section className="dashboard--chart">
            <h2 className="dashboard--chart__heading">
              breakdown
            </h2>

            <div className="dashboard--chart__chart">
              <Bar
                data={{
                  labels: getTopCategories( data )
                    .map( function( category ) { return category.name } ),
                  datasets: [
                    {
                      label: 'Amount Spent:',
                      data: getTopCategories( data ).map( function( category ) { 
                        return category.total
                      })
                    }
                  ]
                }}

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
            </div>
          </section>

          <section className="dashboard--categories-summary">
            { getTopCategories( data ).map( function( category, index ) {
              const Icon = Icons[category.icon]

              return <div className="dashboard--categories-summary__category dashboard--general__child--border-hover"
                key={index}>
                  <Icon className="dashboard--categories-summary__icon"/>

                  <div className="dashboard--categories-summary__category-details">
                    <span className="dashboard--categories-summary__title">
                      { category.name }
                    </span>
                    
                    <span className="dashboard--categories-summary__value">
                      <PreferredCurrency/>
                      { noDecimals.format( category.total ) }
                    </span>
                  </div>
              </div>
            }) }
          </section>

          <section className="dashboard--recent-transactions">
            <h2 className="dashboard--recent-transactions__heading">
              recent transactions
            </h2>

            <div className="dashboard--recent-transactions__list">
              { data.slice( 0, 4 ).map( function( transaction ) {
                return <Transaction 
                    id={ transaction.transaction_id }
                    type={ transaction.type }
                    title={ transaction.title }
                    date={ new Date( transaction.date ).toLocaleString() }
                    category={ transaction.Categories.name }
                    key={transaction.transaction_id}
                    amount={<>
                      { transaction.type == 'income' ? "" : "-" }
                      < PreferredCurrency />
                      { noDecimals.format( transaction.amount ) }
                    </>}
                    description={ transaction.description }
                  />
              })}

              { data.length == 0 && <div className="dashboard--recent-transactions__list--no-transactions">
                you have not added any transactions yet
              </div> }
            </div>
          </section>
        </div>}

        { isLoading && <div className="dashboard-loading">
          <div className="dashboard-loading--spinner"></div>

          loading dashboard...
        </div>}
        
        { error != null && <div className="dashboard-error">
          <div className="dashboard-error--content">
            <div className="dashboard-error--content__message">
              <FaTriangleExclamation className='dashboard-error--content__icon'/>

              <h3 className='dashboard-error--content__text'>
                error loading dashboard
              </h3>
            </div>

            <button className="dashboard-error--content__retry-btn">
              <FaArrowRotateRight className='dashboard-error--content__retry-icon'/>

              retry
            </button>
          </div>
        </div>}
      </Layout>
    )
  }

  // if no logged in user, return the landing page instead
  return (
    <div className='landing-page'>
      <Header/>

      <main className='landing-main'>
        <h1 className='main-heading'>
          a better way to manage <br />your finances
        </h1>

        <p className='main-subtext'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis assumenda 
          voluptatibus corrupti ducimus dicta blanditiis vitae voluptates porro eum ad.
        </p>

        <div className="main-cta-ctn">
          <Link className="main-cta primary" to='signup'>
            <FaUserPlus/> sign up
          </Link>

          <button className="main-cta secondary">
            learn more <FaArrowRight/>
          </button>
        </div>
      </main>

      <section className="features">
        <div className="feature">
          <FaCircleDollarToSlot className='feature-icon'/>

          <h2 className="feature-heading">
            Easily manage expenses
          </h2>

          <p className="feature-text">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque, error.
          </p>
        </div>
        
        <div className="feature">
          <FaLayerGroup className='feature-icon'/>

          <h2 className="feature-heading">
            Add and use categories
          </h2>

          <p className="feature-text">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque, error.
          </p>
        </div>
        
        <div className="feature">
          <FaChartPie className='feature-icon'/>

          <h2 className="feature-heading">
            view insights on your spending
          </h2>

          <p className="feature-text">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque, error.
          </p>
        </div>
      </section>
    </div>
  )
}
