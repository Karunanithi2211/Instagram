import React, { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import './Login.css'
import iphoneimg from './iphone.png'
import img1 from './img1.png'
import img2 from './img2.png'
import Carousel from 'react-material-ui-carousel'
import {FaFacebookSquare} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'


const Login = () => {
    const navigate = useNavigate()
    const [user,setUser] = useState();
    const [loginError,setLoginError] = useState('')
    const [isVerified,SetIsVerified] = useState(false)

    const [userData, setUserData] = useState({
        login:'',
        password:''
    })

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setUserData({
            ...userData,
            [name]:value
        })
    }

    const getUser=async ()=>{
        const response = await api.get('/nivak/insta/users')
        const user = response.data
        setUser(user)
    }

    const handleLogin = async (event) =>{
        event.preventDefault()
        try {
            const loginToCheck = userData['login']
            const passwordToCheck = userData['password']
            
            const numberExists = user?.some((item) => item.mobilenumber == parseFloat(loginToCheck));
            const emailExists = user?.some((item) => item.email === loginToCheck);
            const usernameExists = user?.some((item) => item.username === loginToCheck);
            
            if (emailExists || numberExists || usernameExists) {
                const response = await api.get('/nivak/insta/login/'+loginToCheck)
                const data = response.data
                if (data?.password === passwordToCheck) {
                    if (data?.verified) {
                        Cookies.set('useremail',data?.email,{expires: 2})
                        navigate('/home')
                    }
                    else{
                        setLoginError("*Email not verified")
                        Cookies.set('useremail',data?.email,{expires: 2})
                        SetIsVerified(!isVerified)
                    }
                    
                } else {
                    setLoginError("*Incorrect password")
                }
            } else {
                setLoginError("*User not found")
            }

        } catch (error) {
            console.log(error)
            navigate('/')
        }
    }



    useEffect(()=>{
        getUser()
        document.body.style.overflow='hidden'
        return () => {
            document.body.style.overflow = 'initial';
        };
    },[])
  return (
    <div>
        <div className='image-container'>
            <img src={iphoneimg} alt='instagram' className='iphone'/>
            <div className='inside-images'>
                <Carousel animation='slide' indicators={false}>
                    <img src={img1} alt='img'/>
                    <img src={img2} alt='img'/>
                </Carousel>
            </div>
        </div>
        <div className='content-container'>
            <div className='login-container'>
                <h1 className='title'>Instagram</h1>
                <br/>
                <form onSubmit={handleLogin}>
                    <input type='text' placeholder='Phone number,username or email address' name='login' onChange={handleInputChange} required/><br/>
                    <input type='password' placeholder='Password' name='password' onChange={handleInputChange} required/><br/>
                    {loginError && <div className='login-verify'>{loginError}{isVerified && <a href='/accounts/emailsignup/verify/' style={{textDecoration: 'none'}}>Verify</a>}</div>}
                    <button type='sumbit'>Log in</button>

                    <div className='horizontal-line'>
                    
                    </div>
                </form>
                <p className='or'>OR</p>
                <p className='fblogin'><span className='icon'><FaFacebookSquare/></span> Log in with Facebook</p>
                <p className='forget-password'><a href='/accounts/password/reset/'>Forget password?</a></p>
            </div>
            <br/>
            <div className='signup-container'>
                <p className='signup'>Don't have an account? <a href='/accounts/emailsignup/'>Sign up</a></p>
            </div>
        </div>
    </div>
  )
}

export default Login