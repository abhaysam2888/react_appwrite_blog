import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    articles: [],
    article: [],
    loading: true,
}

export const getPostSlice = createSlice({
    name: "getPost",
    initialState,
    reducers: {
        getArticlesData: (state, action) => {
            state.articles = action.payload
            state.loading = false
        },
        getArticleData: (state, action) => {
            state.article = action.payload
            state.loading = false
        },
    }
})

export const {  getArticlesData, getArticleData } = getPostSlice.actions

export default getPostSlice.reducer