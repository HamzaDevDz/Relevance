import {useEffect, useRef} from "react";
import {useDetectOutsideClick} from "../utils/useDetectOutsideClick";

function Notifications ({closeNotifications, setCloseNotifications}) {

    const refNotification = useRef(undefined);
    const [isActiveNotification, setIsActiveNotification] = useDetectOutsideClick(refNotification,false);

    useEffect(() => {
        if(closeNotifications) {
            setIsActiveNotification(!isActiveNotification);
            setCloseNotifications(!closeNotifications);
        }
    }, [closeNotifications])

    return (
        <div ref={refNotification} className={`
                            flex
                            flex-col
                            bg-white 
                            absolute
                            translate-y-[60px]
                            -translate-x-1/2
                            lg:-translate-x-0
                            ${isActiveNotification ? 'visible opacity-100' : 'invisible opacity-0'}
                            divide-y
                            text-sm
                            dark:bg-gray-800   
                            dark:text-gray-200                                            
         `}>
            <div className={"arrow_top_right lg:arrow_top_center w-3 h-3 absolute top-0 left-full -translate-y-[calc(100%_-_2px)] -translate-x-full lg:left-1/2 lg:-translate-x-1/2 bg-white dark:bg-gray-800"}></div>
            <div>
                first notification
            </div>
        </div>
    );
};

export default Notifications;