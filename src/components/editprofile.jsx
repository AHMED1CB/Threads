import { useEffect, useState } from 'react';
import '../style/output.css';

import axios from 'axios';
export default function Update({ image, setVisible ,token , setData , data , setLoading , loading}) {
    const [show, setShow] = useState(false);
    const [key , setKey] = useState(1);
    const [file , setFile]  = useState(null);
    const [name , setName] = useState(data.name);
    const [bio , setBio] = useState(data.bio ? data.bio : '');
    useEffect(() => {
        setShow(true);
        return () => setShow(false);
    }, []);

    async function updateData(){
        if((name && name !== data.name)  || file  ||( bio !== data.bio)){
            
        
        const formData = new FormData();    
        if (file){
                formData.append('image' , file)
                formData.append('image_type' , file.name.slice(file.name.lastIndexOf('.') +1));
         } 

         if (name){
             formData.append('name' , name)
         }

         formData.append('bio', bio ?bio :'' )
        
        setLoading(true);
         axios.post(import.meta.env.VITE_API_URL + '/auth/set_profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.token}`, 
                'X-API-KEY' : import.meta.env.VITE_API_KEY
            }
        })
        .then(response => {
        setLoading(false);
            let allData = response.data.user;
            allData.token = response.data.token;
            setData(allData);
            localStorage.setItem('token' , response.data.token)
            
        })
        .catch(error => {
        setLoading(false);
        setTimeout(() => {    alert('This Image Is Very Big Please Use Another Image');
    } , 1000)
        });
        }
        console.clear();
    }

    const handleOverlayClick = () => {
        setShow(false);
        setTimeout(() => setVisible(false), 300); 
       };
       function handleFleChange(e) {
        const file = e.target.files[0];
        setFile(file);
        setKey(key => key+1)
    }
    
    
    
    
    

    return (
        <div className={`updateProfile w-full h-full fixed flex justify-center items-center `}>
            <div
                onClick={handleOverlayClick}
                className="overLay bg-black inset-0 bg-opacity-70 fixed f-full h-full"
            ></div>
            <div className={`${show ? 'fade-in show' : 'fade-out hide'} conten z-10 bg-gray-100 p-8 rounded-2xl flex flex-col w-4/5 md:w-1/2 items-center justify-between gap-5`}>
                <div className="head relative mb-3 cursor-pointer">
                    <label htmlFor="image" className="ph ph-camera absolute camera_icon cursor-pointer"></label>
                    <img className="pro_image-mini" src={image} />
                </div>
                <form onSubmit = {(e) => e.preventDefault()} className="edit_profile_form w-full flex flex-col gap-6">
                    <input key= {key} accept={'image/*'} onChange={ handleFleChange} type="file" name="image" id="image" className="hidden" />
                    <div className="collection flex flex-col gap-2">
                        <label htmlFor="newName" className="text-2xl font-medium text-left">Name</label>
                        <input
                            type="text"
                            maxLength={50}

                            placeholder="Name"
                            onChange = {(e) => {
                                if (e.target.value.length < 20 ){
                                    setName(e.target.value)
                                }
                            }}
                            value={name}
                            id="newName"
                            className="w-full p-3 h-15 text-black text-xl border-b border-gray-500 rounded-md outline-none transition-all duration-300"
                            name="newName"
                        />
                    </div>
                    <div className="collection flex flex-col gap-2">
                        <label htmlFor="newBio" className="text-2xl font-medium text-left">Bio</label>
                        <input
                            type="text"
                            placeholder="Bio"
                            onChange = {(e) => {
                                if (e.target.value.length < 50 ){
                                    setBio(e.target.value)
                                }
                            }}
                            id="newBio"
                            value={bio}
                            maxLength={50}
                            name="newBio"
                            className="w-full p-3 h-15 text-black text-xl border-b border-gray-500 rounded-md outline-none transition-all duration-300"
                        />
                    </div>
                    <button onClick = {(e) => {
                        updateData(file);
                        handleOverlayClick();
                    }} className="send bg-black text-gray-200 p-6 my-3 rounded-3xl">Done</button>
                </form>
            </div>
            
        </div>
    );
}
