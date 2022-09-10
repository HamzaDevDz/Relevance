import {
    useAddMessageMutation,
    useDeleteMessageMutation,
    useGetMessagesQuery,
    useGetWindowsQuery
} from "../api/messageApi";
import {useSelector} from "react-redux";
import {selectUser} from "../slices/userSlice";
import Windows from "../components/messages/Windows";
import React, {useEffect, useRef, useState} from "react";
import Avatar from "../components/Avatar";
import {XIcon} from "@heroicons/react/solid";
import Socket from "../socket/Socket";
import {addMessage, deleteMessage} from "../slices/messagesSlice";
import Loading from "../components/Loading";
import {LIMIT_GET_MESSAGES} from "../../config";

function Messages () {

    const user = useSelector(selectUser);

    const [show, setShow] = useState(true);
    const [selectedWindow, setSelectedWindow] = useState(undefined);
    const [limitGetMessages, setLimitGetMessages] = useState(LIMIT_GET_MESSAGES);

    const refInputContent = useRef(undefined);
    const refContainerMessages = useRef(undefined);

    const {data: messages, isFetching: isFetchingMessages} = useGetMessagesQuery({idWindow: selectedWindow?.idWindow, idUser: user?._id, limit: limitGetMessages}, {skip: !selectedWindow || !user});
    const [addMessageDB, resultAddMessageDB] = useAddMessageMutation();
    const [deleteMessageDB, resultDeleteMessageDB] = useDeleteMessageMutation();

    useEffect(() => {
        if(selectedWindow){
            refInputContent.current.focus();
        }
    }, [selectedWindow])

    const submit = (e) => {
        e.preventDefault();
        if(refInputContent.current === undefined || refInputContent.current.value === "") return;
        addMessageDB({idWindow: selectedWindow.idWindow, content: refInputContent.current.value, idUser: user?._id});
    }

    useEffect(() => {
        if(resultAddMessageDB.isSuccess) {
            refInputContent.current.value = "";
            Socket.emit('addMessage', {idWindow: resultAddMessageDB.data.idWindow, idMessage: resultAddMessageDB.data.idMessage});
        }
    }, [resultAddMessageDB])

    useEffect(() => {
        if(resultDeleteMessageDB.isSuccess) {
            Socket.emit('deleteMessage', {idWindow: resultDeleteMessageDB.data.idWindow, idMessage: resultDeleteMessageDB.data.idMessage});
        }
    }, [resultDeleteMessageDB])

    const onScroll = () => {
        if(!refContainerMessages.current || isFetchingMessages) return;
        const { scrollTop, scrollHeight, clientHeight } = refContainerMessages.current;
        if(scrollHeight + scrollTop > clientHeight + 10) return;
        setLimitGetMessages(messages.length + LIMIT_GET_MESSAGES);
    }

    useEffect(() => {
        if(messages?.length < LIMIT_GET_MESSAGES && messages.length > 0) {
            setLimitGetMessages(messages.length + LIMIT_GET_MESSAGES);
        }
    }, [messages])

    return (
        <div className={"flex grow w-full relative overflow-x-hidden md:max-w-4xl md:border-x md:border-gray-300"}>

            <Windows
                show={show} setShow={setShow}
                selectedWindow={selectedWindow} setSelectedWindow={setSelectedWindow}/>

            <div className={`w-full flex flex-col transition duration-500 bg-white ${show ? 'contrast-50' : 'contrast-100'} md:contrast-100`}>
                <div className={`w-full flex items-center p-3 justify-center bg-transparent shadow-lg ${selectedWindow ? 'inline-flex' : 'hidden'}`}>
                    <Avatar srcImg={selectedWindow?.urlImg} size={8}/>
                    <p className={'ml-3'}><span className={'capitalize'}>{selectedWindow?.firstName}</span> <span className={'uppercase'}>{selectedWindow?.lastName}</span></p>
                </div>
                <Loading className={`w-10 h-10 self-center fill-blue-400 text-gray-200 m-3 ${messages && isFetchingMessages ? 'inline-flex' : 'hidden'}`} />
                <div className={`flex flex-col-reverse items-end grow w-full overflow-y-scroll scrollbar-hide`} ref={refContainerMessages} onScroll={onScroll}>
                    {
                        selectedWindow ?
                            !messages && isFetchingMessages ?
                                <>
                                    <div className={'animate-pulse flex items-center p-3 w-11/12'}>
                                        <div className={'h-10 w-10 rounded-full bg-slate-200 mr-3'}></div>
                                        <div className={'h-2 flex-1 rounded bg-slate-200'}></div>
                                    </div>
                                    <div className={'animate-pulse flex flex-row-reverse items-center self-end p-3 w-11/12'}>
                                        <div className={'h-10 w-10 rounded-full bg-slate-200 ml-3'}></div>
                                        <div className={'h-2 flex-1 rounded bg-slate-200'}></div>
                                    </div>
                                    <div className={'animate-pulse flex items-center p-3 w-11/12'}>
                                        <div className={'h-10 w-10 rounded-full bg-slate-200 mr-3'}></div>
                                        <div className={'h-2 flex-1 rounded bg-slate-200'}></div>
                                    </div>
                                    <div className={'animate-pulse flex flex-row-reverse items-center self-end p-3 w-11/12'}>
                                        <div className={'h-10 w-10 rounded-full bg-slate-200 ml-3'}></div>
                                        <div className={'h-2 flex-1 rounded bg-slate-200'}></div>
                                    </div>
                                </>
                                :
                                messages?.length === 0 ?
                                    <p className={'italic p-2 bg-red-100 mb-10 self-center rounded text-sm'}>We have to start somewhere, right ^_^ ?</p>
                                    :
                                    messages?.map((message, index) => (
                                        <div key={message._id} className={`flex items-center text-sm m-2 ${message.idUser === user?._id ? 'flex-row-reverse self-end' : 'self-start'}`}>
                                            <Avatar srcImg={message.urlImgUser} size={6}/>
                                            <p className={`mx-2 p-2 rounded-lg relative ${message.idUser === user?._id ? 'bg-blue-200' : 'bg-gray-200'}`}>
                                                {message.content}
                                                <XIcon onClick={() => deleteMessageDB({idWindow: message.idWindow, idMessage: message._id})} className={`absolute top-0 right-0 -translate-y-full transition-all duration-250 h-3 text-gray-400 hover:cursor-pointer hover:h-4 hover:text-gray-600 ${message.idUser === user?._id ? 'inline-flex' : 'hidden'}`} />
                                            </p>
                                        </div>
                                    ))

                            :
                            ''
                    }
                </div>
                <form className={"flex items-center w-full bg-gray-200 border-t border-gray-300"}>
                    <input ref={refInputContent} disabled={!selectedWindow} type={"text"} placeholder={'Write your message'} className={"flex-grow bg-transparent text-sm focus:outline-none p-3 placeholder:italic placeholder:text-slate-400 placeholder:text-sm"} />
                    <button type={"submit"} onClick={submit} disabled={resultAddMessageDB.isLoading} hidden>Submit</button>
                </form>
            </div>

        </div>
    )
}

export default Messages;