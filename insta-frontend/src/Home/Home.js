import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import { useNavigate } from 'react-router-dom'
import SideBar from './SideBar/SideBar'
import './Home.css'
import Content from './Content/Content'

const Home = () => {
  const [user,setUser] = useState()
  const navigate = useNavigate()
  Cookies.remove('username')

  const getUserData = async () =>{
    const email = Cookies.get('useremail')
    const response = await api.get('/nivak/insta/userbyemail/'+email)
    const data= response.data
    setUser(data)
  }

  useEffect(()=>{
    getUserData();
    if (typeof Cookies.get('useremail') === 'undefined') {
      navigate('/');
    }
  },[])
  return (
    <>
      <div className='homepage'>
        <div className='home-sidebar'>
          <SideBar/>
        </div>

        <div className='home-content'>
          <Content/>
        </div>
      </div>
    </>
  )
}

export default Home