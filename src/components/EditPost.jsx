import React, {useEffect} from 'react'
import { AddPost } from '.'
import { useNavigate, useParams } from 'react-router-dom'
import useArticleFetch from '../customHook/useArticleFetch'
import { useSelector } from 'react-redux'

function EditPost() {
    const {slug} = useParams()
    const navigate = useNavigate()
    if (slug) useArticleFetch(slug);
    const post = useSelector((state) => state.data.article)
    
    useEffect(() => {
        if (!slug) {
            navigate('/')
        }
    }, [slug, navigate])
    return post.length !== 0 ? (
        <AddPost post={post}/>
    ) :
    null
}

export default EditPost
