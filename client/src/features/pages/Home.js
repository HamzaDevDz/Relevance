import React, {useRef, useState} from "react";
import Post from "../components/post/Post";
import Upload from "../components/Upload";
import {useGetPostsQuery} from "../api/postApi";
import {LIMIT_GET_POSTS} from "../../config";

function Home () {

    const refHome = useRef(undefined);

    const [limitGetPosts, setLimitGetPosts] = useState(LIMIT_GET_POSTS);

    const {data: posts, isFetching: isFetchingPosts, isError: isErrorPosts, error: errorPosts} = useGetPostsQuery({limit: limitGetPosts});

    const onScroll = () => {
        if(!refHome.current || isFetchingPosts) return;
        const { scrollTop, scrollHeight, clientHeight } = refHome.current;
        if(scrollHeight - scrollTop <= clientHeight) {
            setLimitGetPosts(posts.length + LIMIT_GET_POSTS);
        }
    }

    return (
        <div className={"flex items-center flex-col w-full relative overflow-y-scroll"} ref={refHome} onScroll={onScroll}>
            <div className={'flex items-center flex-col w-full relative md:max-w-3xl last:mb-12'}>
                <Upload />
                {
                    isErrorPosts ?
                        <p>{errorPosts.data}</p>
                        :
                        !posts && isFetchingPosts ?
                            <>
                                <div className={'animate-pulse flex flex-col items-center w-full p-3'}>
                                    <div className={'animate-pulse flex items-center w-full p-3'}>
                                        <div className={'rounded-full h-12 w-12 bg-white mr-3'}></div>
                                        <div className={'w-52 rounded h-4 bg-white'}></div>
                                    </div>
                                    <div className={'w-3/4 aspect-square bg-white'}></div>
                                </div>
                                <div className={'animate-pulse flex flex-col items-center w-full p-3'}>
                                    <div className={'animate-pulse flex items-center w-full p-3'}>
                                        <div className={'rounded-full h-12 w-12 bg-white mr-3'}></div>
                                        <div className={'w-52 rounded h-4 bg-white'}></div>
                                    </div>
                                    <div className={'w-3/4 aspect-square bg-white'}></div>
                                </div>
                                <div className={'animate-pulse flex flex-col items-center w-full p-3'}>
                                    <div className={'animate-pulse flex items-center w-full p-3'}>
                                        <div className={'rounded-full h-12 w-12 bg-white mr-3'}></div>
                                        <div className={'w-52 rounded h-4 bg-white'}></div>
                                    </div>
                                    <div className={'w-3/4 aspect-square bg-white'}></div>
                                </div>
                                <div className={'animate-pulse flex flex-col items-center w-full p-3'}>
                                    <div className={'animate-pulse flex items-center w-full p-3'}>
                                        <div className={'rounded-full h-12 w-12 bg-white mr-3'}></div>
                                        <div className={'w-52 rounded h-4 bg-white'}></div>
                                    </div>
                                    <div className={'w-3/4 aspect-square bg-white'}></div>
                                </div>
                            </>
                            :
                            posts?.length === 0 ?
                                <p className={"p-3 rounded-lg italic"}>There are no Posts available !</p>
                                :
                                <>
                                    {
                                        posts?.map(({
                                                        _id,
                                                        idUser,
                                                        timestamp,
                                                        status,
                                                        urlImg,
                                                        urlImgUser,
                                                        firstName,
                                                        lastName
                                                    }, index) => (
                                            <Post
                                                key={_id}
                                                idPost={_id}
                                                idUser={idUser}
                                                srcImgUser={urlImgUser}
                                                firstName={firstName}
                                                lastName={lastName}
                                                timestamp={timestamp}
                                                status={status}
                                                srcImgPost={urlImg}
                                            />))
                                    }
                                    {
                                        isFetchingPosts ?
                                            <>
                                                <div className={'animate-pulse flex flex-col items-center w-full p-3'}>
                                                    <div className={'animate-pulse flex items-center w-full p-3'}>
                                                        <div className={'rounded-full h-12 w-12 bg-white mr-3'}></div>
                                                        <div className={'w-52 rounded h-4 bg-white'}></div>
                                                    </div>
                                                    <div className={'w-3/4 aspect-square bg-white'}></div>
                                                </div>
                                                <div className={'animate-pulse flex flex-col items-center w-full p-3'}>
                                                    <div className={'animate-pulse flex items-center w-full p-3'}>
                                                        <div className={'rounded-full h-12 w-12 bg-white mr-3'}></div>
                                                        <div className={'w-52 rounded h-4 bg-white'}></div>
                                                    </div>
                                                    <div className={'w-3/4 aspect-square bg-white'}></div>
                                                </div>
                                                <div className={'animate-pulse flex flex-col items-center w-full p-3'}>
                                                    <div className={'animate-pulse flex items-center w-full p-3'}>
                                                        <div className={'rounded-full h-12 w-12 bg-white mr-3'}></div>
                                                        <div className={'w-52 rounded h-4 bg-white'}></div>
                                                    </div>
                                                    <div className={'w-3/4 aspect-square bg-white'}></div>
                                                </div>
                                                <div className={'animate-pulse flex flex-col items-center w-full p-3'}>
                                                    <div className={'animate-pulse flex items-center w-full p-3'}>
                                                        <div className={'rounded-full h-12 w-12 bg-white mr-3'}></div>
                                                        <div className={'w-52 rounded h-4 bg-white'}></div>
                                                    </div>
                                                    <div className={'w-3/4 aspect-square bg-white'}></div>
                                                </div>
                                            </>
                                            :
                                            ''
                                    }
                                </>

                }
            </div>
        </div>
    )
}

export default Home;