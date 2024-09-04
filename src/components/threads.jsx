import SideBar from "./sidebar";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Store from "./store";
import Comment from "./comment";
import '../style/output.css';


export default function Threads(){
    const [data,setData] = useState(null);
    const [content,setContent] = useState(null);
    const [loading,setLoading] = useState(true);
    const [isComment,setIsComment] = useState(false);
    const [thData,setThData] = useState(false);
        useEffect(() => {
            axios.get(`${import.meta.env.VITE_API_URL}/auth/user-profile`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.token}`,
                }
                    }).then(e => {
                            setData(e.data.user);
                            getAllThreads(e.data.user.id);
                    }).catch(e =>{
                        getAllThreads(null)
                    })
                        
                    
        }, [])
    
        function startComment(d){
            setIsComment(!isComment);
            setThData(d)
        }
    async function follow(from_id, to_id) {
        try {
            setContent(content.map(thread =>
                thread.creator.id === to_id
                    ? { ...thread, is_following: !thread.is_following } // قم بتغيير الحالة هنا
                    : thread
            ));
            await axios.post(import.meta.env.VITE_API_URL + '/user/follow', {
                from: from_id,
                to: to_id
            }, {
                headers: {
                    'X-API-KEY': import.meta.env.VITE_API_KEY
                }
            });
    
            
        } catch (error) {
            console.error('Error following user:', error);
        }
    }
    
            
        async function like(thread_id , user_id = data.id,isCurrentlyLiked) {
            setContent(content.map(thread =>
                thread.id === thread_id
                    ? { ...thread, is_liked: !isCurrentlyLiked, likes_count: isCurrentlyLiked ? thread.likes_count - 1 : thread.likes_count + 1 }
                    : thread
            ));
        
            const D = new FormData();
            D.append('user_id', user_id);
            D.append('thread_id', thread_id);
    
            try {
                await axios.post(import.meta.env.VITE_API_URL + '/thread/like', D, {
                    headers: {
                        'X-API-KEY': import.meta.env.VITE_API_KEY,
                        'Authorization': `Bearer ${localStorage.token}`,
                    }
                });
            } catch (error) {
                console.error('Failed to like the post', error);
            }
        }


        async function checkFollow(uid) {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/checkFollow`, { id: uid, my_id: data.id }, {
                    headers: {
                        'X-API-KEY': import.meta.env.VITE_API_KEY
                    }
                });
                return response.data.is_following; // تأكد من أن البيانات تحتوي على هذه القيمة
            } catch (error) {
                console.error('Error checking follow status:', error);
                return false;
            }
        }
        
            

async function getAllThreads(id){
    setLoading(true);
        axios.post(import.meta.env.VITE_API_URL + '/threads' , {
            id: id
        } , {
            headers:{
                'X-API-KEY' :import.meta.env.VITE_API_KEY   
            }
        }).then(e => {
            setContent(e.data.data);
        }).finally(() =>{
            setLoading(false)
        })
  
}


    
    return (
        <div className="home bg-gray-50 h-full">
        {localStorage.token && <SideBar/>}
     <div className="bg-gray-50 py-5 w-full container mx-auto   px-4 h-full threads">
                    <div className="heading text-center  font-bold flex justify-center items-center  ">
                        <div className="container flex flex-col justify-center items-center gap-6 md:flex-row md:justify-between w-4/6  ">
                        <h2 className={'text-center mx-auto'}>For You</h2>
                        <div className="check">
                        {!data && !loading&& 
                            <div className="containLinks flex  items-center gap-4">
                            <Link className={'px-3 py-2 bg-black text-gray-200 rounded-full text-sm'} to={'/register'}>
                            Register
                            </Link>
                            <Link className={'px-3 py-2  text-black-200 rounded-full text-sm'} to={'/login'}>
                            Login
                            </Link>
                            
                            </div>
                        }
                        </div>
                        </div>
                    </div>
    <div className="content border-gray-300 rounded-2xl border mt-4 w-full md:w-4/5    border-3xl  mx-auto p-6">
         { content && content.map(e => {
          return  <div key={e.id + '-' + e.content}  className="thread mb-8   border-b border-gray-300 py-4 w-full">
             <div className="head my-4 flex justify-between pr-7  ">
 
    <div className="user flex gap-5 items-center justify-between w-full">
     <div className="user_data flex  gap-5">
    
     <img src={e.creator.image ? `data:image/${e.creator.image_type};base64,${e.creator.image}` : '../../assets/user.jpg'} className="post_creator "/>
   {!data && 
     
     <Link to={e.creator  && `/user/${e.creator_slug}`}> 
     <h2 className="mt-1">{e.creator.name}</h2>
     </Link>
|| 
 
<Link to={e.creator.id !==  data.id && data && `/user/${e.creator_slug}` || './'}> 
<h2 className="mt-1">{e.creator.name}</h2>
</Link>
}
            </div>

            {e.creator && data &&  e.creator.id !== data.id &&
              <div className={`follow py-2 cursor-pointer px-3 rounded-full  ${e.is_following ? 'text-black bg-white border border-black ' : 'bg-black text-white'}`}
              onClick={async () => {
                  const isFollowing = await checkFollow(e.creator.id);
                  await follow(data.id, e.creator.id);
                  setContent(content.map(thread =>
                      thread.creator.id === e.creator.id
                          ? { ...thread, is_following: !isFollowing }
                          : thread
                  ));
              }}
          >
              {e.is_following ? 'Unfollow' : 'Follow'}
          </div>
            }
     </div>
     
 
 </div>

<Link to={'thread/'+e.slug}> 
<div className="body p-2  w-full  rounded-2xl cursor-pointer   font-semibold  my-4 ">
 <div className="content  post-content px-4">
 <div className="text mb-3 text-gray-600">
 <p className=" text-left w-full post-text" >{e.content}</p>
 
 </div>                                        
      {
          e.image && 
          <div className="image border border-gray-300 p-5 rounded-xl mt-5 " >
          <img src={`data:image/${e.image_type};base64,${e.image}`} className='mx-auto  post_image'/>
          </div>
      }
 </div>


 </div>

</Link>


 {data &&
     <div className="footer mt-2    w-full " dir={'rtl'}>
     <div className="options flex max-auto   w-full text-bold  gap-10 ">
         <div className="likes flex gap-4 flex items-center">
         <span>{e.likes_count}</span>

            <i onClick={() => like(e.id  , data.id,  e.is_liked)}  className={`ph cursor-pointer text-3xl ${e.is_liked ? 'ph-heart-fill text-red-400' : 'ph-heart'} `} ></i>
           
            </div>
         <div className="com flex items-center gap-4">
         <span>{e.comments.length}</span>   
         <i className="ph cursor-pointer text-3xl ph-chat" onClick={() => startComment(e)} ></i>
         </div>
     </div>

     </div>
     || <div className="footer my-2  flex  w-full" dir={'rtl'}>
     <div className="options flex max-auto   wfull text-bold  gap-10 ">
        <Link to="/register" className={'flex gap-6 items-center'} >
         <div className="likes flex gap-4 items-center">
           <span>{e.likes_count}</span>
            <i className={`ph cursor-pointer text-3xl ph-heart `} ></i>
            </div>
         
            <div className="com flex items-center gap-4">
         <span>{e.comments.length}</span>   
         <i className="ph cursor-pointer text-3xl ph-chat" ></i>
         </div>
     </Link>
     </div>
     </div>
     }
         
 
 
          
 
 
         </div>
 
         }) }
         {content &&  content.length < 1 && <h2 className={'text-center py-4'}> No Threads Yet </h2> }
        </div>
         </div>
         {loading && 
            <div className="loader-wrapper w-full h-full fixed inset-0 flex justify-center items-center bg-black bg-opacity-50" >
            <div className="loader fixed "></div>
            </div>
            }

            {data && 
    <Store id={data ? data.id : null} image={data.image ?  `data:image/${data.image_type};base64,${data.image}` : '../../assets/user.jpg'}  getUserThreads={getAllThreads} data={data} setLoading = {setLoading}/>

}

            {
                isComment &&
                <Comment setIsCommenting={setIsComment} setLoading={setLoading} threadData={thData} image={data.image ?  `data:image/${data.image_type};base64,${data.image}` : '../../assets/user.jpg'}  data={data} />
            }


        </div>
    );
}