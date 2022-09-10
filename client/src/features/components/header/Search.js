import {useRef, useState} from "react";
import {SearchIcon, XIcon} from "@heroicons/react/outline";
import {useSearchFriendsMutation} from "../../api/searchApi";
import {selectUser} from "../../slices/userSlice";
import {useSelector} from "react-redux";
import Result from "./Result";

function Search(){

    const user = useSelector(selectUser)

    const refSearchForm = useRef(undefined);
    const [openResult, setOpenResult] = useState(false);

    const refSearchInput = useRef(undefined);
    let idTimeIntervalSearch = null;

    const [searchFriends, resultSearchFriends] = useSearchFriendsMutation()

    const handleSearch = e => {
        e.preventDefault();
        if(refSearchInput.current === undefined
            || refSearchInput.current === null
            || refSearchInput.current.value.length < 3) return;
        if(idTimeIntervalSearch) clearTimeout(idTimeIntervalSearch);
        idTimeIntervalSearch = setTimeout(() => searchFriends({idUser: user?._id, name: refSearchInput.current.value}),1000);
    }

    return (
        <form ref={refSearchForm} className={`relative flex grow max-w-xl items-center bg-gray-200 rounded-full p-2`}>
            <SearchIcon className={"h-5 text-gray-500 hidden sm:inline-flex"} />
            <button className={'hidden'} onClick={handleSearch}>Search</button>
            <input className={"ml-3 w-full bg-transparent focus:outline-none placeholder:italic placeholder:text-gray-400 placeholder:text-sm "}
                   placeholder={"Send a Message to a Friend..."}
                   ref={refSearchInput}
                   onChange={handleSearch}
                   onFocus={() => setOpenResult(true)}
            />
            <XIcon className={"h-5 ml-3 text-gray-500 cursor-pointer transition duration-100 transform hover:scale-125"}
                   onClick={() => refSearchInput.current.value = ""}/>
            <Result resultSearchFriends={resultSearchFriends} openResult={openResult} setOpenResult={setOpenResult} refSearchForm={refSearchForm} />
        </form>
    )

}

export default Search;