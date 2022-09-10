import Avatar from "../Avatar";
import {useEffect, useRef} from "react";
import {LogoutIcon} from "@heroicons/react/outline";
import {resetUser, selectUser} from "../../slices/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {PAGE_PROFILE} from "../../../config";
import {useNavigate} from "react-router-dom";

function Menu ({openMenu, setOpenMenu, refBtnMenu}) {

    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const navigate = useNavigate();

    const refMenu = useRef(undefined);

    useEffect(() => {
        const clickOutSide = e => {
            if(refMenu.current !== null && !refMenu.current.contains(e.target) && !refBtnMenu.current.contains(e.target)) setOpenMenu(false);
        }
        if(openMenu) window.addEventListener('click', clickOutSide);
        return () => {
            window.removeEventListener('click', clickOutSide);
        }
    }, [openMenu])

    return (
        <div ref={refMenu} className={`
                            flex
                            flex-col
                            bg-white 
                            absolute
                            translate-y-[65px]
                            -translate-x-1/2
                            lg:-translate-x-0
                            min-w-fit
                            ${openMenu ? 'inline-flex' : 'hidden'}
                            divide-y
                            text-sm
         `}>
            <div className={"arrow_top_right lg:arrow_top_center w-3 h-3 absolute top-0 left-full -translate-y-[calc(100%_-_2px)] -translate-x-full lg:left-1/2 lg:-translate-x-1/2 bg-white dark:bg-gray-800"}></div>
            <div className={`flex items-center space-x-2 transition duration-150 hover:text-gray-400 hover:cursor-pointer p-2`}
                 onClick={() => {
                     setOpenMenu(!openMenu);
                     navigate(`${PAGE_PROFILE}/${user?._id}`)
                 }}
            >
                <div className={"w-14 h-14"}>
                    <Avatar srcImg={user.urlImg}/>
                </div>
                <p className={"whitespace-nowrap"}>{user.firstName} {String(user.lastName).toUpperCase()}</p>
            </div>
            <div className={"flex items-center p-2 justify-between hover:bg-gray-200 hover:cursor-pointer"} onClick={() => {
                setOpenMenu(!openMenu)
                dispatch(resetUser())
            }}>
                <LogoutIcon className={"h-6"}/>
                <p>Log Out</p>
            </div>
        </div>
    );
};

export default Menu;