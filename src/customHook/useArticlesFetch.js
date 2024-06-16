import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getArticlesData } from '../store/getPostSlice';
import service from '../appwrite/config';

const useArticlesFetch = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const posts = await service.getPosts([]);
                if (posts) {
                    dispatch(getArticlesData(posts.documents));
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchData();
    }, [dispatch]);
};

export default useArticlesFetch;
