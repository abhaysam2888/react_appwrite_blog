import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import { useEffect } from 'react'
import authService from './appwrite/auth'
import { useDispatch } from 'react-redux'
import { login as authLogin, logout } from './store/authSlice'
import Header from './components/Header'
import Main from './components/Main'
import {Post, AddPost, AllPost, EditPost} from '../src/components/index'
import useNetworkStatus from './customHook/useNetworkStatus'
import { Analytics } from '@vercel/analytics/react'


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
      <div className='bg-slate-950 text-white'>
      <BrowserRouter>
      <Header/>
      <Routes>
          <Route path="/" element={<Main/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/addpost" element={<AddPost/>}/>
          <Route path="/post/:slug" element={<Post/>}/>
          <Route path="/edit-post/:slug" element={<EditPost/>}/>
          <Route path="/allpost" element={<AllPost/>}/>
         </Routes>
      </BrowserRouter>
      <Analytics/>
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
