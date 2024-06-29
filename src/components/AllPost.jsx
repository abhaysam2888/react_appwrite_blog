import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faUser, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import Button from "./Button";
import { useSelector, useDispatch } from "react-redux";
import { getSlug } from "../store/getPostSlice";
import useArticlesFetch from '../customHook/useArticlesFetch';
import { Link } from "react-router-dom";
import service from "../appwrite/config";
import parse from "html-react-parser";

export default function AllPost() {
  useArticlesFetch()
    const {articles, loading} = useSelector((state) => state.data)
    const dispatch = useDispatch()

    const handelClick = (slug) => {
      dispatch(getSlug(slug))
      localStorage.setItem('slug', slug)
    }
    
    if (loading) {
        return(
            <div className='text-white mt-52 text-3xl text-center'>
                Loading...
            </div>
        )
    }
  return ( 
    <div className="w-full h-full mt-16">
      <div className="mx-auto max-w-6xl p-5">
      {/* post type */}
        <div className="w-full py-5 px-5 border-b-[1px] mb-5 border-white/[0.6]">
          <h1 className="text-3xl">
            Featured post
          </h1>
        </div>
        {/* post */}
        <div className="space-y-6">
        {
          articles && articles.map((item) => (

              <div key={item.$id} onClick={() => handelClick(item.$id)}>

                <Link to={`/post/${item.title}`}>

                  <div className="flex justify-between max-md:border max-md:rounded-lg max-md:overflow-hidden items-center max-md:flex-col">

                    <div className="max-md:w-full max-md:h-full max-md:flex max-md:justify-center">
                      <img src={service.getFilePreviews(item.image)} alt={item.title} className="w-[390px] max-[846px]:w-[320px] max-md:w-full max-md:h-[320px] h-[220px] object-cover max-[375px]:h-[220px]" loading="lazy"/>
                    </div>
                    
                  <div className="max-w-2xl space-y-4 max-[1145px]:max-w-xl max-[1042px]:max-w-lg max-[961px]:max-w-sm max-md:max-w-full max-md:px-10 max-md:my-10 max-[481px]:px-4 max-[375px]:my-4">

                  <div className="flex space-x-4">
                    <div className="space-x-2 flex items-center justify-center text-gray-300">
                      <span>
                      <FontAwesomeIcon icon={faUser} className="w-3"/>
                      </span>
                      <span>
                      {item.username || "username"}
                      </span>
                  </div>
                    <p className="text-gray-300">
                        {
                            `${new Date(item.$createdAt).getDate()}-${new Date(item.$createdAt).getMonth()+1}-${new Date(item.$createdAt).getFullYear()}`
                        }
                    </p>
                  </div>
                  <div>
                      <span className="text-3xl whitespace-nowrap overflow-hidden text-ellipsis line-clamp-1">{item.title || "Title Lorem ipsum, dolor sit amet consectetur adipisicing elit."}</span>
                  </div>
                  <div>
                    <span className="line-clamp-3">
                      {parse(item.content) || "some text Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, repellendus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit deleniti illum eum accusantium! Sapiente ducimus facere minus iusto beatae dolorum accusantium voluptatibus. Fuga dolor deleniti inventore odit minima repudiandae beatae."}
                    </span>
                  </div>
                  <div>
                    <Button className="inline-flex space-x-3 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000,45%,#0000,55%,#000)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <span>Read more</span>
                    <span>
                    <FontAwesomeIcon icon={faAngleRight} className="text-gray-700"/>
                    </span>
                    </Button>
                  </div>
                  </div>
                  </div>
                </Link>
            </div>
          ))
        }
        </div>
      </div>
    </div>
  );
}
