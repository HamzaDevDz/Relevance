import Avatar from "../Avatar";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/solid";
import {useEffect, useRef} from "react";
import Socket from "../../socket/Socket";
import {useSelector} from "react-redux";
import {selectUser} from "../../slices/userSlice";
import {useGetWindowsQuery, useSetLastSeenIdMessageMutation} from "../../api/messageApi";

function Windows({show, setShow, selectedWindow, setSelectedWindow}) {

    const user = useSelector(selectUser);

    const refWindows = useRef(null);

    const {refetch: refetchWindows, currentData: windows, isFetching: isFetchingWindows, isError: isErrorWindows, error: errorWindows} = useGetWindowsQuery({idUser: user?._id}, {skip: !user});
    const [setLastSeenIdMessage] = useSetLastSeenIdMessageMutation();

    useEffect(() => {
        const clickOutSide = e => {if(refWindows.current !== null && !refWindows.current.contains(e.target) && selectedWindow) setShow(!show);}
        if(show) window.addEventListener('click', clickOutSide);
        return () => {window.removeEventListener('click', clickOutSide);}
    }, [show])

    useEffect(() => {
        const handleSocketRefetchWindows = ({idWindow}) => {
            if(windows.findIndex(w => w.idWindow === idWindow) !== -1){
                if(selectedWindow?.idWindow !== idWindow ){
                    refetchWindows();
                }else if(selectedWindow){
                    setLastSeenIdMessage({idWindow: selectedWindow.idWindow, idUser: user?._id});
                }
            }
        }
        Socket.on('checkLastSeenIdMessages', handleSocketRefetchWindows);
        return () => {
            Socket.off('checkLastSeenIdMessages', handleSocketRefetchWindows);
        }
    }, [windows, selectedWindow, user])

    return (
        <div ref={refWindows} className={`z-10 bg-white flex flex-col w-[calc(100%_-_30px)] min-h-full absolute top-0 left-0 divide-y transition-transform duration-250 ${show ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:w-96 md:border-r`}>
            <div className={'flex items-center justify-center bg-blue-200 rounded-r hover:cursor-pointer hover:bg-blue-300 absolute right-0 top-1/2 -translate-y-1/2 translate-x-full md:hidden'}
                 onClick={() => {
                     if(selectedWindow) setShow(!show)
                 }}>
                {show ? <ChevronLeftIcon className={'h-32 w-4 text-blue-800 pointer-events-none'} /> : <ChevronRightIcon className={'h-32 w-4 text-blue-800 pointer-events-none'} />}
            </div>
            {
                isErrorWindows ?
                    <p className={'italic p-3 w-full w-full text-center'}>{errorWindows?.data?.message}</p>
                    :
                    !windows && isFetchingWindows ?
                        <>
                            <div className={'animate-pulse flex items-center w-full p-3'}>
                                <div className={'rounded-full h-10 w-10 bg-slate-200 mr-3'}></div>
                                <div className={'flex-1 rounded h-2 bg-slate-200'}></div>
                            </div>
                            <div className={'animate-pulse flex items-center w-full p-3'}>
                                <div className={'rounded-full h-10 w-10 bg-slate-200 mr-3'}></div>
                                <div className={'flex-1 rounded h-2 bg-slate-200'}></div>
                            </div>
                            <div className={'animate-pulse flex items-center w-full p-3'}>
                                <div className={'rounded-full h-10 w-10 bg-slate-200 mr-3'}></div>
                                <div className={'flex-1 rounded h-2 bg-slate-200'}></div>
                            </div>
                            <div className={'animate-pulse flex items-center w-full p-3'}>
                                <div className={'rounded-full h-10 w-10 bg-slate-200 mr-3'}></div>
                                <div className={'flex-1 rounded h-2 bg-slate-200'}></div>
                            </div>
                        </>
                        :
                        windows?.map(window => (
                            <div key={window.idWindow} className={`flex items-center w-full p-3 text-sm hover:bg-gray-200 relative hover:cursor-pointer ${selectedWindow?.idWindow === window?.idWindow ? 'bg-blue-200 pointer-events-none font-bold' : ''} ${window?.seenLastMessage ? '' : 'bg-red-200 hover:bg-red-300'}`}
                                 onClick={() => {
                                     Socket.emit('joinRoom', {idWindow: window.idWindow, idFriend: window._id});
                                     setSelectedWindow(window);
                                     setShow(!show);
                                 }
                             }>
                                <Avatar srcImg={window.urlImg} size={10} />
                                <p className={'ml-3'}><span className={'capitalize'}>{window.firstName}</span> <span className={'uppercase'}>{window?.lastName}</span></p>
                                <div className={`p-1 rounded-full bg-red-400 absolute right-3 ${window?.seenLastMessage ? 'hidden' : 'inline-flex'}`}></div>
                            </div>
                        ))
            }
        </div>
    )
}

export default Windows;