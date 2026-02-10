import React from 'react'
import { Link } from 'react-router-dom'
function Button({ link, text }) {
    return (
        <Link to={link} className='inline-block mt-4 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors cursor-pointer'>{text}</Link>
    )
}

export default Button
