import {useEffect, useRef, useState} from "react";
import InputAuthentication from "../components/InputAuthentication";
import Loading from "../components/Loading";
import {Link} from "react-router-dom";
import {PAGE_LOGIN} from "../../config";
import {useSignUpMutation} from "../api/userApi";
import {setUser} from "../slices/userSlice";
import {useDispatch} from "react-redux";
import {ExclamationCircleIcon} from "@heroicons/react/outline";
import {PhotographIcon} from "@heroicons/react/solid";

function Signup () {

    const dispatch = useDispatch();

    const refInputFirstName = useRef(undefined);
    const refInputLastName = useRef(undefined);
    const refInputUsername = useRef(undefined);
    const refInputPassword = useRef(undefined);
    const refInputConfirmPassword = useRef(undefined);
    const [image, setImage] = useState(undefined)

    let idSetTimeOut = null;
    const [error, setError] = useState("");
    const [errorFirstName, setErrorFirstName] = useState("");
    const [errorLastName, setErrorLastName] = useState("");
    const [errorUsername, setErrorUsername] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorConfirmPassword, setErrorConfirmPassword] = useState("");

    let idSetTimeOutImageError = null;
    const [errorImage, setErrorImage] = useState("");

    const [signup, resultSignup] = useSignUpMutation();

    const fullInputs = () => {
        let response = true;
        if(refInputLastName.current === undefined || refInputLastName.current.value === "") {
            setErrorFirstName("Please, fill-in your First Name");
            response = false;
        }
        if(refInputFirstName.current === undefined || refInputFirstName.current.value === "") {
            setErrorLastName("Please, fill-in your Last Name");
            response = false;
        }
        if(refInputUsername.current === undefined || refInputUsername.current.value === "") {
            setErrorUsername("Please, fill-in your Username");
            response = false;
        }
        if(refInputPassword.current === undefined || refInputPassword.current.value === "") {
            setErrorPassword("Please, fill-in your Password");
            response = false;
        }
        if(refInputConfirmPassword.current === undefined || refInputConfirmPassword.current.value === "") {
            setErrorConfirmPassword("Please, Confirm your Password");
            response = false;
        }
        if(!image) {
            setErrorImage("Please, select an image")
            response = false;
        }
        return response;
    }

    useEffect(() => {
        if(errorImage){
            if(idSetTimeOutImageError) clearTimeout(idSetTimeOutImageError);
            idSetTimeOutImageError = setTimeout(() => setErrorImage(""), 5000);
        }
    }, [errorImage])

    const checkPassword = () => {
        if(refInputPassword.current.value === refInputConfirmPassword.current.value) return true;
        setErrorConfirmPassword("Please, confirm your Password");
        return false;
    }

    const submit = e => {
        e.preventDefault();
        if(!fullInputs()) return;
        if(!checkPassword()) return;
        let formData = new FormData();
        formData.append("firstName", refInputFirstName.current.value);
        formData.append("lastName", refInputLastName.current.value);
        formData.append("username", refInputUsername.current.value);
        formData.append("password", refInputPassword.current.value);
        formData.append("file", image);
        signup(formData);
    }

    useEffect(() => {
        if(resultSignup.isError){
            if(!idSetTimeOut) clearTimeout(idSetTimeOut);
            setError(resultSignup.error.data?.messages)
            idSetTimeOut = setTimeout(() => setError(""), 5000);
            if(Array.isArray(resultSignup.error.data.fields)){
                if(resultSignup.error.data?.fields.includes("username")) setErrorUsername("Invalid Username");
                if(resultSignup.error.data?.fields.includes("password")) setErrorPassword("Invalid Password");
            }else{
                if(resultSignup.error.data?.fields === "username") setErrorUsername("Invalid Username");
                else setErrorPassword("Incorrect Password");
            }
        }
    }, [resultSignup.isError]);

    useEffect(() => {
        if(resultSignup.isSuccess) dispatch(setUser(resultSignup.data));
    }, [resultSignup.isSuccess])

    return (
        <form className={`flex flex-col items-center space-y-16 bg-white p-6 rounded absolute top-[calc(50%+30px)] -translate-y-1/2 shadow-lg shadow-gray-400 w-full mx-2 md:mx-0 md:max-w-3xl`}>
            <h1 className={"text-3xl font-semibold"}>Sign up</h1>
            <div className={"flex flex-col items-center space-y-4 w-full"}>
                <div className={"space-y-2 w-full"}>
                    <InputAuthentication refInput={refInputFirstName} placeholder={"First Name"} error={errorFirstName} setError={setErrorFirstName}/>
                    <InputAuthentication refInput={refInputLastName} placeholder={"Last Name"} error={errorLastName} setError={setErrorLastName}/>
                </div>
                <div className={"space-y-2 w-full"}>
                    <InputAuthentication refInput={refInputUsername} placeholder={"Username"} error={errorUsername} setError={setErrorUsername}/>
                    <InputAuthentication refInput={refInputPassword} placeholder={"Password"} error={errorPassword} setError={setErrorPassword} type={"password"}/>
                    <InputAuthentication refInput={refInputConfirmPassword} placeholder={"Confirm Password"} error={errorConfirmPassword} setError={setErrorConfirmPassword} type={"password"}/>
                </div>
                <div className={"flex flex-col items-center relative justify-center"}>
                    <label className={`flex items-center p-3 space-x-3 rounded-lg font-bold hover:cursor-pointer md:rounded-full border ${errorImage ? 'border-red-400 bg-red-300 hover:bg-red-400 ' : 'border-transparent hover:bg-gray-200 '}`}>
                        <input type={"file"} hidden accept="image/*" onChange={e => setImage(e.target.files[0])}/>
                        {
                            image ?
                                <img src={window.URL.createObjectURL(image)} alt={''} className={'h-7 w-7 rounded-full aspect-square'} />
                                :
                                <PhotographIcon className={"h-7 text-blue-600"} />
                        }
                        <p className={"hidden md:inline-flex text-gray-600 "}>Your Picture</p>
                    </label>
                    {
                        errorImage ?
                            <p className={"absolute bottom-0 translate-y-[110%] text-sm text-red-400 italic whitespace-nowrap font-normal"}>{errorImage}</p>
                            :
                            ""
                    }
                </div>

            </div>
            <div className={"flex flex-col items-center justify-center w-full relative"}>
                {
                    error ?
                        <div className={"absolute top-0 -translate-y-[110%] p-2 rounded bg-red-100 flex items-center space-x-3 text-sm"}>
                            <ExclamationCircleIcon className={"w-7 h-7"} />
                            <p>{error}</p>
                        </div>
                        :
                        ""
                }
                <button type={"submit"} onClick={submit} className={"btn_authentication"} disabled={resultSignup.isLoading}>
                    { resultSignup.isLoading ? <Loading className={"w-6 h-6 fill-blue-400 text-gray-200"} /> : "" }
                    <span>Sign up</span>
                </button>
            </div>
            <Link to={PAGE_LOGIN} className={"absolute bottom-2 right-2 text-sm italic text-blue-400 hover:cursor-pointer hover:text-blue-500 md:absolute md:bottom-2 md:right-2"}>Log in</Link>
        </form>
    );
};

export default Signup;