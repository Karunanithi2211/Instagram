import React, { useEffect, useState } from 'react'
import './SideBar.css'
import api from '../../api/axiosConfig'
import { FaInstagram, FaRegHeart } from "react-icons/fa";
import { GoHome, GoSearch } from "react-icons/go";
import { TiCompass } from "react-icons/ti";
import { BiMenu, BiMoviePlay } from "react-icons/bi";
import { TbSend } from "react-icons/tb";
import { BsPlusSquare } from "react-icons/bs";
import { useLocation, useNavigate } from 'react-router-dom';
import { RxCrossCircled} from "react-icons/rx";
import Cookies from 'js-cookie';
import customprofile from './profile.png'
import { Avatar } from '@mui/material';

const SideBar = () => {
    const [user,setUser] = useState()
    const [alluser,setAllUser] = useState()
    const location = useLocation()
    const navigate = useNavigate()
    const [media, setMedia] = useState(null);
    const [previewMedia, setPreviewMedia] = useState(null);
    const [description, setDescription] = useState('');
    const [search, setSearch] = useState('');
    const [isSearch, setIsSearch] = useState(false)

    const getClassName = (path) =>{
        return location.pathname === path ? 'active' : ''
    }

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen,setIsMenuOpen] = useState(false)
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const toggleSearch = () => {
        setIsSearch(false)
        setSearch(null)
        setIsSearchOpen(!isSearchOpen);
    };
    const userId = Cookies.get('useremail')

    const getUser= async ()=>{
      const response = await api.get('/nivak/insta/userbyemail/'+userId)
      const singledata = response.data
      setUser(singledata)
      const alluser = await api.get('/nivak/insta/users')
      setAllUser(alluser.data)
    }

    const createOpenOverlay = () => {
        document.getElementById('overlay').style.display = 'flex';
    };
    
    const createCloseOverlay = () => {
        document.getElementById('overlay').style.display = 'none';
        setMedia(null);
        setPreviewMedia(null);
        setDescription('')
    };



    const handleMediaChange = (event) => {
        const selectedMedia = event.target.files[0];
        setMedia(selectedMedia);
    
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewMedia(reader.result);
        };
        if (selectedMedia.type.startsWith('image')) {
          reader.readAsDataURL(selectedMedia); 
        } else if (selectedMedia.type.startsWith('video')) {
          setPreviewMedia(URL.createObjectURL(selectedMedia));
        }
    };
    
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    
    const handleFilterChange = (e) => {
        if(e.target.value !== ''){
            setIsSearch(true)
        }
        setSearch(e.target.value.toLowerCase().replace(/\s/g, ''));
    };

    const removeSpacesAndLowerCase = (text) => {
        return text.replace(/\s/g, '').toLowerCase();
    };

    const filteredData = alluser?.filter((data) => {
        return removeSpacesAndLowerCase(data.username).includes(search);
    });

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


    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('email',user?.email)
        formData.append('media', media);
        formData.append('description', description);
    
        try {
          const response = await api.post('/nivak/insta/uploadpost', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
    
          console.log('Media uploaded:', response.data);
          window.location.reload()
          setDescription('')
          setMedia(null)
          setPreviewMedia(null)
          createCloseOverlay()
        } catch (error) {
          console.error('Error uploading media:', error);
        }
    };

    const logout=()=>{
        Cookies.remove('useremail',{path:'/'})
        navigate('/')
        
    }

    useEffect(()=>{
      getUser();
    },[])
  return (
    <>
        <div className='side-bar'>
            <div className={`instagram ${isSearchOpen ? 'open' : ''}`} >
                <button><a><FaInstagram className='icon'/><span>Instagram</span></a></button>
            </div>
            
            <div className={`side-bar-content ${isSearchOpen ? 'open' : ''}`}>
                <a href='/home'><button className={getClassName('/home')}><GoHome className='icon'/><span>Home</span></button></a>

                <button onClick={toggleSearch}><a><GoSearch className='icon'/><span>Search</span></a></button>

                <div className={`search-bar ${isSearchOpen ? 'open' : ''}`}>
                    <input type="text" placeholder="Search..." onChange={handleFilterChange}/><button className='button-cross' onClick={toggleSearch}><RxCrossCircled/></button>
                    <br/>
                    <div className='other-user'>
                    { isSearch &&
                        filteredData?.map((data)=>{
                        if (user?.username !== data?.username) {
                            return(
                            <>
                                <div className='search-user'>
                                    <div className='search-user-name-profile'>
                                        <a href={`/profile/${data?.username}/`} className='link-to-profile'>
                                        <Avatar className='search-add-friends-profile'>
                                        {
                                            data?.profilepic ? (
                                                <img src={api.defaults.baseURL + data?.profilepic} alt='profile'/>
                                            ) : (
                                                <img src={customprofile} className='profileimage' alt="Profile Picture" id='profileimage'/>
                                        )}
                                        </Avatar>
                                        </a>
                                    </div>
                                    <div className='search-user-name-content'>
                                        <table>
                                            <tr>
                                                <td>
                                                    <a href={`/profile/${data?.username}/`}  className='link-to-profile'>
                                                        <div className='content-name'>
                                                            <p className='search-username'>{data?.username}</p>
                                                            <p className='search-fullname'>{data?.fullname}</p>
                                                        </div>
                                                    </a>
                                                </td>
                                                <td>{!user?.following?.includes(data?.email)?<button className='search-follow-unfollow' onClick={()=>follow(data?.email)}>Follow</button>:<button className='search-follow-unfollow' onClick={()=>unfollow(data?.email)}>Unfollow</button>}</td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </>
                            )
                        }
                        })
                    }
                    </div>
                </div>

                <a href='/explore/'><button className={getClassName('/explore/')}><TiCompass className='icon'/><span>Explore</span></button></a>

                <a href='/reels/'><button className={getClassName('/reels/')}><BiMoviePlay className='icon'/><span>Reels</span></button></a>

                <a><button className={getClassName('/direct/inbox/')}><TbSend className='icon'/><span>Messages</span></button></a>

                <a><button><FaRegHeart className='icon'/><span>Notifications</span></button></a>

                <a><button onClick={createOpenOverlay}><BsPlusSquare className='icon create'/><span>Create</span></button></a>

                <a href={`/profile/${user?.username}/`}><button className={getClassName('/profile/'+user?.username+'/')}>
                    <div className='profile-sidebar-container'>
                        <Avatar className='sidebar-profile'>
                        {
                            user?.profilepic ? (
                                <img src={api.defaults.baseURL + user?.profilepic} alt='profile'/>
                            ) : (
                                <img src={customprofile} className='profileimage' alt="Profile Picture" id='profileimage'/>
                        )}
                        </Avatar>
                        <span>Profile</span>
                    </div>
                </button></a>

                <button onClick={toggleMenu}><BiMenu className='icon'/><span>More</span></button>
                <div className={`menu-bar ${isMenuOpen ? 'open' : ''}`}>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
        </div>

        <div id="overlay" className='overlay'>
            <div className='create-container'>
                <div>
                    <label for="fileInput" className="uploadmedia" id='uploadfile'>
                      <input type="file" id="fileInput" accept="image/*, video/*" className="file-input-media" onChange={handleMediaChange} required/>
                      <span><BsPlusSquare className='square-icon'/></span>
                    </label>
                    <div className='close' onClick={createCloseOverlay}><RxCrossCircled/></div>
                    <div className=''>
                        {previewMedia && (
                            <>
                            {media.type.startsWith('image') ? (
                                <img src={previewMedia} alt="Preview" style={{ minWidth: '100%', minHeight:'360px',maxWidth: '100%', maxHeight:'360px' ,marginTop:"60px"}}/>
                            ) : (
                                <video src={previewMedia} style={{ minWidth: '100%', minHeight:'360px',maxWidth: '100%', maxHeight:'360px' ,marginTop:"60px"}} autoPlay loop/>
                            )}
                            </>
                        )}
                    </div>
                    <textarea
                        placeholder="description..."
                        value={description}
                        onChange={handleDescriptionChange}
                        required
                    />
                    {(media !== null && description !==null)?<button onClick={handleUpload}>Post</button>:<button style={{cursor:"not-allowed"}}>Post</button>}
                </div>
            </div>
        </div>
    </>
  )
}

export default SideBar