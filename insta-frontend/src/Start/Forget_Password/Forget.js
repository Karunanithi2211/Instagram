import React from 'react'
import './Forget.css'
import {GoLock} from 'react-icons/go'

const Forget = () => {
  return (
    <div>
        <div className='forget-content-container'>
            <div className='forget-container'>
                <GoLock className='lock-icon'/>
                <p className='heading'>Trouble logging in?</p>
                <p>Enter your email,phone,or username and we'll send you a link to get back into your account.</p>
                <form>
                    <input type='text' placeholder='Email, Phone or Username' required/><br/>
                    <button type='sumbit'>Send login link</button>
                </form>
                <div className='horizontal-line'></div>
                <p className='or'>OR</p>
                <a href='/accounts/emailsignup/' className='create-account'><button>Create new account</button></a>
            </div>
            <div className='backlogin-container'>
                <a href='/'><button>Back to Login</button></a>
            </div>
        </div>
    </div>
  )
}

export default Forget