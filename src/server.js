import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import init from "./db/init";

//routes
import auth from "./routes/auth";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//db init
init().catch((e) => {
  console.log(e.message);
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/auth', auth);

app.listen(port, () => {
  console.log(`Listening to port: ${port}`);
});