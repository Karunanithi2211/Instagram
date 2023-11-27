import React, { useEffect, useState } from 'react'
import './Profile.css'
import api from '../api/axiosConfig'
import SideBar from '../Home/SideBar/SideBar'
import Cookies from 'js-cookie'
import { Avatar } from '@mui/material'
import { RiCloseFill, RiSettings5Fill } from "react-icons/ri";
import customprofile from './profile.png'
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { useLocation, useNavigate } from 'react-router-dom'
import { FaComment, FaHeart, FaRegHeart } from 'react-icons/fa'
import { VscSend } from 'react-icons/vsc'

const UserDetails = ({ email,comment }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isuser,setIsUser] = useState()
  const follow=async(data) =>{
    const formData = new FormData()
    formData.append('email',isuser?.email)
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
      formData.append('email',isuser?.email)
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

  const getUser= async ()=>{
    const isuser = await api.get('/nivak/insta/userbyemail/'+Cookies.get('useremail'))
    const isuserdata = isuser.data
    setIsUser(isuserdata)

  }

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
    getUser();
  }, [email]);

  return (
    <div>
      {userDetails && (
        <>
          {
            comment === 'comment' ?(
              <div className='commentsection'>
                <a href={`/profile/${userDetails?.username}/`}>
                  <Avatar style={{ maxWidth: '30px', maxHeight: '30px' }}>
                    {
                        userDetails.profilepic ? (
                            <img src={api.defaults.baseURL + userDetails?.profilepic} alt='profile' style={{ maxWidth: '30px', maxHeight: '30px' }}/>
                        ) : (
                            <img src={customprofile} alt="Profile Picture" id='profileimage' style={{ maxWidth: '30px', maxHeight: '30px' }}/>
                    )}
                  </Avatar>
                </a>
                <p style={{marginLeft:'10px'}}>{userDetails.username}</p>
              </div>
            ):(
              <div className='commentsection'>
                <a href={`/profile/${userDetails?.username}/`}>
                  <Avatar style={{ maxWidth: '40px', maxHeight: '40px' }}>
                    {
                        userDetails.profilepic ? (
                            <img src={api.defaults.baseURL + userDetails?.profilepic} alt='profile' style={{ maxWidth: '40px', maxHeight: '40px' }}/>
                        ) : (
                            <img src={customprofile} alt="Profile Picture" id='profileimage' style={{ maxWidth: '40px', maxHeight: '40px' }}/>
                    )}
                  </Avatar>
                </a>
                <table>
                    <tr>
                      <td><p style={{marginLeft:'10px'}}>{userDetails.username}</p></td>
                      <td>
                        {
                          Cookies.get('useremail') !== userDetails?.email ? (<p>{!isuser?.following?.includes(userDetails?.email)?<button className='follow-follow-unfollow' onClick={()=>follow(userDetails?.email)}>Follow</button>:<button className='follow-follow-unfollow' onClick={()=>unfollow(userDetails?.email)}>Unfollow</button>}</p>):(<><p>yours</p></>)
                        }
                      </td>
                    </tr>
                </table>
              </div>
            )
          }
        </>
      )}
    </div>
  );
};

const Profile = () => {
  const [user,setUser] = useState()
  const [isuser,setIsUser] = useState()
  const location = useLocation()
  const path = location.pathname
  const parts = path.split('/');
  const extractedPart = parts[parts.length - 2];

  const [postComment, setPostComment] = useState('');

  const handlePostCommentChange = (event) => {
        setPostComment(event.target.value);
  };

  
  
  const getUser= async ()=>{
    const response = await api.get('/nivak/insta/userbyname/'+extractedPart)
    const singledata = response.data
    setUser(singledata)
    const isuser = await api.get('/nivak/insta/userbyemail/'+Cookies.get('useremail'))
    const isuserdata = isuser.data
    setIsUser(isuserdata)

  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('email',user?.email)
    formData.append('profile', file);

    try {
      const response = await api.post('/nivak/insta/uploadprofilepic', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded:', response.data);
      getUser()
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  const follow=async(data) =>{
    const formData = new FormData()
    formData.append('email',isuser?.email)
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
      formData.append('email',isuser?.email)
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

  const windowOverlayOpen = (path) => {
    const windowOverlay = document.getElementById(`window-overlay-${path}`);
    if (windowOverlay) {
      windowOverlay.style.display = 'flex';
      const isVideo = path && (path.includes('.mp4') || path.includes('.mov') || path.includes('.avi'));
      if (isVideo) {
        const winVideo = document.getElementById(`window-video-${path}`);
        if (winVideo) {
          winVideo.play();
          winVideo.muted = false;
        }
      }
    }
  };
  
  const windowOverlayClose = (path) => {
    const windowOverlay = document.getElementById(`window-overlay-${path}`);
    if (windowOverlay) {
      windowOverlay.style.display = 'none';
      setPostComment('');
      const isVideo = path && (path.includes('.mp4') || path.includes('.mov') || path.includes('.avi'));
      if (isVideo) {
        const winVideo = document.getElementById(`window-video-${path}`);
        if (winVideo) {
          winVideo.muted = true;
        }
      }
    }
  };

  const followingOverlayOpen= () =>{
    document.getElementById('following-overlay').style.display = 'flex'
  }

  const followingOverlayClose= () =>{
    document.getElementById('following-overlay').style.display = 'none'
    getUser()
  }

  const followerOverlayOpen= () =>{
    document.getElementById('follower-overlay').style.display = 'flex'
  }

  const followerOverlayClose= () =>{
    document.getElementById('follower-overlay').style.display = 'none'
    getUser()
  }

  const likePost = async (postemail,postid) => {
    const formData = new FormData();
    formData.append('email',isuser?.email)
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
    formData.append('email',isuser?.email)
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
    formData.append('email',isuser?.email)
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
    <div className='profile'>
      <div className='profile-sidebar'>
        <SideBar/>
      </div>
      <div className='profile-content'>
        <div className='upper-part'>
            <div className='profile-image-container'>
              <Avatar className='profile-image'>
                {user?.profilepic ? (
                    <>
                      <label for="fileInput" className="uploadfile" id='uploadfile'>
                        <input type="file" id="fileInput" className="file-input" onChange={handleFileUpload}/>
                        <img src={api.defaults.baseURL + user?.profilepic} alt='profile'/>
                      </label>
                    </>
                ) : (
                    <>
                      <img src={customprofile} className='profileimage' alt="Profile Picture" id='profileimage'/>
                      <label for="fileInput" className="uploadfile" id='uploadfile'>
                        <input type="file" id="fileInput" className="file-input" onChange={handleFileUpload}/>
                      </label>
                    </>
                )}
              </Avatar>
            </div>
            <div className='name-content'>
                <div className='name-content-detail'>
                  {
                    isuser && user && isuser?.email === user?.email ? (
                      <>
                      <p className='profile-name'>{user?.username}</p>
                      <button><a href='/accounts/edit/'>Edit profile</a></button>
                      <button><a href='/accounts/edit/'>View Archive</a></button>
                      <RiSettings5Fill/>
                      </>
                    ):(
                      <>
                      <p className='profile-name'>{user?.username}</p>
                      {!isuser?.following?.includes(user?.email)?<button className='search-follow-unfollow' onClick={()=>follow(user?.email)}>Follow</button>:<button className='search-follow-unfollow' onClick={()=>unfollow(user?.email)}>Unfollow</button>}
                      <RiSettings5Fill/>
                      </>
                    )
                  }
                </div>
                <br/>
                <div className='name-content-other'>
                  <p>{user?.posts ? user.posts.length : 0} post</p>
                  <p onClick={followerOverlayOpen}>{user?.followers ? user.followers.length : 0} followers</p>
                  <p onClick={followingOverlayOpen}>{user?.following ? user.following.length : 0} following</p>
                </div>
                <br/>
                <p className='fullname'>{user?.fullname}</p>
            </div>
        </div>
        <hr/>
        <div className='lower-part'>
            <div className='lower-part-title'>
              <p><HiOutlineSquares2X2 className='icons'/><span style={{fontSize:"15px"}}>POSTS</span></p>
            </div>
            <div class="row">
              {user?.posts?.map((post) => {
                  const isLiked = post?.like?.includes(isuser?.email)
                  const isImage = post?.path && (post.path?.includes('.jpg') || post?.path.includes('.png') || post?.path.includes('.jpeg'));
                  const isVideo = post?.path && (post?.path.includes('.mp4') || post?.path.includes('.mov') || post?.path.includes('.avi'));

                  return (
                    <div className='column'>
                      <div className='cards'>
                        <div className='card'>
                          {isImage && <img src={api.defaults.baseURL+post?.path} alt="Image" onClick={()=>windowOverlayOpen(post?.path)}/>}
                          {isVideo && (
                            <video loop autoPlay muted onClick={()=>windowOverlayOpen(post?.path)}>
                              <source src={api.defaults.baseURL+post?.path} type="video/mp4"/>
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
                                  <a href={`/profile/${user?.username}/`}>
                                  <Avatar>
                                      {
                                          user.profilepic ? (
                                              <img src={api.defaults.baseURL + user?.profilepic} alt='profile' style={{ maxWidth: '40px', maxHeight: '40px' }}/>
                                          ) : (
                                              <img src={customprofile} className='profileimage' alt="Profile Picture" id='profileimage' style={{width: '40px',height:'40px'}}/>
                                      )}
                                  </Avatar>
                                  </a>
                                  <p>{user?.username}</p>
                              </div>
                              <hr/>
                              <div className='window-right-center'>
                                  {post?.comments.length != 0?
                                  post?.comments?.map((com, index) => (
                                  <div key={index}>
                                      <UserDetails email={com?.commentemail} comment={'comment'} />
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
                                          <p>{isLiked?<FaHeart style={{color:'red'}} onClick={() => unlikePost(user?.email,post?.id)}/>:<FaRegHeart onClick={() => likePost(user?.email,post?.id)}/>}</p>
                                          <p><FaComment/></p>
                                      </div>
                                      </td>
                                  </tr>
                                  </table>
                              </div>
                              <p>{post?.like ? post?.like.length:0} Likes</p>
                              <p>{post?.description}</p>
                              <div>
                                  <textarea type='text' placeholder='Add a comment...' value={postComment} onChange={handlePostCommentChange}/><VscSend style={{fontSize:'22px'}} onClick={()=> comment(user?.email,post?.id,postComment)}/>
                              </div>              
                              </div>
                              <div className='close-button'>
                              <RiCloseFill onClick={()=>windowOverlayClose(post?.path)}/>
                              </div>
                          </div>
                      </div>
                      <div id='following-overlay' className='following-overlay'>
                          <div className='following-overlay-container'>
                              {
                               user?.following && user?.following.length > 0 ? (
                                  <div>
                                      {
                                        user?.following?.map((follow)=>{
                                        return(
                                          <>
                                            {
                                              <>
                                              <UserDetails email={follow}/><br/>
                                              </>
                                            }
                                          </>
                                        )
                                      })
                                    }
                                  </div>
                               ) : (
                                <>
                                  <p>No Followings</p>
                                </>
                               )
                              }
                          </div>
                          <div className='closebutton'>
                            <RiCloseFill onClick={followingOverlayClose}/>
                          </div>
                      </div>
                      <div id='follower-overlay' className='follower-overlay'>
                          <div className='follower-overlay-container'>
                              {
                               user?.followers && user?.followers.length > 0 ? (
                                  <div>
                                      {
                                        user?.followers?.map((follower)=>{
                                        return(
                                          <>
                                            {
                                              <>
                                              <UserDetails email={follower}/><br/>
                                              </>
                                            }
                                          </>
                                        )
                                      })
                                    }
                                  </div>
                               ) : (
                                <>
                                  <p>No Followers</p>
                                </>
                               )
                              }
                          </div>
                          <div className='closebutton'>
                            <RiCloseFill onClick={followerOverlayClose}/>
                          </div>
                      </div>
                      </div>
                    </div>
                  );
                })}
            </div>
        </div>
      </div>
    </div>
  )
}

export default Profile