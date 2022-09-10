import InputAuthentication from "../components/InputAuthentication";
import {useEffect, useRef, useState} from "react";
import {PAGE_SIGNUP} from "../../config";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import {useLogInMutation} from "../api/userApi";
import {useDispatch} from "react-redux";
import {setUser} from "../slices/userSlice";
import {ExclamationCircleIcon} from "@heroicons/react/outline";

function Login () {

    const dispatch = useDispatch();

    const refInputUsername = useRef(undefined);
    const refInputPassword = useRef(undefined);

    let idSetTimeOut = null;
    const [error, setError] = useState("");
    const [errorUsername, setErrorUsername] = useState("");
    const [errorPassword, setErrorPassword] = useState("");

    const [login, resultLogin] = useLogInMutation()

    const fullInputs = () => {
        let response = true;
        if(refInputUsername.current === undefined || refInputUsername.current.value === ""){
            setErrorUsername("Please, fill-in your Username");
            response = false;
        }
        if(refInputPassword.current === undefined || refInputPassword.current.value === ""){
            setErrorPassword("Please, fill-in your Password");
            response = false;
        }
        return response;
    }

    const submit = e => {
        e.preventDefault();
        if(!fullInputs()) return;
        login({username: refInputUsername.current.value, password: refInputPassword.current.value});
    }

    useEffect(() => {
        if(resultLogin.isError){
            if(!idSetTimeOut) clearTimeout(idSetTimeOut);
            setError(resultLogin.error.data.messages)
            idSetTimeOut = setTimeout(() => setError(""), 5000);
            setError(resultLogin.error.data.messages);
            if(resultLogin.error.data.fields === "username") setErrorUsername("Invalid Username");
            else setErrorPassword("Incorrect Password");
        }
    }, [resultLogin.isError]);

    useEffect(() => {
        if(resultLogin.isSuccess) dispatch(setUser(resultLogin.data));
    }, [resultLogin.isSuccess]);


    return (
        <form className={`flex w-full flex-col items-center space-y-16 bg-white p-6 rounded absolute top-[calc(50%+30px)] -translate-y-1/2 shadow-lg shadow-gray-400 mx-2 md:mx-0 md:max-w-3xl`}>
            <h1 className={"text-3xl font-semibold"}>Log in</h1>
            <div className={"space-y-8 w-full"}>
                <InputAuthentication refInput={refInputUsername} placeholder={"Username"} error={errorUsername} setError={setErrorUsername}/>
                <InputAuthentication refInput={refInputPassword} placeholder={"Password"} error={errorPassword} setError={setErrorPassword} type={"password"}/>
            </div>
            <div className={"w-full flex items-center justify-center relative"}>
                {
                    error ?
                        <div className={"absolute top-0 -translate-y-[110%] p-2 rounded bg-red-100 flex items-center space-x-3 text-sm"}>
                            <ExclamationCircleIcon className={"w-7 h-7"} />
                            <p>{error}</p>
                        </div>
                        :
                        ""
                }
                <button type={"submit"} onClick={submit} className={"btn_authentication"} disabled={resultLogin.isLoading}>
                    { resultLogin.isLoading ? <Loading className={"w-6 h-6 fill-blue-400 text-gray-200"} /> : "" }
                    <span>Log in</span>
                </button>
            </div>
            <Link to={PAGE_SIGNUP} className={"absolute bottom-2 right-2 text-sm italic text-blue-400 hover:cursor-pointer hover:text-blue-500 md:absolute md:bottom-2 md:right-2"}>Sign up</Link>
        </form>
    );
};

export default Login;