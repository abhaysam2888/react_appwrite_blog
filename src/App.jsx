import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import { useEffect } from 'react'
import authService from './appwrite/auth'
import { useDispatch } from 'react-redux'
import { login as authLogin, logout } from './store/authSlice'
import Header from './components/Header'
import Main from './components/Main'
import {Post, AddPost, EditPost} from '../src/components/index'
import useNetworkStatus from './customHook/useNetworkStatus'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Navbar from './components/Navbar'
import Failed from './components/Failed'


function App() {
  const dispatch = useDispatch()
  const {isOnline} = useNetworkStatus()

  useEffect(() => {
    authService.getCurrentUser()
    .then((res) => {
      if (res) {
        dispatch(authLogin(res))
      }else{
        dispatch(logout())
      }
    })
  }, [])

  if (isOnline) {
    return (
      <>
      <div className='text-white'>
      <BrowserRouter>
      <div className='hidden max-sm:block'>
      <Header/>
      </div>
      <div className='sticky top-5 z-50 max-sm:hidden'>
      <Navbar/>
      </div>
      <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/addpost" element={<AddPost/>}/>
          <Route path="/post/:slug" element={<Post/>}/>
          <Route path="/edit-post/:slug" element={<EditPost/>}/>
          <Route path="/404" element={<Failed/>}/>
         </Routes>
      </BrowserRouter>
      <Analytics/>
      <SpeedInsights/>
      </div>
      </>
 )
  }else{
    return(
      <div className='mt-20 text-white text-3xl text-center'>
        No network Connenction..................
      </div>
    )
  }
}

export default App
