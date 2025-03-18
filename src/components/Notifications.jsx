import { React, useState} from 'react';
import profilePic from '../assets/profile.jpg';

const Notifications = ({notificationsExpand}) => {

    const [selectedType, setSelectedType] = useState("req");
    const [notifications, setNotifications] = useState([{
        type: "req",
        name: "Abdul Wahaab",
        time: "6:20 PM",
    }, {
        type: "req",
        name: "Fahad Mahmood",
        time: "6:20 PM",
    }, {
        type: "other",
        name: "Saad Sohail",
        time: "6:20 PM",
    }]);

	return (
		<div className={`absolute top-0 left-1/7 z-20 h-full bg-[#3f5ab5] transition-all duration-500 flex items-center justify-center
                ${notificationsExpand ? 'w-1/6 pointer-events-auto' : 'w-0'}`}>
					<div className={`h-full transition-all duration-500 ${ notificationsExpand ? 'min-w-full max-w-full' : 'min-w-0 max-w-0'} 
                    ${notificationsExpand ? 'opacity-100' : 'opacity-0'} relative overflow-hidden flex flex-col items-center p-[1vw]`}>
						<div className='relative w-full select-none'>
                            <p className='font-bold text-[1.5vw] w-full text-center'>Notifications</p>
                            {/* Toggle Buttons */}
                            <div className={`flex gap-[0.5vw] w-full my-[3vh] select-none rounded-sm p-[0.2vw] bg-[#3f51b5] shadow-lg`}>
                                <div onClick={() => setSelectedType('req')}
                                    className={`${selectedType === 'req' ? `bg-[#4e5fbb]` : 'bg-transparent'}
                                    flex-1 text-center py-[0.5vw] rounded-sm cursor-pointer font-bold`}>Requests
                                </div>
                                <div onClick={() => setSelectedType('other')}
                                    className={`${selectedType === 'other' ? `bg-[#4e5fbb]` : 'bg-transparent'}
                                    flex-1 text-center py-[0.5vw] rounded-sm cursor-pointer font-bold`}>Others
                                </div>
                            </div>
                            <div className='flex flex-col gap-[1vh]'>
                                {notifications.map((notification, index) => (
                                    <><>{notification.type == "req" && selectedType == "req" && <div key={index}
                                    className='bg-[#4e5fbb] p-[0.6vw] transition duration-300 hover:shadow-lg rounded-sm'>
                                        <div className='flex gap-[0.5vw]'>
                                            <img src={profilePic} className='relative w-[2vw] h-[2vw] rounded-full shadow-lg' />
                                            <div className='flex flex-col'>
                                                <div className='flex gap-[0.3vw]'>
                                                    <p className='font-bold'>{notification.name}</p>
                                                    <p>sent you a request</p>
                                                </div>
                                                <p className='opacity-50'>{notification.time}</p>
                                            </div>
                                        </div>
                                        <div className='flex gap-[0.2vw] mt-[0.5vw]'>
                                            <div className='bg-[#3f51b5] py-[0.5vw] px-[1vw] rounded-sm cursor-pointer'>Accept</div>
                                            <div className='bg-[#3f51b5] py-[0.5vw] px-[1vw] rounded-sm cursor-pointer'>Decline</div>
                                        </div>
                                    </div>}</>
                                    <>{notification.type == "other" && selectedType == "other" && <div key={index}
                                    className='bg-[#4e5fbb] p-[0.6vw] transition duration-300 hover:shadow-lg rounded-sm'>
                                        <div className='flex gap-[0.5vw]'>
                                            <img src={profilePic} className='relative w-[2vw] h-[2vw] rounded-full shadow-lg' />
                                            <div className='flex flex-col'>
                                                <div className='flex gap-[0.3vw]'>
                                                    <p className='font-bold'>{notification.name}</p>
                                                    <p>kicked you</p>
                                                </div>
                                                <p className='opacity-50'>{notification.time}</p>
                                            </div>
                                        </div>
                                    </div>}</></>
                                ))}
                            </div>
						</div>
					</div>
				</div>
	);
};

export default Notifications;