import { useState } from 'react';
import '../style/output.css';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Comment({ image, data, setIsCommenting ,threadData , setLoading ,rd}) {
  const [show, setShow] = useState(true);
    const [comment , setComment] = useState('');
    const navigate = useNavigate();
    function toggleComment() {
    setShow((prev) => !prev);
    setTimeout(() => {
      setIsCommenting((prev) => !prev);
    }, 400);
  }



  function sendComment(){
      toggleComment();
if (comment){
    setLoading(true)

        axios.post(import.meta.env.VITE_API_URL +'/thread/comment' , {
            content:comment,
            id:data.id,
            thread_id:threadData.id
        } , {
            headers:{
                'X-API-KEY':import.meta.env.VITE_API_KEY,
                'Authorization': `Bearer ${localStorage.token}`,
                
            }
        }).then(e => {
          if (rd){
            rd(e.data);
          }
          
          navigate('/thread/' + threadData.slug);

        }).finally(() => {
            setLoading(false)
        })
    }
  }


if (threadData){
  return (
    <div className="contain">    
      <div className="w-full h-full fixed inset-0 p-8 bg-opacity-50 flex flex-col items-center justify-center gap-5">
        <div
          className="overLay cursor-pointer"
          onClick={toggleComment}
          style={{ zIndex: '-1' }}
        ></div>
        <div
          className={`content bg-gray-100 p-5 rounded-3xl ${show ? 'fade-in show' : 'fade-out hide'}`}
          style={{ width: '80%' }}
        >
          <div className="head relative mb-3 flex gap-6">
            <div className="image">
              <img src={image} className="pro_image_min" alt="" />
            </div>
            <div className="text">
              <h2 className="font-semibold text-lg mt-2">{data.name} >   ({threadData.content.slice(0,60)}) . . .</h2>
            </div>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="edit_profile_form w-full flex flex-col gap-6">
            <div className="collection flex flex-col gap-2">
              <textarea
                placeholder="Content"
                id="content"
                className="w-full p-3 h-20 text-black text-xl border-b border-gray-500 rounded-md outline-none transition-all duration-300"
                name="newName"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <button className="add bg-black text-gray-200 p-6 my-3 rounded-3xl" onClick={sendComment}>Comment</button>
          </form>
        </div>
      </div>
    </div>
  );
}
}