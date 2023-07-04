import React, { useContext } from 'react'
import { ThemeContext } from '../context/themeContext'
function Posts() {
    const {theme,handleOnClick}=useContext(ThemeContext)
  return (
    <div>
    <h4>My Post with {theme}</h4>
    <button className='btn btn-dark btn-lg' onClick={handleOnClick}>{theme}</button>
    </div>
  )
}

export default Posts
