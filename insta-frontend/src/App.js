import './App.css';
import api from './api/axiosConfig'
import { BrowserRouter,Route,Routes, useLocation } from 'react-router-dom';
import Login from './Start/Login/Login';
import Register from './Start/Register/Register';
import Forget from './Start/Forget_Password/Forget';
import Verify from './Start/Verify/Verify';
import Home from './Home/Home';
import Profile from './Profile/Profile';
import Reels from './Reels/Reels';
import Explore from './Explore/Explore';



function App() {
  return (
    <div>
       <BrowserRouter>
          <Routes>
              <Route path='/' element={<Login/>}/>
              <Route path='/accounts/password/reset/' element={<Forget/>}/>
              <Route path='/accounts/emailsignup/' element={<Register/>}/>
              <Route path='/accounts/emailsignup/verify/' element={<Verify/>}/>
              <Route path='/home' element={<Home/>}/>
              <Route path='/profile/:username/' element={<Profile/>}/>
              <Route path='/explore/' element={<Explore/>}/>
              <Route path='/reels/' element={<Reels/>}/>
          </Routes>
       </BrowserRouter>
    </div>
  );
}

export default App;
