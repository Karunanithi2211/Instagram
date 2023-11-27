import React, { useEffect, useRef, useState } from 'react'
import api from '../api/axiosConfig'
import './Reels.css'
import Cookies from 'js-cookie'
import { InView } from 'react-intersection-observer'
import { FaBookmark, FaComment, FaHeart, FaPause, FaPlay, FaRegHeart, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'
import { Avatar } from '@mui/material'
import { BsThreeDots } from 'react-icons/bs'
import customprofile from './profile.png'
import SideBar from '../Home/SideBar/SideBar'
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




const Reels = () => {
  const [user, setUser] = useState();
  const [alluser, setAllUser] = useState();
  const [playingVideos, setPlayingVideos] = useState([]);
  const [videoStatus, setVideoStatus] = useState({});
  const [postComment, setPostComment] = useState('');
  const videoRefs = useRef({});

  const handlePostCommentChange = (event) => {
    setPostComment(event.target.value);
  };

  const handleVideoPlay = (videoId) => {
      setPlayingVideos((prev) => [...prev, videoId]);
  };

  const handleVideoPause = (videoId) => {
      setPlayingVideos((prev) => prev.filter((id) => id !== videoId));
  };

  const togglePlayPause = (videoId) => {
      const video = document.getElementById(`video-${videoId}`);
      if (video) {
          if (video.paused) {
              video.play();
          } else {
              video.pause();
          }
          setVideoStatus((prev) => ({
              ...prev,
              [videoId]: {
                  ...prev[videoId],
                  isPlaying: !video.paused,
              },
          }));
      }
  };

  const toggleMute = (videoId) => {
      const video = document.getElementById(`video-${videoId}`);
      if (video) {
          video.muted = !video.muted;
          setVideoStatus((prev) => ({
              ...prev,
              [videoId]: {
                  ...prev[videoId],
                  isMuted: video.muted,
              },
          }));
      }
  };

  const userId = Cookies.get('useremail');


  const getUser = async () => {
      const response = await api.get('/nivak/insta/userbyemail/' + userId);
      setUser(response.data);
      const allUser = await api.get('/nivak/insta/users');
      setAllUser(allUser.data);
      console.log(allUser.data)
  };
  
  const windowOverlayOpen = (path) => {
    document.getElementById(`window-overlay-${path}`).style.display = 'flex';
    const isVideo = path && (path.includes('.mp4') || path.includes('.mov') || path.includes('.avi'));
    if (isVideo) {
      const video = document.getElementById(`video-${path}`);
      video.pause();
      video.muted = true
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
      const video = document.getElementById(`video-${path}`);
      video.play();
      video.muted = false
      const winVideo = document.getElementById(`window-video-${path}`)
      if (winVideo) {
        winVideo.muted =true 
      }
    }
  };

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

  
  useEffect(() => {
      getUser();
  }, []);


  return (
      <div className='explore'>
          <div className='reel-sidebar'><SideBar /></div>
          <div className='reel-content'>
              <div className='cards'>
                  {
                  alluser?.map((data,index) => {
                      if (user?.email !== data?.email && !user?.following?.includes(data?.email)
                      ) {
                          if (data?.posts && data?.posts.length > 0) {
                            return(
                              data?.posts?.sort((a, b) => a.id - b.id)?.map((post)=>{console.log(post)
                                const isLiked = post?.like.includes(user?.email)
                                const isImage = post?.path && (post?.path.includes('.jpg') || post?.path.includes('.png') || post?.path.includes('.jpeg'));
                                const isVideo = post?.path && (post?.path.includes('.mp4') || post?.path.includes('.mov') || post?.path.includes('.avi'));
                                if (isVideo) {
                                  return (
                                      <div className='card' key={`${data.username}-${index}`}>
                                          <div className='card-media'>
                                              <InView
                                                  as="div"
                                                  threshold={0.5}
                                                  onChange={(inView,entry) => {
                                                      if (inView && entry.intersectionRatio >=0.5) {
                                                          handleVideoPlay(post?.path);
                                                          setVideoStatus((prev) => ({
                                                            ...prev,
                                                            [post?.path]: {
                                                              ...prev[post?.path],
                                                              isPlaying: !post?.path.paused,
                                                            },
                                                          }));
                                                      } else {
                                                          handleVideoPause(post?.path);
                                                          setVideoStatus((prev) => ({
                                                            ...prev,
                                                            [post?.path]: {
                                                              ...prev[post?.path],
                                                              isPlaying: post?.path.paused,
                                                            },
                                                          }));
                                                      }
                                                  }}
                                              >
                                                  <div className='reel-video-media' onClick={() => toggleMute(post?.path)}>
                                                      <div className='reel-video-controls'>
                                                        <div className='play-pause'>
                                                            {videoStatus[post?.path]?.isPlaying ? (
                                                              <FaPause onClick={() => togglePlayPause(post?.path)} />
                                                            ) : (
                                                              <FaPlay onClick={() => togglePlayPause(post?.path)} />
                                                            )}
                                                        </div>
                                                        <div className='like-comment'>
                                                            <p>{isLiked?<FaHeart style={{color:'red'}} onClick={() => unlikePost(data?.email,post?.id)}/>:<FaRegHeart onClick={() => likePost(data?.email,post?.id)}/>}</p>
                                                            <p><FaComment onClick={()=>windowOverlayOpen(post?.path)}/></p>
                                                        </div>
                                                        <div className='reel-profile'>
                                                            <div className='reel-profile-content'>
                                                            <a href={`/profile/${data?.username}/`}>
                                                              <Avatar style={{ maxWidth: '40px', maxHeight: '40px' }}>
                                                                {
                                                                    data.profilepic ? (
                                                                        <img src={api.defaults.baseURL + data?.profilepic} alt='profile' style={{ maxWidth: '40px', maxHeight: '40px' }}/>
                                                                    ) : (
                                                                        <img src={customprofile} className='profileimage' alt="Profile Picture" id='profileimage' style={{width: '40px',height:'40px'}}/>
                                                                )}
                                                              </Avatar>
                                                              </a>
                                                              <p>{data?.username}</p>
                                                              {!user?.following?.includes(data?.email)?<button className='reel-follow-unfollow' onClick={()=>follow(data?.email)}>Follow</button>:<button className='reel-follow-unfollow' onClick={()=>unfollow(data?.email)}>Unfollow</button>}
                                                            </div>
                                                            <br/>
                                                            <div>
                                                              {post?.description}
                                                            </div>
                                                        </div>
                                                      </div>
                                                      <video
                                                          src={api.defaults.baseURL + post?.path}
                                                          id={`video-${post?.path}`}
                                                          autoPlay
                                                          loop
                                                          muted={!playingVideos.includes(post?.path)} 
                                                          data-post={post?.path}
                                                      />
                                                  </div>
                                              </InView>
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
                                                    {!user?.following?.includes(data?.email)?<button className='reel-follow-unfollow' onClick={()=>follow(data?.email)}>Follow</button>:<button className='reel-follow-unfollow' onClick={()=>unfollow(data?.email)}>Unfollow</button>}
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
                              }
                            return null;
                          })
                            )
                          }
                      }
                      return null;
                  })}
              </div>
          </div>
      </div>
  );
};

export default Reels;
