import {UserIcon} from "@heroicons/react/solid";
import React, {useEffect, useState} from "react";
import {baseQueryFileURL} from "../../config";

function Avatar ({srcImg, size, classNamePrime}) {

    const [loaded, setLoaded] = useState(false);

    return (
        <div className={`w-${size ? size : 'full'} h-${size ? size : 'full'}`}>
            {
                srcImg ?
                    <img src={baseQueryFileURL + srcImg}
                         className={`aspect-square w-full rounded-full ${loaded ? 'inline-flex': 'hidden'} ${classNamePrime ? classNamePrime : ''}`}
                         onLoad={() => setLoaded(true)}
                    />
                    :
                    ""
            }
            <UserIcon className={`aspect-square w-full rounded-full ${!loaded ? 'inline-flex': 'hidden'} ${classNamePrime ? classNamePrime : ''}`} />
        </div>


    );
};

export default Avatar;