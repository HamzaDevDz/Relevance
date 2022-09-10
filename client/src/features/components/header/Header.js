import {ChatAltIcon, HomeIcon} from "@heroicons/react/solid";
import {useEffect, useRef, useState} from "react";
import Avatar from "../Avatar";
import {Link, useNavigate, useLocation} from "react-router-dom";
import {PAGE_HOME, PAGE_LOGIN, PAGE_MESSAGES} from "../../../config";
import Menu from "./Menu";
import {useDispatch, useSelector} from "react-redux";
import {selectUser, setUser} from "../../slices/userSlice";
import Search from "./Search";
import {useGetWindowsQuery} from "../../api/messageApi";
import Socket from "../../socket/Socket";

function Header () {

    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const [openMenu, setOpenMenu] = useState(false);
    const [numberMissedDiscussions, setNumberMissedDiscussions] = useState(0);
    const refBtnMenu = useRef(undefined)

    const {refetch: refetchWindows, currentData: windows} = useGetWindowsQuery({idUser: user?._id}, {skip: !user});

    useEffect(() => {
        if(sessionStorage.getItem('user')){
            dispatch(setUser(JSON.parse(sessionStorage.getItem('user'))));
        }
    }, [])

    useEffect(() => {
        if(user) navigate(PAGE_HOME);
        else navigate(PAGE_LOGIN);
    }, [user])

    useEffect(() => {
        let nbrMissedDiscussions = 0;
        windows?.forEach(w => {
            if(!w.seenLastMessage) nbrMissedDiscussions++;
        })
        setNumberMissedDiscussions(nbrMissedDiscussions)
        const handleSocketRefetchWindows = ({idWindow}) => {
            if(windows.findIndex(w => w.idWindow === idWindow) !== -1){
                refetchWindows();
            }
        }
        if(location.pathname !== PAGE_MESSAGES) Socket.on('checkLastSeenIdMessages', handleSocketRefetchWindows);
        return () => {
            Socket.off('checkLastSeenIdMessages', handleSocketRefetchWindows);
        }
    }, [location.pathname, windows])

    return (
        <header className={"sticky top-0 w-full h-[60px] flex items-center justify-center p-2 bg-white shadow-md space-x-3 dark:bg-gray-800 z-20"}>
            <Link to={user ? PAGE_HOME : PAGE_LOGIN} className={"flex items-center space-x-1 text-gray-800 hover:cursor-pointer p-2 hover:text-gray-400 rounded"}>
                <HomeIcon className={"h-6"} />
                <p className={`${user ? 'hidden md:inline-flex' : 'inline-flex'} italic font-bold`}>
                    Relevance
                </p>
            </Link>
            {
                user ?
                    <>
                        <Search />
                        <div className={"flex items-center space-x-3 relative "}>
                            <Link to={PAGE_MESSAGES} className={"w-10 h-10 flex justify-center items-center relative rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600 hover:cursor-pointer"}>
                                <span className={`flex justify-center items-center absolute w-4 h-4 top-0 right-1 bg-red-400 rounded-full aspect-square ${numberMissedDiscussions > 0 ? 'inline-flex' : 'hidden'}`}>
                                    {numberMissedDiscussions}
                                </span>
                                <ChatAltIcon className={"h-6 text-blue-800"} />
                            </Link>
                            <div className={"relative flex justify-center"}>
                                <div ref={refBtnMenu} className={"w-10 h-10 flex justify-center items-center hover:cursor-pointer rounded p-1 hover:bg-gray-200 dark:hover:bg-gray-600"}
                                     onClick={() => setOpenMenu(!openMenu)}>
                                    <Avatar srcImg={user.urlImg}/>
                                </div>
                                <Menu openMenu={openMenu} setOpenMenu={setOpenMenu} refBtnMenu={refBtnMenu}/>
                            </div>
                        </div>
                    </>
                    :
                    ""
            }

        </header>
    );
};

export default Header;