import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {FaFacebookSquare} from 'react-icons/fa'
import { RxCrossCircled, RxCheckCircled } from "react-icons/rx";
import api from '../../api/axiosConfig'
import './Register.css'
import Cookies from 'js-cookie'

const Register = () => {
    const navigate = useNavigate();
    const [user,setUser] = useState();
    const [numbertick,setNumberTick] = useState(false)
    const [numberwrong,setNumberWrong] = useState(false)

    const [emailtick,setEmailTick] = useState(false)
    const [emailwrong,setEmailWrong] = useState(false)

    const [usernametick,setUsernameTick] = useState(false)
    const [usernamewrong,setUsernameWrong] = useState(false)

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const [userData, setUserData] = useState({
        number: 0,
        email:'',
        fullname:'',
        username:'',
        password: '',
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUserData({
            ...userData,
            [name]:value
        })
    }

    const registerCheck = () =>{

        const numberToCheck = userData['number']
        const emailToCheck = userData['email'];
        const usernameToCheck = userData['username']

        const numberExists = user?.some((item) => item.mobilenumber == numberToCheck);
        const emailExists = user?.some((item) => item.email === emailToCheck);
        const usernameExists = user?.some((item) => item.username === usernameToCheck);

        if (numberToCheck) {
            if (!numberExists) {
                setNumberTick(true);
                setNumberWrong(false);
            } else {
                setNumberTick(false);
                setNumberWrong(true);
            }
        }

        if (emailToCheck) {
            if (!emailExists) {
                setEmailTick(true);
                setEmailWrong(false);
            } else {
                setEmailTick(false);
                setEmailWrong(true);
            }
        }

        if (usernameToCheck) {
            if (!usernameExists) {
                setUsernameTick(true);
                setUsernameWrong(false);
            } else {
                setUsernameTick(false);
                setUsernameWrong(true);
            }
        }

        if (!emailExists && !numberExists && !usernameExists) {
            setIsButtonDisabled(false)
        } else {
            setIsButtonDisabled(true)
        }

        
    }

    const getUser=async ()=>{
        const response = await api.get('/nivak/insta/users')
        const user = response.data
        setUser(user)
    }



    const handleSumbit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('number',userData.number)
        formData.append('email',userData.email)
        formData.append('fullname',userData.fullname)
        formData.append('username',userData.username)
        formData.append('password',userData.password)

        try {
            await api.post('/nivak/insta/register',formData)
            .then(response => {
                console.log('Success:', response.data);
                
              })
              .catch(error => {
                console.error('Error:', error);
              });
            Cookies.set("email",userData.email,{expires:1})
            navigate('/accounts/emailsignup/verify/')
            
        } catch (error) {
            console.log(error)
            navigate('/accounts/emailsignup/')
        }
    }
    useEffect(()=>{
        getUser();
    },[])
    useEffect(()=>{
        registerCheck();
    })

  return (
    <div>
        <div className='register-content-container'>
            <div className='register-container'>
                <h1 className='title'>Instagram</h1>
                <p className='fbsign'>Sign up to see photos and videos from your friends.</p>
                <button type='sumbit'><FaFacebookSquare className='icon'/><span className='icon-name'>Log in with Facebook</span></button>
                <div className='horizontal-line'></div>
                <p className='or'>OR</p>
                <form onSubmit={handleSumbit}>
                    <input type='number' name='number' id='number' placeholder='Mobile Number' onChange={handleInputChange} className='number' required/><span className='tick-wrong'>{numbertick && <RxCheckCircled style={{color:'green'}}/>}{numberwrong && <RxCrossCircled style={{color:'red'}}/>}</span><br/>
                    <input type='email' name='email' placeholder='Email' onChange={handleInputChange} required/><span className='tick-wrong'>{emailtick && <RxCheckCircled style={{color:'green'}}/>}{emailwrong && <RxCrossCircled style={{color:'red'}}/>}</span><br/>
                    <input type='text' name='username' placeholder='Username' onChange={handleInputChange} required/><span className='tick-wrong'>{usernametick && <RxCheckCircled style={{color:'green'}}/>}{usernamewrong && <RxCrossCircled style={{color:'red'}}/>}</span><br/>
                    <input type='text' name='fullname' placeholder='Full Name' onChange={handleInputChange} required/><br/>
                    <input type='password' name='password' placeholder='Password' onChange={handleInputChange} required/><br/>
                    <p className='form-para'>People who use our service may have uploaded your contact information to Instagram. <span>Learn More</span></p><br/>
                    <p className='form-para'>By signing up, you agree to our <span>Terms, Privacy Policy </span> and <span> Cookies Ploicy.</span></p>
                    <button type='sumbit' disabled={isButtonDisabled}>Sign up</button>
                </form>
            </div>
            <br/>
            <div className='loginback-container'>
                <p className='loginback'>Have an account? <a href='/'>Log in</a></p>
            </div>
        </div>
    </div>
  )
}

export default Register