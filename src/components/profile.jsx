import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Update from './editprofile';
import SideBar from './sidebar';
import '../style/output.css';

import Threads from './userThreads';
import Followers from './follow';

export default function Profile() {
    const [data, setData] = useState({});
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const image = data.image && data.image_type ? `data:image/${data.image_type};base64,${data.image}`  :'../../assets/user.jpg';
    const [loading , setLoading] = useState(false);
    const [followers , setFollowers] = useState(false);
    const [following , setFollowing] = useState(false);
    const [showFl , setShowFl] = useState(false);

    function getData () {
        axios.get(`${import.meta.env.VITE_API_URL}/auth/user-profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        .then(response => {
            if (response.status === 200) {
                setData(response.data.user);
                setFollowers(response.data.followers);
                setFollowing(response.data.following)
                setLoading(false);


            } else {
        setLoading(false);                    
                navigate('/register');
            }
        })
        .catch((e) => {
        setLoading(false);
            navigate('/register');
        });
    }


    useEffect(() => {
        if (token) {
            setLoading(true);
           getData();
        } else {
            navigate('/register');
        }
    }, [navigate]);
    return (
        <div className="profile  py-5 w-full container mx-auto px-4 h-full ">
        <SideBar/>
            <div className="heading text-center">
            {visible && <Update data={data} setLoading = {setLoading} token={token} setData={setData} image={image} setVisible={setVisible} />}
                <Link to="./" className="text-xl font-medium">Profile</Link>
            </div>
            <div className="content border-gray-300 rounded-2xl border mt-4 w-full  border-3xl  mx-auto p-6">
                <div className="head  md:mx-0 mx-auto flex flex-col w-full md:flex-row p-5 justify-center md:justify-between border-b">
                    <div className="text order-2 w-4/6 flex flex-col w-full text-center md:text-left mt-5">
                        <div className="name overflow-hidden font-bold text-xl my-3">
                            <h2>{data.name || 'Loading'}</h2>
                        </div>
                        <div className="followers text-xl my-3 pl-6">
                            <button  className="border-b font-medium hover:border-gray-400 transition duration-200" onClick={() => setShowFl(!showFl)}>{followers.length} Followers</button>
                        </div>
                        {data.bio && (
                            <div className="bio overflow-hidden w-4/6 my-4 text-lg  text-center md:text-start text-gray-500 w-full md:w-4/6 overfolow-hidden md:pl-6" style={{maxWidth:'400px'}}>
                                <p>{data.bio.slice( 0 , 300)}</p>
                            </div>
                        )}
                    </div>
                    <div className="image md:order-3 order-1 md:mx-0 mx-auto">
                     <img className="pro_image"  src={image} alt="Profile" />
                
                    </div>
                </div>
                <div className="edit w-full text-center pb-8">
                    <button
                        onClick={() => setVisible(true)}
                        className="btn w-4/5 hover:text-black hover:bg-gray-200 hover:border-black transition duration-200 border text-center bg-black mt-8 m-auto text-gray-200 p-3 rounded-3xl"
                    >
                        Edit Profile
                    </button>
                </div>
                <div className="body">
                    <div className="head flex justify-center">
                        <div className="threads   text-lg text-center p-4 font-medium border-b border-black w-full">
                            Threads
                        </div>
                        
                    </div>
                    <div className="threads w-full my-6 border border-gray-300  rounded-xl ">
              
                        {data && 
                               <Threads setLoading = {setLoading} image={image} data={data} />   
                            }
                    </div>
                </div>
            </div>
            {loading && 
            <div className="loader-wrapper w-full h-full fixed inset-0 flex justify-center items-center bg-black bg-opacity-50" >
            <div className="loader bg-transparent z-8"></div>
            </div>
            }


                {
                    showFl &&
                    <Followers following={following} gt={getData} setShowFl={setShowFl } data={data} setFollowers={setFollowers} followers={followers}/>
                }

        </div>
    );
}
