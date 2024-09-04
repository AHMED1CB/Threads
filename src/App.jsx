import React  from 'react';
import Register from './components/register';
import { Routes, Route} from 'react-router-dom';
import Login from './components/login';
import Profile from './components/profile';
import Threads from './components/threads';
import User from './components/User'; 
import Error from './components/Error';
import Thread from './components/Thread';



function App  ()  {

  return (
    <div className="App w-full h-full" >
      <Routes>
        <Route path={'/user/:user'} element={<User/>} />
        <Route path={'/thread/:thread'} element={<Thread/>} />
        <Route path="/" element={<Threads/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path={'*'} element={<Error/>} />
      </Routes>
    </div>
  )
}

export default App;