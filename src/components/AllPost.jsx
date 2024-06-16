import React from 'react'
import service from '../appwrite/config'; 
import { Link } from 'react-router-dom';
import useArticlesFetch from '../customHook/useArticlesFetch';
import { useSelector } from 'react-redux';

function AllPost() {
    useArticlesFetch()
    const {articles, loading} = useSelector((state) => state.data)
    if (loading) {
        return(
            <div className='text-white mt-52 text-3xl text-center'>
                Loading...
            </div>
        )
    }
    return (
        <div className='w-full py-8 mt-20'>
            <div className='flex flex-wrap'>
                {articles.map((post) => (
                    <div key={post.$id} className='p-2 w-1/4'>
                        <Link to={`/post/${post.$id}`}>
                            <div className='w-full bg-[#2d3748] rounded-xl p-4'>
                                <div className='w-full justify-center mb-4'>
                                    <img src={service.getFilePreviews(post.image)} alt={post.title}
                                    className='rounded-xl w-[340px] h-[340px] object-cover' loading='lazy'/>
                                </div>
                                <h2
                                className='text-xl font-bold'
                                >{post.title}</h2>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
    </div>
    )
}

export default AllPost
