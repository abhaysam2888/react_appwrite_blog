import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { useDispatch, useSelector } from 'react-redux'
import {login} from '../store/authSlice'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [disable, setDisabel] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userLoginFun = async(e) => {
        e.preventDefault()
        setDisabel(true)
        try {
            const user = await authService.userLogin({email, password})
            if (user) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(login(userData))
                    navigate('/')
            }
        } catch (error) {
            setError(error.message)
            setDisabel(false)
            console.log(error);
        }
    }
    return (
        <div>
            <form className="max-w-sm mx-auto mt-20" onSubmit={userLoginFun}>
                <div className="mb-5">
                    <label for="Email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                    <input type="email" id="Email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setEmail(e.target.value)} placeholder="abhay@gmail.com" value={email} required />
                </div>
                <div className="mb-5">
                    <label for="Password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Password</label>
                    <input type="password" id="Password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setPassword(e.target.value)} value={password} required />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" disabled={disable} >Login</button>
                <Link to={'/signup'}>
                <p className='mt-5'>Don't have account ? <span className='text-blue-700'>Signup here </span>
                </p>
                </Link>
            </form>
            {
            error ? 
            <div className='text-red-700 text-3xl mt-20 text-center'>
                {error}
            </div> 
            :
             null
            }
        </div>
    )
}

export default Login
