import { useState } from "react";
import axios from 'axios';
import '../style/output.css';

export default function Followers({setShowFl , followers ,data , following,setFollowers , gt}){
    const [turn , setTurn] = useState('followers');
async  function unFollow (e) {
    axios.post(import.meta.env.VITE_API_URL + '/user/follow', {
        from: data.id,
        to: e
    }, {
        headers: {
            'X-API-KEY': import.meta.env.VITE_API_KEY
        }
    }).then(e => {
        gt()
    });
}
    const [show , setShow] = useState(true);
        function toggleF(){
            setShow(!show)
            

            setTimeout(() =>{setShowFl(e => !e)} , 300)
        }
        async function follow(to_id) {
            try {
                setFollowers(followers.map(follower =>
                    follower.id === to_id
                        ? { ...follower, is_already_followed: !follower.is_already_followed } // قم بتغيير الحالة هنا
                        : follow
                ));
                await axios.post(import.meta.env.VITE_API_URL + '/user/follow', {
                    from: data.id,
                    to: to_id
                }, {
                    headers: {
                        'X-API-KEY': import.meta.env.VITE_API_KEY
                    }
                });
                gt()
        
                
            } catch (error) {
                console.error('Error following user:', error);
            }
            gt()
        }

    return (
        <div className="contain">    
      <div className="w-full h-full fixed inset-0 p-8 bg-opacity-50 flex flex-col items-center justify-center gap-5">
        <div
          className="overLay cursor-pointer"
          style={{ zIndex: '-1' }}
          onClick={toggleF}
        ></div>
        <div
          className={`content bg-gray-100 p-5 rounded-3xl ${show ? 'fade-in show' : 'fade-out hide'}`}

        >
          
          <div className="head relative  flex gap-6 justify-between   ">
                <div onClick={() => setTurn('followers')} className={`transition duration-300  followers text-center font-bold text-xl w-1/2 pb-3 ${turn === 'followers' ? 'border-b border-black'  : ''}`}><button>Followers</button></div>
                <div onClick={() => setTurn('following')} className={`transition duration-300 following text-center font-bold text-xl w-1/2 pb-3 ${turn === 'following' ? 'border-b border-black'  : ''}`}><button>Following</button></div>
          </div>

            <div className="body ">
            {turn === 'followers' &&
                followers && followers.map(e => {
                    return (        
                        <div key={e.id} className="follower flex items-start  gap-5 w-full my-4 border-b border-gray-400  py-2">
                        <div className="follower_imag pro_image-min"> <img className={'rounded-full'} src={e.image ? `data:image/${e.image_type};base64,${e.image}` :"../../assets/user.jpg"} /> </div>
                        
                        <div className="text font-semibold flex justify-between w-4/5 ">
                        <div className="name mt-3">{e.name}</div>
                        <div onClick={() => follow(e.id)} className={`follow_back?_unFollow mt-5  ${e.is_already_followed ?  "border border-black":  "bg-black text-white" }  rounded-2xl flex justify-center items-center p-2 text-sm`}><button>{e.is_already_followed ? 'un Follow' : 'Follow Back'}</button></div>
                        </div>
                        </div>
                    )
                })
            }

                { turn === 'followers' && followers.length  < 1 && <h2 className={'p-3 text-center font-bold'}> No Followers Yet</h2>  }

                {turn === 'following' &&
                    following && following.length > 0&&
                    following.map(e => {
                      return  <div key={e.id} className="follower flex items-start  gap-5 w-full my-4 border-b border-gray-400  py-2">
                        <div className="follower_imag pro_image-min"> <img className={'rounded-full'} src={e.image ? `data:image/${e.image_type};base64,${e.image}` :"../../assets/user.jpg"} /> </div>
                        
                        <div className="text font-semibold flex justify-between w-4/5 ">
                        <div className="name mt-3">{e.name}</div>
                        <div onClick={(l) => {unFollow(e.id)}} className={`unFollow mt-5  border border-black  rounded-2xl flex justify-center items-center p-2 text-sm`}><button>un Follow</button></div>
                        </div>
                        </div>
                    })
                    
            }


            {turn === 'following' && following.length < 1 && <h2 className="text-center py-4 text-md font-bold"> No Following Yet</h2>}

 





            </div>
          
        </div>
      </div>
    </div>

    );

}