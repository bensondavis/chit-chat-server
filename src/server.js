import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { app, server } from "./socket/socket";

//db init
import init from "./db/init";

//routes
import auth from "./routes/auth";
import chat from "./routes/chat";
import contacts from "./routes/contacts";

//middleware
import AuthenticateToken from "./middleware/auth";

dotenv.config();
const port = process.env.PORT || 5000;

//db init
init().catch((e) => {
  console.log(e.message);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auth', auth);
app.use('/api/chat', AuthenticateToken, chat);
app.use('/api/contacts', AuthenticateToken, contacts)

server.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});