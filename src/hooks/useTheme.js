/**
 * Custom hook to manage theme state.
 *
 * This hook provides a way to manage and toggle between light and dark themes.
 * It uses the browser's media query API to detect the user's preferred color scheme
 * and saves the theme preference in local storage.
 *
 * @param {string} localStorageThemeKey - The key used to store the theme in local storage.
 * @returns {[string, function]} - Returns the current theme and a function to toggle the theme.
 *
 * @example
 * import useTheme from './useTheme';
 *
 * function App() {
 *   const [theme, toggleTheme] = useTheme('app-theme');
 *
 *   return (
 *     <div className={`app ${theme}`}>
 *       <button onClick={toggleTheme}>
 *         Toggle Theme
 *       </button>
 *     </div>
 *   );
 * }
 */



import { useState } from 'react'; 

// custom hook to manage theme state
export default function useTheme( localStorageThemeKey ) {
    // theme - theme state
    // get theme using media query api and saved theme from local storage
    const [ theme, setTheme ] = useState( function() {
        // get theme using media query api
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // get saved theme from local storage
        const savedTheme = localStorage.getItem( localStorageThemeKey );

        // return saved theme or set theme based on prefersDarkMode
        if ( savedTheme ) {
            return savedTheme;
        } else {
            localStorage.setItem('stopwatch-theme', prefersDarkMode ? 'dark' : 'light');
            return prefersDarkMode ? 'dark' : 'light';
        }
    });

    // toggleTheme - function to toggle theme between light and dark
    function toggleTheme() {
        setTheme( function( prevTheme ) {
            const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem( localStorageThemeKey, newTheme );
            return newTheme;
        } );
    }

    // return theme and toggleTheme function for use in components
    return [ theme, toggleTheme ];
}
