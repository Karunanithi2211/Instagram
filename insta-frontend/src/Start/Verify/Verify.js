import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import {TfiEmail} from 'react-icons/tfi'
import api from '../../api/axiosConfig'
import './Verify.css'
import { useNavigate } from 'react-router-dom'


const Verify = () => {
    const navigate = useNavigate()
    const email = Cookies.get('email');
    const[user,setUser] = useState();
    const [codeError, setCodeError] = useState('');

    const [userCode, setUserCode] = useState({
        code:0
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUserCode({
            ...userCode,
            [name]:value
        })
    }

    const getUser=async ()=>{
        const response = await api.get('/nivak/insta/userbyemail/'+email)
        const user = response.data
        setUser(user)
    }

    const checkVerification = async (e) =>{
        console.log('Checking verification...');
        e.preventDefault();
        const vCode = user?.verificationToken
        const code = userCode['code']
        if(vCode == code){
          try {
            const formData = new FormData();
            formData.append('email', email);
            await api.post('/nivak/insta/verify', formData)
              .then(response => {
                console.log('Success:', response.data);
                Cookies.remove('email',{path:'/'})
                Cookies.set('useremail',email,{expires: 2})
                navigate('/home');
              })
              .catch(error => {
                console.error('Error:', error);
                setCodeError("*Invalid Code");
              });
          } catch (error) {
            console.log(error);
            setCodeError("*Invalid Code");
          }
        }
        else {
          console.log('Codes do not match, navigating to homepage...');
          setCodeError("*Incorrect Code")
        }          
    }

    
    
    useEffect(()=>{
        getUser();
        if (typeof Cookies.get('email') === 'undefined') {
          navigate('/accounts/emailsignup/');
        }
    },[])

  return (
    <div>
        <div className='verify-content-container'>
            <div className='verify-container'>
                <TfiEmail className='lock-icon'/>
                <p className='heading'>Enter Confirmation code</p>
                <p>Enter the confirmation code we sent to {email}. <a>Resend Code</a></p>
                <form onSubmit={checkVerification}>
                    <input type='number' placeholder='Confirmation Code' name='code' onChange={handleInputChange} className='code' required/><br/>
                    {codeError && <div className='code-verify'>{codeError}</div>}
                    <button type='sumbit'>Verify</button>
                </form>
                <br/>
                <br/>
            </div>
            <div className='verify-backlogin-container'>
                <a href='/'><button>Back to Login</button></a>
            </div>
        </div>
    </div>
  )
}

export default Verify