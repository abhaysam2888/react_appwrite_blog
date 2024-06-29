import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faUser, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import Button from "./Button";
import { useSelector } from "react-redux";
import useArticlesFetch from '../customHook/useArticlesFetch';
import { Link } from "react-router-dom";
import service from "../appwrite/config";

export default function BackgroundBeamsDemo() {
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
    <div className="w-full h-full mt-16">
      <div className="mx-auto border-transparent border-white/[0.2] border max-w-6xl p-5">
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
              <div key={item.$id}>
                <Link to={`/post/${item.$id}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <img src={service.getFilePreviews(item.image)} alt={item.title} srcset="" className="w-[390px] h-[220px] object-cover" loading="lazy"/>
                    </div>
                  <div className="max-w-2xl space-y-4">
                  <div className="flex space-x-4">
                    <div className="space-x-2 flex items-center justify-center text-gray-300">
                      <span>
                      <FontAwesomeIcon icon={faUser} className="w-3"/>
                      </span>
                      <p>
                      Abhay
                      </p>
                  </div>
                    <p className="text-gray-300">25-06-2024</p>
                  </div>
                  <div>
                      <h2 className="text-3xl whitespace-nowrap overflow-hidden text-ellipsis">Title Lorem ipsum, dolor sit amet consectetur adipisicing elit.</h2>
                  </div>
                  <div>
                    <p className="line-clamp-3">some text Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, repellendus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit deleniti illum eum accusantium! Sapiente ducimus facere minus iusto beatae dolorum accusantium voluptatibus. Fuga dolor deleniti inventore odit minima repudiandae beatae.</p>
                  </div>
                  <div>
                    <Button className="inline-flex space-x-3 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 mr-3 text-gray-300">
                    <p>Read more</p>
                    <div>
                    <FontAwesomeIcon icon={faAngleRight} className="text-gray-700"/>
                    </div>
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
