import Loading from "../Loading";
import {MinusCircleIcon} from "@heroicons/react/solid";
import Avatar from "../Avatar";
import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import {PAGE_MESSAGES} from "../../../config";
import {useOpenWindowMutation} from "../../api/messageApi";
import {useSelector} from "react-redux";
import {selectUser} from "../../slices/userSlice";

function Result({resultSearchFriends, openResult, setOpenResult, refSearchForm}) {

    let navigate = useNavigate();

    const user = useSelector(selectUser);

    const refResult = useRef(undefined);

    const [openWindow, resultOpenWindow] = useOpenWindowMutation();

    useEffect(() => {
        const clickOutSide = e => {
            if(refResult.current !== null && !refResult.current.contains(e.target) && !refSearchForm.current.contains(e.target)) setOpenResult(false);
        }
        if(openResult) window.addEventListener('click', clickOutSide);
        return () => {
            window.removeEventListener('click', clickOutSide);
        }
    },[openResult]);

    useEffect(() => {
        if(resultOpenWindow.isSuccess){
            setOpenResult(false);
            navigate(PAGE_MESSAGES);
        }
    }, [resultOpenWindow])

    return (
        <div ref={refResult} className={`flex flex-col divide-y bg-white w-11/12 fixed left-1/2 -translate-x-1/2 top-16 shadow-lg md:absolute md:w-full text-sm md:text-base text-gray-600 ${openResult ? 'inline-flex' : 'hidden'}`}>
            {
                resultSearchFriends.isLoading ?
                    <div className={"w-full flex items-center justify-center p-3"}>
                        <Loading className={"w-8 h-8 fill-blue-400 text-gray-200"} />
                    </div>
                    :
                    resultSearchFriends.isError ?
                        <div className={"flex items-center justify-center p-3 w-full"}>
                            <MinusCircleIcon className={'h-6 text-red-800 mr-3 md:h-8'} />
                            <p className={"italic"}>{resultSearchFriends.error?.data?.message}</p>
                        </div>
                        :
                        <>
                            {
                                resultSearchFriends?.data?.map(({_id, firstName, lastName, urlImg}) => (
                                    <div key={_id} className={"w-full p-3 flex items-center justify-between"}>
                                        <div className={"flex items-center"}>
                                            <Avatar srcImg={urlImg} size={10} />
                                            <p className={"mx-3"}><span className={'first-letter:uppercase'}>{firstName}</span> {String(lastName).toUpperCase()}</p>
                                        </div>
                                        <button className={"p-2 bg-blue-600 text-white md:text-gray-200 md:hover:cursor-pointer md:hover:bg-blue-800 md:hover:text-white rounded-lg text-sm transition transition-duration-250"}
                                                onClick={() => openWindow({idUser: user?._id, idFriend: _id})}
                                                type={'button'}
                                        >
                                            Send Message
                                        </button>
                                    </div>
                                ))
                            }
                        </>
            }
        </div>
    )
}

export default Result;