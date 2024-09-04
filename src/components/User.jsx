import { useParams, Link, useNavigate } from "react-router-dom";
import Error from './Error';
import SideBar from "./sidebar";
import axios from "axios";
import  "../style/main.css";
import '../style/output.css';

import { useEffect, useState } from "react";
import Comment from './comment';
export default function User(){
    const navigate = useNavigate();
    const [data , setData] = useState(null);
    const {user} = useParams();
    const [err , setErr] = useState(false);
    const [loading , setLoading] = useState(false);
    const [threads , setThreads] = useState(null);
    const [me , setMe] = useState(null);
    const [isF , setIsf] = useState(null);
    const [isComment,setIsComment] = useState(false);
    const [thData,setThData] = useState(false);


        async function myProfile () {
            setLoading(true);
            const myProfile = await   axios.get(`${import.meta.env.VITE_API_URL}/auth/user-profile`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.token}`,
                    'X-API-KEY' : import.meta.env.VITE_API_KEY,
                }
                    }).catch((e) => {
                        if (e.response.status === 401){

                            userProfile(user , null);
                            return;
                        }

                    })
                    
                    if (myProfile && myProfile.data.user){
                        setMe(myProfile.data.user);
                        userProfile(user , myProfile.data.user.id);
                }


                
            }



            async function userProfile(slug , yourIdToCheckFollowersAndLikes) {

                const userData = await axios.post(import.meta.env.VITE_API_URL + '/user/get' , {
                    slug:slug,
                    id : yourIdToCheckFollowersAndLikes,
                } , {
                    headers:{
                    'X-API-KEY' : import.meta.env.VITE_API_KEY,

                    }
                }); 
                setData(userData.data.user);
                setIsf(userData.data.is_followed_by_you);    
                if (userData.data.user){
                        userThreads(userData.data.user.id ,  yourIdToCheckFollowersAndLikes);
                }else{
                    setErr(!err);
                }



            }

            
            
            useEffect(() => {
                    myProfile();
                } , [])


                async function userThreads(user_id , yourIdToCheckFollowersAndLikes) {
                    const responseData = await axios.post(import.meta.env.VITE_API_URL + '/user/threads/get' , {
                        id:user_id,
                        bid: yourIdToCheckFollowersAndLikes
                    } , {
                        headers:{
                            'X-API-KEY' : import.meta.env.VITE_API_KEY,
                            
                        }
                    });
                    setThreads(responseData.data);
                    setLoading(false);
                  
                }



                async function follow(){
                    if (me && data){
                        const response =  await axios.post(import.meta.env.VITE_API_URL + '/user/follow', {
                            from: me.id,
                            to: data.id
                        }, {
                            headers: {
                                'X-API-KEY': import.meta.env.VITE_API_KEY
                            }
                        });

                        setIsf(!isF)

                    }else{
                        navigate('/register');
                    }
                }


                   async function like(threadIdToCreateLike , isCurrentlyLiked){
                       if (me && data){
                        const D = new FormData();
                        D.append('user_id', me.id);
                        D.append('thread_id', threadIdToCreateLike);
            
                        setThreads(threads.map(thread =>
                            thread.id === threadIdToCreateLike
                                ? { ...thread, is_liked: !isCurrentlyLiked, likes_count: isCurrentlyLiked ? thread.likes_count - 1 : thread.likes_count + 1 }
                                : thread
                        ));

                        try {

                            const g =  await axios.post(import.meta.env.VITE_API_URL + '/thread/like', D, {
                                headers: {
                                    'X-API-KEY': import.meta.env.VITE_API_KEY,
                                    'Authorization': `Bearer ${localStorage.token}`,
                                }
                            });

                        } catch (error) {
                            console.error('Failed to like the post', error);
                        }

                        }else{
                            navigate('/register');
                        }

                    }




                    function startComment(d){
                        setIsComment(!isComment);
                        setThData(d)
                    }


    if (err) {
        return <Error/>
    }

    return (
        <div className="user_profile   py-5 w-full container mx-auto px-4 h-full">
        {me && <SideBar/>}
        <div className="content border-gray-300 rounded-2xl border mt-4 w-4/5  border-3xl  mx-auto p-6">
                <div className="head md:mx-0 mx-auto flex flex-col w-full md:flex-row p-5 justify-center md:justify-between border-b">
                    <div className="text order-2 w-4/6 flex flex-col w-full text-center md:text-left mt-5">
                        <div className="name font-bold text-xl my-3">
                            <h2>{data ? data.name : 'loading'}</h2>
                        
                        </div>

                        {
                            <div className="bio w-4/6 my-4 text-lg text-center md:text-justify text-gray-500 w-full md:w-4/6 md:pl-6">
                                <p>{data ? data.bio : 'loading'}</p>
                            </div>
                        }
                    </div>


                      <div className="image md:order-3 order-1 md:mx-0 mx-auto">
                     <img className="pro_image"  src={data && data.image ? `data:image/${data.image_type};base64,${data.image}` : '../../assets/user.jpg'} alt="Profile" />
                     </div>
                  
              </div>
                {me ? 
                     <div className="follow_unFollow w-full text-center pb-8">
                     <button
                         
                       className="btn w-4/5 hover:text-black hover:bg-gray-200 hover:border-black transition duration-200 border text-center bg-black mt-8 m-auto text-gray-200 p-3 rounded-3xl"
                     onClick={follow}
                     >
                         {isF ? 'un Follow' : 'Follow'}
                     </button>
                 </div>
 
                :
                <Link to="/register" >
                             <div className="follow w-full text-center pb-8">
                    <button
                        
                      className="btn w-4/5 hover:text-black hover:bg-gray-200 hover:border-black transition duration-200 border text-center bg-black mt-8 m-auto text-gray-200 p-3 rounded-3xl"
                      >
                          Follow
                    </button>
                </div>

                
                </Link>
                
                }
                <div className="body">
                    <div className="head flex justify-center">
                        <div className="threads   text-lg text-center p-4 font-medium border-b border-black w-full">
                            Threads
                        </div>
                        
                    </div>
                    <div className="threads w-full my-6 border border-gray-300  rounded-xl ">
              
              {data && threads && threads.length > 0 && 
                    threads.map(e => {
                        return <div key={e.id} className="thread mb-12  border-b border-gray-300 w-full p-5">
                        <div className="head my-4 flex justify-between pr-7">
                    
                           
                    
                        <div className="user flex gap-5 items-start">
                        <img src={data.image && `data:image/${data.image_type};base64,${data.image}` || '../../assets/user.jpg'} className="post_creator "/>
                        <h2 className="mt-1">{data.name}</h2>
                        </div>
                        
                
                    </div>
                    <Link to={`/thread/${e.slug}`}>
                    <div className="body p-2  w-full  rounded-2xl pt-6  font-semibold  my-7">
                    <div className="content  post-content px-4">
                    <div className="text mb-3 text-gray-600">
                    <p className=" text-left w-full post-text" dit="ltr">{e.content}</p>
                    
                    </div>                                        
                         {e.image &&   e.image_type && <div className="image border border-gray-300 p-5 rounded-xl mt-5 " >
                            <img src={`data:image/${e.image_type};base64,${e.image}`} className='mx-auto  post_image'/>
                    </div>}
                    </div>
                    </div>
                    
                    </Link>
                    <div className="footer my-2  flex  w-full" dir={'rtl'}>
                    <div className="options flex max-auto   wfull text-bold  gap-10 ">
                        <div className="likes flex gap-4 items-center">
                                <span >{e.likes_count}</span>
                           <i onClick={() => like(e.id , e.is_liked)} className={`ph cursor-pointer text-3xl ${e.is_liked ? 'ph-heart-fill text-red-400': 'ph-heart' }`} ></i>
                           </div>
                        
                        <i onClick={() => startComment(e)} className="ph cursor-pointer text-3xl ph-chat" ></i>
                    </div>
                    </div>
                    </div>
                    })

                  }
                  {threads && threads.length < 1 && <h2 className={'text-3xl text-gray-400 text-center py-3'}> No Threads Yet </h2>  }
          </div>
                
                </div>
                    </div>
                    {loading && 
            <div className="loader-wrapper w-full h-full fixed inset-0 flex justify-center items-center bg-black bg-opacity-50" >
            <div className="loader "></div>
            </div>
            }

              {
                isComment &&
                <Comment setIsCommenting={setIsComment} setLoading={setLoading} threadData={thData} image={me.image ?  `data:image/${me.image_type};base64,${me.image}` : '../../assets/user.jpg'}  data={me} />
            }
        </div>
    );
    
} 