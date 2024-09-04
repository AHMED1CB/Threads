import axios from 'axios';
import {useState , useEffect , useRef } from 'react';
import EditThread from './editThread';
import {useNavigate , Link} from 'react-router-dom';
import Store from './store';
import Comment from './comment';
import '../style/output.css';

export default function Threads({image , data , setLoading , id}){
        const navigate = useNavigate()
        const [threads , setThreads] = useState(null);
        const optionsRef = useRef(null);
        const [editVs , setEditVs] = useState(false);
        const [threadData , setThreadData] = useState(false);
        const [isComminting , setIsCommenting] = useState(false);
      
    async function openCommentPlace(e){
        setIsCommenting(e => !e);
        setThreadData(e)
    }


        async function like(thread_id, user_id, isCurrentlyLiked) {
            setThreads(threads.map(thread =>
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
    
        
        
        function handleEditClick(data ){
                setEditVs(true);
                setThreadData(data);
            }

   async function getUserThreads(token = localStorage.token ){
            axios.post(import.meta.env.VITE_API_URL + '/user/threads' , {} , {
                headers:{
                'Authorization': `Bearer ${token}`,
                'X-API-KEY' : import.meta.env.VITE_API_KEY,
                'Content-Type': 'application/octet-stream', 
                }
            } ).then(e => {
                setThreads(e.data.data);   
            }).catch(e => {
                if (e.reponse.status === 401){
                        navigate('/register');
                }
            })
        }

        
            
        useEffect(() => {
                getUserThreads(localStorage.token);
            },[threadData, editVs])
        
                
                function deleteThread(thread){
                    setLoading(true);
                        axios.post(import.meta.env.VITE_API_URL + '/thread/', {
                            id:thread
                        } , {
                            headers :{
                                'X-API-KEY' : import.meta.env.VITE_API_KEY,
                                 'Authorization': `Bearer ${localStorage.token}`,
                            }
                         }).finally(() => {
                            getUserThreads(localStorage.token);
                            setTimeout(() => {        setLoading(false);
                        
                            } , 1900)
                        })
                }

             

            
        return (
        <div className="contain">
            
            {editVs &&  <EditThread  data={data} setLoading={setLoading} image={image} thread={threadData} setEditVs={setEditVs} editVs={editVs}/>
}
        {threads && threads.map (e => {
            return <div key={e.id} className="thread mb-12  border-b border-gray-300 w-full p-5">
    <div className="head my-4 flex justify-between pr-7">

       

    <div className="user flex gap-5 items-start">
    <img src={image} className="post_creator "/>
    <h2 className="mt-1">{data.name}</h2>
    </div>
    
    <div className="options-container mt-10 md:mt-0  flex  items-center gap-5 flex-col">

    <div className="options  text-3xl   duration-300 flex gap-7" ref={optionsRef}>
            <i onClick= {() => deleteThread(e.id)} className=" delet cursor-pointer text-gray-400 ph ph-trash-fill " ></i>
            <i  className=" delet cursor-pointer text-gray-400 ph ph-pen" onClick={() => handleEditClick(e)}></i>
    </div>
    </div>
</div>
<Link to={'/thread/' + e.slug}>
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
       <i className={`ph cursor-pointer text-3xl ${e.is_liked ? 'ph-heart-fill text-red-400': 'ph-heart' }`} onClick={(el) =>like(e.id ,data.id,e.is_liked)}></i>
       </div>
    
<div className="COM flex items-center gap-4">
<span>{e.comments.length}</span>
<i className="ph cursor-pointer text-3xl ph-chat" onClick={() => openCommentPlace(e)}></i>
</div>
</div>
</div>
</div>
        })}

        {threads && threads.length  < 1  && <h2 className={'font-bold text-center p-12 text-4xl text-gray-400'}>No Threads Yet</h2>}


                {isComminting && 
                        <Comment setLoading = {setLoading} data={data} threadData={threadData} image={image} setIsCommenting={setIsCommenting}/>
                }


            <Store image={image}  getUserThreads={getUserThreads} data={data} setLoading = {setLoading}/>
         


        </div>
     )
    }