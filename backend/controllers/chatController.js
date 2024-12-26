import Chat from '../models/Chat.js';

export async function createChat(req, res) {
  try {
    const { participantId } = req.body;
    const userId = req.user.id; // Assuming you have authentication middleware

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [userId, participantId] }
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = await Chat.create({
      participants: [userId, participantId]
    });

    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function sendMessage(req, res) {
  console.log('sendMessage function called');
  try {
    const { chatId, content } = req.body;
    const userId = req.user.id;
    console.log('userId:', userId);
    console.log('chatId:', chatId);
    console.log('content:', content);

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    chat.messages.push({
      sender: userId,
      content
    });
    const savedChat = await chat.save();
    const io = req.app.get('io');

    if (!io) {
      console.error("Socket.IO instance not found");
      return res.status(500).json({ error: "Socket.IO instance unavailable" });
    }

    if (!chatId) {
      console.error("Invalid chatId");
      return res.status(400).json({ error: "Invalid chatId" });
    }
    console.log("before io.to(chatId)");
    io.to(chatId).emit('newMessage', {
      chatId,
      message: savedChat.messages[savedChat.messages.length - 1]
    });
    console.log('Message sent successfully');
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function getChats(req, res) {
  console.log('getChats function called');
  try {
    const userId = req.user.id;
    const chats = await Chat.find({
      participants: userId
    })
      .populate('participants', 'username email')
      .sort({ lastMessage: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
