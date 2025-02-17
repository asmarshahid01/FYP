import React from 'react'
import loginBg from './assets/loginBg.jpg'
import { Lock, User } from "lucide-react";

export default function LoginPage() {
  return (
    <div className='absolute h-full w-full bg-[#111820] top-0 left-0 overflow-hidden flex items-center justify-center'>
        <img src={loginBg} className='absolute h-full w-full top-0 left-0 z-0' />
        <div className='absolute h-full w-full top-0 left-0 z-10 bg-[#111820ee]'></div>
        <div className='h-[40vh] w-[30vw] bg-[#111820] rounded-sm z-20 shadow-lg flex flex-col items-center justify-center gap-[0.5vh]'>
            <h1 className='font-bold m-[1vw] text-lg'>LOGIN</h1>
            <div className='w-[50%] bg-[#282e3b] rounded-sm flex'>
                <User className="relative left-[0.7vw] top-[0.7vw] text-[#fbfbfb]" />
                <input 
                type="text" 
                placeholder="21L-XXXX" 
                className={`w-[50%] rounded-sm pl-[1.5vw] pr-[0.8vw] py-[0.5vw] bg-[#282e3b] text-white focus:outline-none text-[0.9vw]`}
                />
            </div>
            <div className='w-[50%] bg-[#282e3b] rounded-sm flex'>
                <Lock className="relative left-[0.7vw] top-[0.7vw] text-[#fbfbfb]" />
                <input 
                type="password" 
                placeholder="password" 
                className={`pl-[1.5vw] pr-[0.8vw] py-[0.5vw] text-white focus:outline-none text-[0.9vw]`}
                />
            </div>
            <div className='py-[0.5vw] bg-blue-400 w-[50%] flex align-center justify-center rounded-sm font-bold cursor-pointer mt-[1vh]'>Login</div>
        </div>
    </div>
  )
}
