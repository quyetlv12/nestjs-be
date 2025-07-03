// Socket.IO Chat Test - Console Version
// Copy and paste this code into browser console (F12 -> Console)

class SocketIOTest {
    constructor() {
        this.socket = null;
        this.currentChatId = null;
        this.isConnected = false;
        this.serverUrl = 'http://localhost:3000';
        this.token = null;
    }

    // Initialize with token
    init(token, serverUrl = 'http://localhost:3000') {
        this.token = token;
        this.serverUrl = serverUrl;
        console.log('🔧 Socket.IO Test initialized');
        console.log(`Server: ${this.serverUrl}`);
        console.log(`Token: ${token ? 'Set' : 'Not set'}`);
    }

    // Connect to Socket.IO server
    connect() {
        if (!this.token) {
            console.error('❌ Token not set! Use .init(token) first');
            return;
        }

        if (this.socket) {
            this.socket.disconnect();
        }

        try {
            this.socket = io(`${this.serverUrl}/chat`, {
                auth: { token: this.token },
                transports: ['websocket', 'polling']
            });

            this.socket.on('connect', () => {
                this.isConnected = true;
                console.log('✅ Connected to Socket.IO server');
            });

            this.socket.on('disconnect', (reason) => {
                this.isConnected = false;
                console.log(`❌ Disconnected: ${reason}`);
            });

            this.socket.on('connect_error', (error) => {
                this.isConnected = false;
                console.error(`❌ Connection error: ${error.message}`);
            });

            this.socket.on('receive_message', (msg) => {
                const content = msg.type === 'text' ? msg.content : `[${msg.type.toUpperCase()}] ${msg.content || 'File/Image'}`;
                console.log(`📨 Received: [User ${msg.senderId}] ${content}`);
            });

            console.log('🔄 Attempting to connect...');

        } catch (error) {
            console.error(`❌ Socket creation error: ${error.message}`);
        }
    }

    // Disconnect from server
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.currentChatId = null;
            this.isConnected = false;
            console.log('🔌 Manually disconnected');
        }
    }

    // Join a chat room
    joinChat(chatId) {
        if (!this.socket || !this.isConnected) {
            console.error('❌ Not connected to server!');
            return;
        }

        this.socket.emit('join_chat', { chatId });
        this.currentChatId = chatId;
        console.log(`👥 Joined chat room ${chatId}`);
    }

    // Leave current chat room
    leaveChat() {
        if (!this.socket || !this.currentChatId) {
            console.error('❌ Not in any chat room!');
            return;
        }

        this.socket.emit('leave_chat', { chatId: this.currentChatId });
        console.log(`🚪 Left chat room ${this.currentChatId}`);
        this.currentChatId = null;
    }

    // Send a message
    sendMessage(content, type = 'text', chatId = null) {
        if (!this.socket || !this.isConnected) {
            console.error('❌ Not connected to server!');
            return;
        }

        const targetChatId = chatId || this.currentChatId;
        if (!targetChatId) {
            console.error('❌ No chat ID specified!');
            return;
        }

        const messageData = {
            chatId: targetChatId,
            message: { content, type }
        };

        this.socket.emit('send_message', messageData);
        console.log(`📤 Sent message to chat ${targetChatId}: "${content}" (${type})`);
    }

    // Test typing indicator
    testTyping(chatId = null) {
        if (!this.socket || !this.isConnected) {
            console.error('❌ Not connected!');
            return;
        }

        const targetChatId = chatId || this.currentChatId || 1;
        this.socket.emit('typing', { chatId: targetChatId });
        console.log(`⌨️ Emitted typing indicator for chat ${targetChatId}`);

        setTimeout(() => {
            if (this.socket && this.isConnected) {
                this.socket.emit('stop_typing', { chatId: targetChatId });
                console.log(`⌨️ Emitted stop typing for chat ${targetChatId}`);
            }
        }, 2000);
    }

    // Test multiple messages
    testMultipleMessages(count = 5, chatId = null) {
        if (!this.socket || !this.isConnected) {
            console.error('❌ Not connected!');
            return;
        }

        const targetChatId = chatId || this.currentChatId;
        if (!targetChatId) {
            console.error('❌ No chat ID specified!');
            return;
        }

        console.log(`📨 Sending ${count} test messages to chat ${targetChatId}...`);

        for (let i = 1; i <= count; i++) {
            setTimeout(() => {
                this.sendMessage(`Test message ${i}`, 'text', targetChatId);
            }, i * 1000);
        }
    }

    // Test reconnection
    testReconnect() {
        console.log('🔄 Testing reconnection...');
        this.disconnect();
        
        setTimeout(() => {
            this.connect();
        }, 1000);
    }

    // Get current status
    status() {
        console.log('📊 Current Status:');
        console.log(`- Connected: ${this.isConnected}`);
        console.log(`- Server: ${this.serverUrl}`);
        console.log(`- Token: ${this.token ? 'Set' : 'Not set'}`);
        console.log(`- Current Chat ID: ${this.currentChatId || 'None'}`);
        console.log(`- Socket: ${this.socket ? 'Active' : 'Inactive'}`);
    }

    // Test different message types
    testMessageTypes(chatId = null) {
        const targetChatId = chatId || this.currentChatId;
        if (!targetChatId) {
            console.error('❌ No chat ID specified!');
            return;
        }

        console.log('📝 Testing different message types...');
        
        setTimeout(() => this.sendMessage('This is a text message', 'text', targetChatId), 0);
        setTimeout(() => this.sendMessage('image1.jpg', 'image', targetChatId), 1000);
        setTimeout(() => this.sendMessage('document.pdf', 'file', targetChatId), 2000);
    }

    // Simulate user activity
    simulateUserActivity(chatId = null) {
        const targetChatId = chatId || this.currentChatId;
        if (!targetChatId) {
            console.error('❌ No chat ID specified!');
            return;
        }

        console.log('🎭 Simulating user activity...');
        
        // Join chat
        this.joinChat(targetChatId);
        
        // Send messages with delays
        setTimeout(() => this.sendMessage('Hello everyone!', 'text', targetChatId), 1000);
        setTimeout(() => this.testTyping(targetChatId), 3000);
        setTimeout(() => this.sendMessage('How are you doing?', 'text', targetChatId), 5000);
        setTimeout(() => this.sendMessage('test-image.png', 'image', targetChatId), 7000);
        setTimeout(() => this.sendMessage('See you later!', 'text', targetChatId), 9000);
    }
}

// Create global instance
window.socketTest = new SocketIOTest();

// Helper functions for quick testing
window.quickTest = {
    // Quick connect with token
    connect: (token, serverUrl = 'http://localhost:3000') => {
        window.socketTest.init(token, serverUrl);
        window.socketTest.connect();
    },

    // Quick send message
    send: (content, chatId = 1) => {
        window.socketTest.sendMessage(content, 'text', chatId);
    },

    // Quick join and send
    joinAndSend: (chatId, content) => {
        window.socketTest.joinChat(chatId);
        setTimeout(() => {
            window.socketTest.sendMessage(content, 'text', chatId);
        }, 500);
    },

    // Test with multiple messages
    testMultiple: (chatId = 1, count = 3) => {
        window.socketTest.joinChat(chatId);
        setTimeout(() => {
            window.socketTest.testMultipleMessages(count, chatId);
        }, 500);
    }
};

// Display usage instructions
console.log(`
🔌 Socket.IO Chat Test - Console Version
========================================

Quick Start:
1. Set token: socketTest.init('YOUR_JWT_TOKEN')
2. Connect: socketTest.connect()
3. Join chat: socketTest.joinChat(1)
4. Send message: socketTest.sendMessage('Hello!')

Quick Commands:
- quickTest.connect('TOKEN') - Quick connect
- quickTest.send('Message', 1) - Quick send
- quickTest.joinAndSend(1, 'Hello') - Join and send
- quickTest.testMultiple(1, 5) - Test multiple messages

Available Methods:
- socketTest.init(token, serverUrl)
- socketTest.connect()
- socketTest.disconnect()
- socketTest.joinChat(chatId)
- socketTest.leaveChat()
- socketTest.sendMessage(content, type, chatId)
- socketTest.testTyping(chatId)
- socketTest.testMultipleMessages(count, chatId)
- socketTest.testReconnect()
- socketTest.status()
- socketTest.testMessageTypes(chatId)
- socketTest.simulateUserActivity(chatId)

Example Usage:
socketTest.init('your-jwt-token-here');
socketTest.connect();
socketTest.joinChat(1);
socketTest.sendMessage('Hello from console!');
`); 