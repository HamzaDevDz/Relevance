import {useEffect, useRef, useState} from "react";
import {XIcon, UploadIcon} from "@heroicons/react/solid";
import {useAddPostMutation} from "../api/postApi";
import Avatar from "./Avatar";
import {useSelector} from "react-redux";
import {selectUser} from "../slices/userSlice";
import Loading from "./Loading";
import {ExclamationCircleIcon, CameraIcon as CameraIconOutline} from "@heroicons/react/outline";
import Socket from '../socket/Socket';

function Upload () {

    const user = useSelector(selectUser);

    const refStatus = useRef(undefined);
    const [image, setImage] = useState(undefined);
    const [error, setError] = useState("");

    const [addPost, resultAddPost] = useAddPostMutation();

    let idTimeOutError = null;
    const handleError = (err) => {
        if(idTimeOutError) clearTimeout(idTimeOutError);
        setError(err);
        idTimeOutError = setTimeout(() => setError(""), 3000);
    }
    const check = () => {
        return !((refStatus.current === undefined || refStatus.current.value === "") && !image);
    }

    const submit = e => {
        e.preventDefault();
        if(!check()) return;
        let formData = new FormData();
        formData.append('idUser', user._id);
        formData.append('timestamp', String(Date.now()));
        formData.append('status', refStatus.current.value);
        if(image) formData.append('file', image);
        addPost(formData);
    }

    useEffect(() => {
        if(resultAddPost.isSuccess) {
            Socket.emit('addPost', resultAddPost.data)
            refStatus.current.value = "";
            setImage(undefined);
        }
    }, [resultAddPost.isSuccess])

    useEffect(() => {
        if(resultAddPost.isError){
            handleError(resultAddPost.error.data);
        }
    }, [resultAddPost.isError])

    return (
        <form className={"w-full flex items-center flex-col box-border bg-white border border-gray-300 p-3 text-sm md:text-base relative shadow-lg my-3"}>
            <div className={'flex items-center w-full space-x-2'}>
                <Avatar srcImg={user?.urlImg} size={10} />
                <textarea  placeholder={"Whats'up"} ref={refStatus} className={"placeholder:italic placeholder:text-slate-400 flex flex-grow py-2 px-5 bg-gray-100 h-24 md:h-14 focus:outline-none rounded-lg focus:ring-gray-400 focus:ring-1 focus:bg-gray-200 scrollbar-hide resize-none"}/>
            </div>
            <div className={"flex items-center w-full items-center justify-evenly mt-3 text-sm"}>
                <button onClick={submit} className={"flex items-center space-x-1 text-sm p-2 font-bold hover:cursor-pointer hover:bg-gray-200 rounded-full md:rounded-lg"}>
                    <UploadIcon className={"h-6 w-6 text-blue-800"} />
                    <span className={"text-gray-600 hidden md:inline-flex"}>Publish</span>
                </button>
                {
                    image ?
                        <div onClick={() => setImage(undefined)}
                             className={'flex items-center p-2 space-x-1 rounded-lg font-bold hover:cursor-pointer hover:bg-gray-200 md:rounded-full'}>
                            <XIcon className={"h-6 text-red-800"} />
                            <p className={'text-gray-600 text-sm hidden md:inline-flex'}>Cancel Selection</p>
                        </div>
                        :
                        <label className={"flex items-center p-2 space-x-1 rounded-full font-bold hover:cursor-pointer hover:bg-gray-200 md:rounded-lg"}>
                            <input type={"file"} hidden onChange={e => setImage(e.target.files[0])} accept="image/*" />
                            <CameraIconOutline className={"h-6 text-red-600"} />
                            <p className={"text-gray-600 hidden md:inline-flex"}>Photo</p>
                        </label>
                }
            </div>

            {
                resultAddPost.isLoading ?
                    <div className={"absolute top-0 left-0 w-full h-full bg-loading flex items-center justify-center"}>
                        <Loading className={"w-10 h-10 fill-blue-400 text-gray-200"} />
                    </div>
                    :
                    ''
            }
            {
                error ?
                    <div className={"absolute top-0 left-0 w-full h-full bg-loading flex items-center justify-center text-sm"}>
                        <p className={"flex items-center space-x-3 bg-red-100 italic p-3 rounded-lg space-x-3 text-sm md:text-base"}>
                            <ExclamationCircleIcon className={"w-6 h-6"} />
                            <span>
                                {error}
                            </span>
                        </p>
                    </div>
                    :
                    ''
            }
        </form>
    );
};

export default Upload;