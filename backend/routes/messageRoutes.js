const express = require("express");
const { GetAllMessages, createMessage, deleteMessage } = require("../controllers/messagecontroller.js");
const router = express.Router();

router.get("/getAllMessages", GetAllMessages);
router.post("/createMessage", createMessage);
router.delete("/:id", deleteMessage);

module.exports = router;
