import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import service from "../appwrite/config";
import {Button} from "../components/index";
import parse from "html-react-parser";
import { useSelector, useDispatch } from "react-redux";
import TracingBeam from "../components/ui/tracing-beam";
import { getSlug } from "../store/getPostSlice";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const userData = useSelector((state) => state.auth.userCred);
    const {documentId} = useSelector((state) => state.data);

    const isAuthor = post && userData ? post.userId === userData.userId : false;

    useEffect(() => {
        if (slug) {
            const slug = localStorage.getItem('slug')
            dispatch(getSlug(slug))
            service.getPost(documentId || slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const deletePost = () => {
        service.deletePost(post.$id).then((status) => {
            if (status) {
                service.deleteFile(post.image);
                navigate("/");
            }
        });
    };

    return post ? (
        <TracingBeam className="px-6 mt-8">
            <style>
                {`
                .scrollBar::-webkit-scrollbar {
                            display: none;
                }
                `}
            </style>
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
          <div className="mb-10">
            <div className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
            Author : {userData && userData.name}
            </div>

            <h1 className="text-6xl w-full my-10 px-4 font-bold max-[714px]:text-5xl max-[588px]:text-4xl prose dark:prose-invert max-[461px]:text-3xl max-[461px]:my-5 max-[397px]:text-2xl">
               {post.title}
            </h1>

            <div>
            {isAuthor && (
                        <div className="absolute right-6 top-6 max-sm:top-44 max-sm:right-3 max-[520px]:relative max-[520px]:top-0 max-[520px]:px-4 max-[520px]:right-0 max-[520px]:mb-4">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="inline-flex animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button className="inline-flex animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000,45%,#0000,55%,#000)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
            <img
            src={service.getFilePreviews(post.image)}
            alt={post.title}
            className="rounded-xl"
            loading="lazy"
            />
              <div className="mt-5 prose dark:prose-invert overflow-scroll scrollBar">
                {parse(post.content)}
              </div>
            </div>
          </div>
      </div>
    </TracingBeam>
    ) : null;
}

