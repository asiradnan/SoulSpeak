const chatSocket = (io) => {
	console.log('Chat socket is running');
	io.on('connection', (socket) => {
		console.log('User connected:', socket.id);

		socket.on('join', (chatId) => {
			if (!chatId) {
				console.error('Invalid chatId');
				return;
			}
			socket.join(chatId);
			console.log(`User joined chat: ${chatId}`);
		});

		socket.on('leave chat', (chatId) => {
			socket.leave(chatId);
		});

		socket.on('disconnect', () => {
			console.log('User disconnected:', socket.id);
		});
	});
}

export default chatSocket;
