import {useEffect} from "react";

function InputAuthentication ({refInput, placeholder, error, setError, type="text"}) {

    let idSetTimeOut = null;

    useEffect(() => {
        if(error){
            if(idSetTimeOut) clearTimeout(idSetTimeOut);
            idSetTimeOut = setTimeout(() => setError(false), 5000);
        }
    }, [error, setError])

    return (
        <div className={`flex flex-col w-full relative bg-gray-200 rounded border ${error ? 'border-red-400' : 'border-transparent'}`}>
            <input ref={refInput} type={type} placeholder={placeholder} className={"flex-grow outline-none text-center bg-transparent p-3"} />
            { error ? <p className={"text-sm text-red-400 italic absolute left-1 bottom-1 "}>{error}</p> : "" }
        </div>
    );
};

export default InputAuthentication;