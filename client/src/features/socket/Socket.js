import {baseURL} from "../../config";
import io from 'socket.io-client';

const Socket = io.connect(baseURL)

export default Socket;
