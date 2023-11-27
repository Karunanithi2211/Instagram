import React, { useEffect, useState } from 'react'
import api from '../api/axiosConfig'
import './Explore.css'
import SideBar from '../Home/SideBar/SideBar'
import Cookies from 'js-cookie'

import customprofile from './profile.png'
import { Avatar } from '@mui/material'
import { FaComment, FaHeart, FaRegHeart } from 'react-icons/fa'
import { VscSend } from 'react-icons/vsc'
import { RiCloseFill } from 'react-icons/ri'


const UserDetails = ({ email }) => {
    const [userDetails, setUserDetails] = useState(null);
  
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const response = await api.get(`/nivak/insta/userbyemail/${email}`);
          const userData = response.data
          setUserDetails(userData);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };
      fetchUserDetails();
    }, [email]);
  
    return (
      <div>
        {userDetails && (
          <>
            <div className='commentsection'>
            <a href={`/profile/${userDetails?.username}/`}>
              <Avatar style={{ maxWidth: '30px', maxHeight: '30px' }}>
                {
                    userDetails.profilepic ? (
                        <img src={api.defaults.baseURL + userDetails?.profilepic} alt='profile' style={{ maxWidth: '30px', maxHeight: '30px' }}/>
                    ) : (
                        <img src={customprofile} className='profileimage' alt="Profile Picture" id='profileimage' style={{width: '30px',height:'30px'}}/>
                )}
              </Avatar>
            </a>
              <p style={{marginLeft:'10px'}}>{userDetails.username}</p>
            </div>
          </>
        )}
      </div>
    );
  };
  

const Explore = () => {
    const [user,setUser] = useState()
    const [alluser,setAllUser] = useState()

    const userId = Cookies.get('useremail')
    const [postComment, setPostComment] = useState('');

    const handlePostCommentChange = (event) => {
        setPostComment(event.target.value);
    };

    const getUser= async ()=>{
        const response = await api.get('/nivak/insta/userbyemail/'+userId)
        const singledata = response.data
        setUser(singledata)
        const alluser = await api.get('/nivak/insta/users')
        setAllUser(alluser.data)
    }

    const randomOrder = () => {
        var min = 10000
        var max = 99999
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const windowOverlayOpen = (path) => {
        document.getElementById(`window-overlay-${path}`).style.display = 'flex';
        const isVideo = path && (path.includes('.mp4') || path.includes('.mov') || path.includes('.avi'));
        if (isVideo) {
          const winVideo = document.getElementById(`window-video-${path}`)
          if (winVideo) {
            winVideo.play()
            winVideo.muted =false 
          } 
        }
      };
      
    
      const windowOverlayClose = (path) => {
        document.getElementById(`window-overlay-${path}`).style.display = 'none';
        setPostComment('')
        const isVideo = path && (path.includes('.mp4') || path.includes('.mov') || path.includes('.avi'));
        if (isVideo) {
          const winVideo = document.getElementById(`window-video-${path}`)
          if (winVideo) {
            winVideo.muted =true 
          }
        }
      };

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
            getUser()
          
        } catch (error) {
            console.log(error)
        }
    }
    const unfollow=async(data) =>{
        const formData = new FormData()
        formData.append('email',user?.email)
        formData.append('unfollow',data)
        try {
          await api.post('/nivak/insta/followstatus',formData)
          .then(response => {
              console.log('Success:', response.data);
              
            })
            .catch(error => {
              console.error('Error:', error);
            });
          getUser()
          
        } catch (error) {
            console.log(error)
        }
    }

      const likePost = async (postemail,postid) => {
        const formData = new FormData();
        formData.append('email',user?.email)
        formData.append('postemail', postemail);
        formData.append('postid', postid);
    
        try {
          const response = await api.post('/nivak/insta/likepost', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          console.log('LikePost:', response.data);
          getUser()
        } catch (error) {
          console.error('Error Like post:', error);
        }
      }
    
      const unlikePost = async (postemail,postid) => {
        const formData = new FormData();
        formData.append('email',user?.email)
        formData.append('postemail', postemail);
        formData.append('postid', postid);
    
        try {
          const response = await api.post('/nivak/insta/unlikepost', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          console.log('UnlikePost:', response.data);
          getUser()
        } catch (error) {
          console.error('Error unlike post:', error);
        }
      }
    
      const comment = async (postemail,postid,postcomment) => {
        const formData = new FormData();
        formData.append('email',user?.email)
        formData.append('comment',postcomment)
        formData.append('postemail', postemail);
        formData.append('postid', postid);
    
        try {
          const response = await api.post('/nivak/insta/commentpost', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          console.log('UnlikePost:', response.data);
          setPostComment('')
          getUser()
        } catch (error) {
          console.error('Error unlike post:', error);
        }
      }
    

    useEffect(()=>{
        getUser();
      },[])
  return (
    <div className='explore'>
        <div className='explore-sidebar'><SideBar/></div>
        <div className='explore-content'>
        <div className='grid-container'>
            {alluser?.map((data) => {
                if(user?.email !== data?.email && !user?.following?.includes(data?.email)){

                    if (data?.posts && data?.posts.length > 0) {
                        return data?.posts.map((post, index) => {
                            const isLiked = post?.like?.includes(user?.email)
                            const isImage = post?.path && (post?.path.includes('.jpg') || post?.path.includes('.png') || post?.path.includes('.jpeg'));
                            const isVideo = post?.path && (post?.path.includes('.mp4') || post?.path.includes('.mov') || post?.path.includes('.avi'));

                            return (
                                <div className='grid-item' key={index} style={{order: randomOrder()}}>
                                    <div className='explore-card'>
                                        {isImage && <img src={api.defaults.baseURL + post?.path} alt="Image" onClick={()=>windowOverlayOpen(post?.path)}/>}
                                        {isVideo && (
                                            <video loop autoPlay muted  onClick={()=>windowOverlayOpen(post?.path)}>
                                                <source src={api.defaults.baseURL + post?.path} type="video/mp4"/>
                                            </video>
                                        )}
                                    </div>
                                    <div id={`window-overlay-${post?.path}`} className='window-overlay'>
                                        <div className='window-container'>
                                            <div className='left-window-container'>
                                            {isImage && <img src={api.defaults.baseURL + post?.path} alt="Image"/>}
                                            {isVideo && <video id={`window-video-${post?.path}`} loop autoPlay muted>
                                                            <source src={api.defaults.baseURL + post?.path} type="video/mp4" />
                                                        </video>}
                                            </div>
                                            <div className='right-window-container'>
                                            <div className='window-right-top'>
                                                <a href={`/profile/${data?.username}/`}>
                                                <Avatar>
                                                    {
                                                        data.profilepic ? (
                                                            <img src={api.defaults.baseURL + data?.profilepic} alt='profile' style={{ maxWidth: '40px', maxHeight: '40px' }}/>
                                                        ) : (
                                                            <img src={customprofile} className='profileimage' alt="Profile Picture" id='profileimage' style={{width: '40px',height:'40px'}}/>
                                                    )}
                                                </Avatar>
                                                </a>
                                                <p>{data?.username}</p>
                                                {!user?.following?.includes(data?.email)?<button className='explore-follow-unfollow' onClick={()=>follow(data?.email)}>Follow</button>:<button className='explore-follow-unfollow' onClick={()=>unfollow(data?.email)}>Unfollow</button>}
                                            </div>
                                            <hr/>
                                            <div className='window-right-center'>
                                                {post?.comments.length != 0?
                                                post?.comments?.map((com, index) => (
                                                <div key={index}>
                                                    <UserDetails email={com?.commentemail} />
                                                    <p style={{marginLeft:"40px",marginBottom:'20px'}}>{com?.comment}</p>
                                                </div>
                                                )):<p>No Comments</p>}
                                            </div>
                                            <hr/>
                                            <div className='window-right-bottom'>
                                                <table>
                                                <tr>
                                                    <td>
                                                    <div className='intractive-time'>
                                                        <p>{isLiked?<FaHeart style={{color:'red'}} onClick={() => unlikePost(data?.email,post?.id)}/>:<FaRegHeart onClick={() => likePost(data?.email,post?.id)}/>}</p>
                                                        <p><FaComment/></p>
                                                    </div>
                                                    </td>
                                                </tr>
                                                </table>
                                            </div>
                                            <p>{post?.like ? post?.like.length:0} Likes</p>
                                            <p>{post?.description}</p>
                                            <div>
                                                <textarea type='text' placeholder='Add a comment...' value={postComment} onChange={handlePostCommentChange}/><VscSend style={{fontSize:'22px'}} onClick={()=> comment(data?.email,post?.id,postComment)}/>
                                            </div>              
                                            </div>
                                            <div className='close-button'>
                                            <RiCloseFill onClick={()=>windowOverlayClose(post?.path)}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        });
                    }

                    return null;
                }
            })}
        </div>

        </div>
    </div>
  )
}

export default Explore