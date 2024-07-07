import React, { useCallback, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "./index";
import service from "../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSlug } from "../store/getPostSlice";
import axios from 'axios';
import conf from "../conf/conf";

export default function AddPost({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.auth.userCred);
    const userAuth = useSelector((state) => state.auth.status);
    const [disabel, setDisabel] = useState(false)


    // Ai article generator 
    const [input, setInput] = useState('');
    const [responses, setResponse] = useState('');
    const [cache, setCache] = useState({});
    const [loading, setloading] = useState(false)

     // copy function 
     const textRef = useRef(null)
     
     const copyClick = useCallback(() => {
        textRef.current.select();
        window.navigator.clipboard.writeText(responses)
     },[responses])

    async function generateArticle(){
         setloading(true)
          try {
            const response = await axios({
              url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${conf.chatGptApiKey}`,
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
              },
              data: {
                contents:[
                    {
                        parts:[{text:`Please generate a detailed article titled "${input}". The article should be well-structured with proper headings and subheadings. It should include an introduction, several main sections, and a conclusion. Each section should have its own heading. Use a formal tone and ensure the content is informative and engaging, and generate in html with above styling.`
                    }]
                    }
                ]
              }
          })
          setloading(false)
          
          const generatedText = response.data.candidates[0].content.parts[0].text;
          setCache((prevCache) => ({ ...prevCache, [input]: generatedText}));
          setResponse(generatedText);
          } catch (error) {
            console.error('Error generating article:', error);
            setloading(false)
          }
        }

        const handleClick = () => {
            if (cache[input]) {
              setResponse(cache[input]);
            } else {
              if(input.length !== 0) {
                generateArticle();
              }else{
                setResponse('No title')
              }
            }
          };
        //   setting for edit post title
          if (post && input.length === 0) {
            setTimeout(() => {
                setInput(post.title);
                setValue('title', post.title); 
            },100)
        }

          const handleInputChange = (event) => {
            const value = event.target.value;
            setValue('title', value); 
            setInput(value);
          };
        // Ai search end

    const submit = async (data) => {
        console.log(data);
        setDisabel(true)
        // update post logic
        if (post) {
            const file = data.image[0] ? await service.uploadFile(data.image[0]) : null;

            if (file) {
                service.deleteFile(post.image);
            }

            const dbPost = await service.updatePost(post.$id, {
                ...data,
                image: file ? file.$id : undefined,
            });

            if (dbPost) {
                dispatch(getSlug(dbPost.$id))
                navigate(`/post/${dbPost.title}`);
            }
        } else {
            // create post logic
            const file = await service.uploadFile(data.image[0]);

            if (file) {
                // for slug length not exceed more than 36 because the document id not more than 36 char
                let f = ''
                for (let index = 0; index < 36; index++) {
                    f += data.slug.charAt(index)
                }
                const fileId = file.$id;
                data.image = fileId;
                data.slug = f;
                const dbPost = await service.createPost({ ...data, userid: userData.$id, email:userData.email, username:userData.name });

                if (dbPost) {
                    dispatch(getSlug(dbPost.$id))
                    navigate(`/post/${dbPost.title}`);
                }
            }
        }
    };
     
    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    if (!userAuth) {
       return (
        <div className="text-white mt-52 text-3xl text-center">
            <p>
                Login to add Article
            </p>
        </div>
       ) 
    }

    return (
        <>
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap mt-8">
            <div className="w-2/3 px-2 max-md:w-full">
            <label 
            className="inline-block mb-1 pl-1"
            htmlFor={"ai-gen2"}>
                Title :
            </label>
                <input
                    placeholder="title"
                    className={`px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full mb-4`}
                    id="ai-gen2"
                    {...register("title", { required: true })}
                    onChange={handleInputChange}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2 max-md:w-full max-md:mt-5">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="h-[50px] mb-1 block w-full text-sm text-slate-500
                    file:mr-4 file:px-4 file:cursor-pointer file:py-2
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={service.getFilePreviews(post.image)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <label 
                 className={`inline-block mb-1 pl-1`}
                 htmlFor={"ai-gen"}>
                 AI Suggestion :
                </label>
                <div className={`px-3 py-2 rounded-lg bg-white text-black focus:bg-gray-50 duration-200 border border-gray-200 w-full ${responses.length > 8 ? "h-[500px]" : 'min-h-5'} mb-4 `}>
                    <div>
                        <div className="flex justify-between">
                        <span className="text-red-600">
                        suggestion:
                        </span>
                        <div className="bg-gray-700 text-white py-1 px-2 rounded-lg text-sm font-mono cursor-pointer" onClick={copyClick}>
                        Copy
                        </div>
                        </div>
                    <br />
                    {loading ? <p className="text-center mt-5">Loading....</p> : <textarea className={`w-full ${responses.length > 8 && "h-96"} outline-none web`} ref={textRef} value={responses} readOnly /> }
                    </div>
                </div>
                <div className="my-3">
                    <p>
                        {responses.length > 8 ? "copy the above text >> (Editor) view >> source code >> paste it >> save it" : ""}
                    </p>
                </div>

                <div className={`w-full rounded-lg px-4 py-2 text-center cursor-pointer ${post ? 'bg-green-500' : "bg-blue-600"}`} onClick={handleClick}>
                    Generate
                </div>

                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className='w-full mt-5' disabled={disabel}>
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
        </>
    );
}

