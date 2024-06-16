import React, { useState } from 'react';
import authService  from '../appwrite/auth';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

const createUser = async(e) => {
    e.preventDefault()
    setError('')
    try {
        const user = await authService.createAccount({email,password,name})
        console.log(user);
        if (user) {
            const userData = await authService.getCurrentUser()
            if (userData) dispatch(login(userData))
                console.log('true');
            navigate('/')
        }else{
            console.log('false');
        }
    } catch (error) {
        setError(error.message)
        console.log(error);
    }
}
  
  return (
    <div>
        <form className="max-w-sm mx-auto mt-20" onSubmit={createUser}>
  <div className="mb-5">
    <label for="Name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
    <input type="text" id="Name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="abhay kumar" required value={name} onChange={(e) => setName(e.target.value)} />
  </div>
  <div className="mb-5">
    <label for="Email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
    <input type="email" id="Email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setEmail(e.target.value)} placeholder="abhay@gmail.com" value={email} required />
  </div>
  <div className="mb-5">
    <label for="Password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Password</label>
    <input type="password" id="Password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => setPassword(e.target.value)} value={password} required />
  </div>
  <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
  <Link to={'/login'}>
    <p className='mt-5'>Already have account ? <span className='text-blue-700'>Login here </span>
    </p>
  </Link>
</form>
{
    error ? 
    <div className='text-red-700 mt-20 text-center'>
        {error}
    </div> 
    :
     null
    }
    </div>
  )
}

export default Signup;
