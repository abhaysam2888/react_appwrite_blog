import React from 'react'
import { useSelector } from 'react-redux'

function Main() {
    const status = useSelector((state) => state.auth.status)
    return (
        <div>
            <div className='text-white text-4xl text-center mt-32'>
                {
                    status ?
                    <h1>user Login</h1> 
                    :
                    <h1>user Logout</h1>
                }
            </div>
        </div>
    )
}

export default Main
