import express from 'express';
import connectMongoose from './utils/connectMongo.js';
import {} from 'dotenv/config';
import cors from 'cors';
import http from 'http';
import {Server} from "socket.io";
import bodyParser from "body-parser";
import posts from "./routes/posts.js"
import users from './routes/users.js';
import comments from './routes/comments.js';
import messages from './routes/messages.js'
import uploadMedia from './routes/uploadMedias.js';
import errorController from './controllers/errorController.js'
import SocketPost from "./sockets/socketPost.js";
import SocketComment from "./sockets/socketComment.js";
import SocketMessage from "./sockets/socketMessage.js";

const app = express();
const port = process.env.PORT || process.env.EXPRESS_PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

connectMongoose();

app.get('/', (req, res) => res.status(200).send("Hello Baghdad, I'm Relevance!"));

app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/comments", comments);
app.use("/api/messages", messages);
app.use("/api/medias", uploadMedia);

app.use(errorController);

const server = http.createServer(app);

server.listen(port, () => console.log('Listening on localhost : ' + port));

const io = new Server(server, {
    cors: {
        origin: '*',
        METHOD: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    SocketPost(io, socket);
    SocketComment(io, socket);
    SocketMessage(io, socket);
})
