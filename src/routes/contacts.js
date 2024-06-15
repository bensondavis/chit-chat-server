import express from "express";
import { addContacts, getContacts } from "../controller/contacts";
const router = express.Router();

router.get("/", getContacts);

router.post("/:id", addContacts)

export default router;