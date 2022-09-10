import {useSelector} from "react-redux";
import {selectUser} from "../slices/userSlice";
import Avatar from "../components/Avatar";
import {useGetMyPostsQuery} from "../api/postApi";
import Post from "../components/post/Post";
import {useRef, useState} from "react";
import {LIMIT_GET_POSTS} from "../../config";

function Profile () {

    const user = useSelector(selectUser);
    const refProfile = useRef(undefined);

    const [limitGetMyPosts, setLimitGetMyPosts] = useState(LIMIT_GET_POSTS);

    const {data: myPosts, isFetching: isFetchingMyPosts} = useGetMyPostsQuery({idUser: user?._id, limit: limitGetMyPosts}, {skip: !user});

    const onScroll = () => {
        if(!refProfile.current || isFetchingMyPosts) return;
        const { scrollTop, scrollHeight, clientHeight } = refProfile.current;
        if(scrollHeight - scrollTop <= clientHeight) {
            setLimitGetMyPosts(myPosts.length + 2);
        }
    }

    return (
        <div className={`w-full flex flex-col items-center overflow-y-scroll`} onScroll={onScroll} ref={refProfile}>
            <div className={'w-full flex flex-col max-w-3xl items-center'}>
                <div className={`w-full flex flex-col items-center p-3 mb-3 border-b border-gray-600 border-dotted`}>
                    <Avatar srcImg={user?.urlImg} classNamePrime={'border border-4 border-gray-400'} />
                    <div className={'w-full flex flex-col items-center my-3 relative'}>
                        <p className={'px-6 py-3 rounded-lg shadow-lg bg-blue-200 font-bold text-gray-800 text-sm md:text-base'}><span className={'capitalize'}>{user?.firstName}</span> <span className={'uppercase'}>{user?.lastName}</span></p>
                        <p className={'italic text-sm text-gray-600 p-2 shadow-lg rounded mt-2 mb-4 md:m-0 md:absolute md:left-0'}>{user.username}</p>
                        <button className={'text-gray-200 bg-red-500 hover:bg-red-500 p-2 rounded text-sm md:bg-red-400 md:absolute md:right-0'}>Delete my account</button>
                    </div>

                </div>
                <div className={'w-full flex flex-col items-center last:mb-12'}>
                    {
                        !myPosts && isFetchingMyPosts ?
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
                            !myPosts ?
                                <p className={'p-3 rounded-lg bg-red-200 text-sm md:text-base'}>You don't have any post yet !</p>
                                :
                                <>
                                    <p className={'p-3 rounded-lg px-6 py-2 shadow-lg mb-3 text-sm italic'}>All my posts</p>
                                    {
                                        myPosts?.map(post => (
                                            <Post key={post._id}
                                                  idPost={post._id}
                                                  idUser={user?._id}
                                                  srcImgUser={user?.urlImg}
                                                  srcImgPost={post.urlImg}
                                                  lastName={user?.lastName}
                                                  firstName={user?.firstName}
                                                  timestamp={post.timestamp}
                                                  status={post.status}
                                            />
                                        ))
                                    }
                                </>

                    }
                </div>
            </div>

        </div>
    );
};

export default Profile;