import Chat from '../models/Chat.js';

export async function createChat(req, res) {
  try {
      const { participantId } = req.body;
      const userId = req.user.id;

      // Check if chat already exists
      const existingChat = await Chat.findOne({
          participants: { $all: [userId, participantId] }
      }).populate('participants', 'username email isOnline isCompanion');

      if (existingChat) {
          // Emit to both participants even if chat exists
          const io = req.app.get('io');
          [userId, participantId].forEach(id => {
              io.to(id.toString()).emit('newChat', existingChat);
          });
          return res.status(200).json(existingChat);
      }

      // Create new chat
      const newChat = await Chat.create({
          participants: [userId, participantId],
          messages: []
      });

      // Populate the chat with participant details
      const populatedChat = await Chat.findById(newChat._id)
          .populate('participants', 'username email isOnline isCompanion');

      // Get Socket.IO instance
      const io = req.app.get('io');
      
      // Emit to both participants' personal rooms
      [userId, participantId].forEach(id => {
          io.to(id.toString()).emit('newChat', populatedChat);
      });

      res.status(201).json(populatedChat);
  } catch (error) {
      console.error('Create chat error:', error);
      res.status(500).json({ error: error.message });
  }
};



export async function sendMessage(req, res) {
  console.log('sendMessage function called');
  try {
      const { chatId, content } = req.body;
      const userId = req.user.id;

      const chat = await Chat.findById(chatId);
      if (!chat) {
          return res.status(404).json({ message: 'Chat not found' });
      }

      // Add the new message with sender marked as read
      chat.messages.push({
          sender: userId,
          content,
          readBy: [userId]
      });
      
      // Update lastMessageTime to current timestamp
      chat.lastMessageTime = new Date();
      
      // Increment unread count for other participants
      const otherParticipants = chat.participants.filter(p => p.toString() !== userId);
      otherParticipants.forEach(participantId => {
          const unreadEntry = chat.unreadCount.find(u => u.userId.toString() === participantId.toString());
          if (unreadEntry) {
              unreadEntry.count += 1;
          } else {
              chat.unreadCount.push({ userId: participantId, count: 1 });
          }
      });
      
      const savedChat = await chat.save();

      // Get populated chat data with sender information
      const populatedChat = await Chat.findById(chatId)
          .populate('participants', 'username email isOnline isCompanion')
          .populate('messages.sender', 'username profilePicture');

      const io = req.app.get('io');

      // Emit new message to chat room
      io.to(chatId).emit('newMessage', {
          chatId,
          message: savedChat.messages[savedChat.messages.length - 1]
      });

      // If this is the first message, emit newChat event to all participants
      if (savedChat.messages.length === 1) {
          chat.participants.forEach(participantId => {
              io.to(participantId.toString()).emit('newChat', populatedChat);
          });
      }

      res.status(200).json(savedChat);
  } catch (error) {
      console.error('Send message error:', error);
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
      .populate('participants', 'username email isOnline isCompanion')
      .populate('messages.sender', '_id username profilePicture')
      .sort({ lastMessageTime: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export async function markMessagesAsRead(req, res) {
  try {
    const { chatId } = req.body;
    const userId = req.user.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark all messages as read by current user
    chat.messages.forEach(message => {
      if (!message.readBy.includes(userId)) {
        message.readBy.push(userId);
      }
    });

    // Reset unread count for this user
    const unreadEntry = chat.unreadCount.find(u => u.userId.toString() === userId);
    if (unreadEntry) {
      unreadEntry.count = 0;
    }

    await chat.save();

    const populatedChat = await Chat.findById(chatId)
      .populate('participants', 'username email isOnline isCompanion')
      .populate('messages.sender', '_id username profilePicture');

    res.status(200).json(populatedChat);
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: error.message });
  }
};
