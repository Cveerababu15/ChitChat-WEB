let messages = [
  { id: 1, text: "hello", user: "VeeraBabu", timestamp: new Date().toString() },
  { id: 2, text: "hi", user: "Rudra", timestamp: new Date().toString() }
];

const GetAllMessages = (req, res) => {
  res.json({ success: true, count: messages.length, data: messages });
};

const createMessage = (req, res) => {
  try {
    const { text, user } = req.body;

    if (!text || !user) {
      return res.status(400).json({ success: false, message: "Please provide text and user" });
    }

    const newMessage = { id: messages.length + 1, text, user, timestamp: new Date().toString() };
    messages.push(newMessage);

    res.status(201).json({ success: true, message: "Message created successfully", data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMessage = (req, res) => {
  try {
    const { id } = req.params;
    const message = messages.find(m => m.id === parseInt(id));

    if (!message) return res.status(404).json({ success: false, message: `No message found with ID ${id}` });

    messages = messages.filter(m => m.id !== parseInt(id));
    res.json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Socket Add Message
const addmessage = (msg) => {
  const newMessage = {
    id: messages.length + 1,
    text: msg.text,
    user: msg.user,
    timestamp: new Date().toISOString()
  };
  messages.push(newMessage);
  return newMessage;
};

module.exports = { GetAllMessages, createMessage, deleteMessage, addmessage };
