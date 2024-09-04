import SideBar from "./sidebar";
import { useState   , useEffect} from "react";
import Error from './Error';
import axios from 'axios';
import '../style/output.css';
import Comment from './comment';
import { useParams, useNavigate , Link } from "react-router-dom";
 export default function Thread() {
    const [data,setData] = useState(null);
    const [loading,setLoading] = useState(true);
    const [threadData,setThread] = useState(true);
    const [me , setMe] = useState(null);
    const [isF , setIsf] = useState(false);
    const navigate = useNavigate();
    const [isL , setIsL] = useState(false);
    const [isCommenting , setIsCommening] = useState(false);
    const [comments , setcomments] = useState(null);
    const {thread} = useParams();
    async function run() {
                axios.get(`${import.meta.env.VITE_API_URL}/auth/user-profile`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.token}`,
                    }
                        }).then(e => {
                                getUserData(e.data.user.id);
                                setMe(e.data.user)
                        }).catch(e =>{
                            getUserData();
                        })
                
            

    }
    async function  getUserData(yourIdToCheckFollowAndLike) {
            // get Creator Data
            axios.post(`${import.meta.env.VITE_API_URL}/singleThread`, {
                slug : thread ,
                id:yourIdToCheckFollowAndLike
            } , {
                headers: {
                    'X-API-KEY' :  import.meta.env.VITE_API_KEY
                }

            }).then(e => {
                setData(e.data.creator);
                setThread(e.data.data)
                setIsL(e.data.data.is_liked)
                setIsf(e.data.is_followed);
                setcomments(e.data.data.comments);
                // console.log(e.data.data)    
                }).finally(() => {
                            setLoading(false);
                        })
                // end Creator Data
        
    }


       async  function follow () {
           if (me){
               
            await axios.post(import.meta.env.VITE_API_URL + '/user/follow', {
                from: me.id,
                to: threadData.id
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

    useEffect(() => {
        run();
        if (!me){
            getUserData(null)
        }
    }, [])

    
        async function deleteComment(id) {
            setLoading(true);
            let newComments = await axios.post(import.meta.env.VITE_API_URL + '/deleteComment' , {comment: id, id:threadData.id} , {
                headers:{
                        'X-API-KEY': import.meta.env.VITE_API_KEY 
                }
            })
            setLoading(false)
            if (newComments) {
                setcomments(newComments.data)
            }
        }

        async function openCommentPlace () {
                if (data && me){
                    setIsCommening(!isCommenting)
                }else{
                    navigate('/register');
                }
           
        }


       async function like () {
            if (me && threadData){
                setThread(prev => ({
                    ...prev,
                    likes_count: isL ? prev.likes_count - 1 : prev.likes_count + 1,
                    is_liked: !prev.is_liked
                }));
                    
                await axios.post(import.meta.env.VITE_API_URL + '/thread/like', {
                    user_id : me.id,
                    thread_id : threadData.id
                }, {
                    headers: {
                        'X-API-KEY': import.meta.env.VITE_API_KEY,
                        'Authorization': `Bearer ${localStorage.token}`,
                    }
                });        
            }else{
                navigate('/register');
            }
        }

    
    return (
        <div className="Thread   py-5 w-full container mx-auto px-4 h-full ">
        {localStorage.token && <SideBar/>}
        {data && thread &&
        
           <div className="content border-gray-300 rounded-2xl border mt-4 w-full md:w-4/5   border-3xl  mx-auto p-6">
           
           <div className="head items-center md:mx-0 mx-auto flex flex-col border-gray-300 w-full md:flex-row p-5 justify-center md:justify-between border-b">
           <div className="creator  w-full flex gap-5 items-center justify-between "> 
              <Link to={'/user/' + data.slug}>
               <div className="data flex gap-4 ">
              <div className="image"> <img src={data.image ? `data:image/${data.image_type};base64,${data.image}` : '../../assets/user.jpg'} className = {'pro_image_min'}/></div>
               <div className="name mt-3"><h2>{data.name}</h2></div>
               </div>
               </Link>
                    {me && data.id !== me.id && <div  style={{width:'fit-content'}} onClick={follow} className={`follow py-2 cursor-pointer px-3 rounded-2xl text-center text-sm   ${isF ? 'bg-white border-black border' : 'bg-black text-white'}`}>{isF &&'un Follow' || 'Follow'}</div>
            }
            </div>
           </div>
           <div className="body p-2  w-full  rounded-2xl pt-6  font-semibold  my-7">
           <div className="content  post-content px-4">
   
   <div className="text mb-3 text-gray-600">
   <p className=" text-left w-full post-text" dit="ltr">{threadData.content}</p>
   
   </div>                                        
   {threadData.image && 
    <div  className="image border border-gray-300 p-5 rounded-xl mt-5" ><img src={`data:${threadData.image_type};base64,${threadData.image}`} className='mx-auto  post_image'/></div>
   
}
   </div>
   
           
   </div>
   <div className="footer my-2 border-b border-gray-300 pb-4 flex  w-full" dir={'rtl'}>
   <div className="options flex max-auto   wfull text-bold  gap-10 ">
       <div className="likes flex gap-4 items-center">
               <span>{threadData.likes_count}</span>
          <i className={`ph cursor-pointer text-3xl   ${threadData.is_liked ? 'ph-heart-fill text-red-400': 'ph-heart' }`} onClick={(el) =>like(threadData.is_liked)}></i>
          </div>
       
       <i className="ph cursor-pointer text-3xl ph-chat" onClick={openCommentPlace}></i>
   </div>
   </div>
   
                   <div className="comments p-5">
                   <div className="heading my-3">Comments: </div>
                 { comments && comments.length > 0 &&  
                comments.map(e => {
                    return  <div key={e.id} className="comment px-4  border-b border-gray-300 my-7">
                       
                    <div className="creator  flex justify-between  ">
                    <div className="data flex gap-4 ">
                    <img src={e.creator.image &&  `data:${e.creatorimage_type};base64,${e.creator.image}` ||'../../assets/user.jpg'} className="post_creator  "/>
                    <h2  className={'mt-4'}>{e.creator.name}</h2>
                    </div>
                {me && me.id === e.creator.id &&  
                    <div className="options cursor-pointer mt-3">
                            <i className="ph ph-trash-fill text-3xl text-gray-400" onClick={() => deleteComment(e.id)}></i>
                    </div>
                    } 
                    </div>
                            <div style={{margin:'20px'}}  className="content border border-gray-400  rounded-3xl py-7 px-12">
                                {e.content}
                            </div>
                                    
                                    </div>
                })
                }
                   
                   
                   </div>
           </div>
           }
            
         {loading && 
        
        <div className="loader-wrapper w-full h-full fixed inset-0 flex justify-center items-center bg-black bg-opacity-50" >
        <div className="loader fixed "></div>
        </div>}
            
        {
                isCommenting &&
                <Comment rd={(d) => setcomments(prev => [d , ...prev]) } setIsCommenting={setIsCommening} setLoading={setLoading} threadData={threadData} image={me.image ?  `data:image/${me.image_type};base64,${me.image}` : '../../assets/user.jpg'}  data={me} />
            }

        </div>   
       )|| <Error/>;

}
        