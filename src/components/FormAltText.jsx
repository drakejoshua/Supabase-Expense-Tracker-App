/**
 * Renders a text with an inline navigation link, typically used for sign up or login prompts.
 *
 * @component
 * @param {Object} props
 * @param {string} props.linkText - The text to display for the navigation link.
 * @param {string} props.text - The main text to display before the link.
 * @param {string} props.link - The path to navigate to when the link is clicked.
 */


import { Link } from 'react-router-dom'

export default function FormAltText({ linkText, text, link }) {
  return (
    <div className="signup--login-text">
        { text } &nbsp;
        <Link className='signup--login-text__link' to={'/' + link}>
            { linkText }
        </Link>
    </div>
  )
}
