import './AddFriends.css'
import React, { useEffect, useState } from 'react'
import api from '../../api/axiosConfig'
import Cookies from 'js-cookie'
import customprofile from "./profile.png";
import { Avatar } from '@mui/material'
import { useNavigate } from 'react-router-dom';

const AddFriends = () => {
  const [user,setUser] = useState()
  const [alluser,setAllUser] = useState()
  const userId = Cookies.get('useremail')

  const getUser= async ()=>{
    const response = await api.get('/nivak/insta/userbyemail/'+userId)
    const singledata = response.data
    setUser(singledata)
    const alluser = await api.get('/nivak/insta/users')
    const allusers = alluser.data
    setAllUser(allusers)
    Cookies.remove('username')
  }

  const follow=async(data) =>{
    const formData = new FormData()
    formData.append('email',user?.email)
    formData.append('follow',data)
    try {
      await api.post('/nivak/insta/followstatus',formData)
      .then(response => {
          console.log('Success:', response.data);
          
        })
        .catch(error => {
          console.error('Error:', error);
        });
        window.location.reload()
      
    } catch (error) {
        console.log(error)
    }
  }

  var count = 0

  useEffect(()=>{
    getUser();
  },[])


  return (
    <div>
        <div className='user-name'>
            <div className='user-name-profile'>
              <a href={`/profile/${user?.username}/`} className='link-to-profile'>
                <Avatar className='add-friends-profile'>
                {
                    user?.profilepic ? (
                        <img src={api.defaults.baseURL + user?.profilepic} alt='profile'/>
                    ) : (
                        <img src={customprofile} className='profileimage' alt="Profile Picture" id='profileimage'/>
                )}
                </Avatar>
              </a>
            </div>
            <div className='user-name-content'>
              <table>
                <tr>
                  <td>
                    <a href={`/profile/${user?.username}/`} className='link-to-profile'>
                      <div className='content-name'>
                        <p className='username'>{user?.username}</p>
                        <p className='fullname'>{user?.fullname}</p>
                      </div>
                    </a>
                  </td>
                  <td><a href='/' className='account-switch'>Switch</a></td>
                </tr>
              </table>
            </div>
          
        </div>

        <br/>
        <br/>

        <div className='suggestion'>
          <table>
              <tr>
                <td><p className='title'>Suggested for you</p></td>
                <td><a href='/#' className='see-all'>See All</a></td>
              </tr>
          </table>
        </div>

        <br/>

        <div className='other-user'>
          { 
            alluser?.map((data)=>{
              count++
              if ((count<=5)&&(user?.username !== data?.username)) {
                return(
                  <>
                    {
                    !user?.following?.includes(data?.email)?
                    <div className='user-all'>
                      <div className='user-name-profile'>
                        <a href={`/profile/${data?.username}/`} className='link-to-profile'>
                          <Avatar className='add-friends-profile'>
                          {
                              data?.profilepic ? (
                                  <img src={api.defaults.baseURL + data?.profilepic} alt='profile'/>
                              ) : (
                                  <img src={customprofile} className='profileimage' alt="Profile Picture" id='profileimage'/>
                          )}
                          </Avatar>
                        </a>
                      </div>
                      <div className='all-user-name-content'>
                          <table>
                              <tr>
                                <td>
                                  <a href={`/profile/${data?.username}/`}  className='link-to-profile'>
                                    <div className='content-name'>
                                      <p className='username'>{data?.username}</p>
                                      <p className='fullname'>{data?.fullname}</p>
                                    </div>
                                  </a>  
                                </td>
                                <td>{!user?.following?.includes(data?.email)?<button className='follow-unfollow' onClick={()=>follow(data?.email)}>Follow</button>:''}</td>
                              </tr>
                          </table>
                      </div>
                    </div>
                    :
                    <div>

                    </div>
                    }
                  </>
                )
              }
            })
          }
        </div>
    </div>
  )
}

export default AddFriends