# Socket.IO Chat Implementation

This document describes the Socket.IO-based real-time chat implementation for the KharidoBecho marketplace.

## Overview

The chat system uses Socket.IO for real-time messaging between buyers and sellers. It works with the backend `ConversationMessageEntity` structure.

## Backend Entity Structure

```java
ConversationMessageEntity {
    messageId: Long
    request_id: Long (bookingId)
    sender_user_id: Long
    senderType: "BUYER" | "SELLER"
    message: String (max 1000 chars)
    createdAt: OffsetDateTime
}
```

## Socket.IO Events

### Client → Server Events

#### 1. `join-chat-room`
Join a chat room for a specific request/booking.

```javascript
socket.emit("join-chat-room", {
  roomName: "chat-{CHAT_TYPE}-{requestId}",
  requestId: Number,
  senderUserId: Number,
  senderType: "BUYER" | "SELLER",
  chatType: "CAR" | "BIKE" | "MOBILE" | "LAPTOP"
});
```

#### 2. `get-chat-history`
Request chat history for a request.

```javascript
socket.emit("get-chat-history", {
  requestId: Number,
  chatType: "CAR" | "BIKE" | "MOBILE" | "LAPTOP"
});
```

#### 3. `send-message`
Send a new message.

```javascript
socket.emit("send-message", {
  requestId: Number,
  senderUserId: Number,
  senderType: "BUYER" | "SELLER",
  message: String,
  chatType: "CAR" | "BIKE" | "MOBILE" | "LAPTOP",
  tempId: String // For optimistic updates
});
```

#### 4. `leave-chat-room`
Leave a chat room.

```javascript
socket.emit("leave-chat-room", {
  roomName: "chat-{CHAT_TYPE}-{requestId}"
});
```

### Server → Client Events

#### 1. `chat-history`
Received when chat history is loaded.

```javascript
socket.on("chat-history", (data) => {
  data: {
    requestId: Number,
    messages: [{
      messageId: Number,
      request_id: Number,
      sender_user_id: Number,
      senderType: "BUYER" | "SELLER",
      message: String,
      createdAt: String (ISO date)
    }]
  }
});
```

#### 2. `new-message`
Received when a new message is sent (broadcast to all room participants).

```javascript
socket.on("new-message", (data) => {
  data: {
    messageId: Number,
    requestId: Number,
    senderUserId: Number,
    senderType: "BUYER" | "SELLER",
    message: String,
    createdAt: String (ISO date)
  }
});
```

#### 3. `message-sent`
Confirmation that a message was successfully saved.

```javascript
socket.on("message-sent", (data) => {
  data: {
    messageId: Number,
    requestId: Number,
    tempId: String // Matches the tempId from send-message
  }
});
```

#### 4. `chat-error`
Error occurred during chat operation.

```javascript
socket.on("chat-error", (errorData) => {
  errorData: {
    message: String,
    code: String (optional),
    requestId: Number (optional)
  }
});
```

## Frontend Usage

### Buyer Side

```javascript
import { useSocketChat } from "../../socketio/useSocketChat";

const BuyerChatInterface = ({ bookingId, chatType = "CAR" }) => {
  const { messages, loading, sending, error, sendMessage, connected } = 
    useSocketChat(bookingId, "BUYER", chatType);
  
  // Use messages, sendMessage, etc.
};
```

### Seller Side

```javascript
import { useSocketChat } from "../../socketio/useSocketChat";

const SellerChatInterface = ({ bookingId, chatType = "BIKE" }) => {
  const { messages, loading, sending, error, sendMessage, connected } = 
    useSocketChat(bookingId, "SELLER", chatType);
  
  // Use messages, sendMessage, etc.
};
```

## Features

1. **Real-time Messaging**: Messages appear instantly for all participants
2. **Optimistic Updates**: Messages show immediately while being saved
3. **Auto-reconnection**: Automatically reconnects if connection is lost
4. **Fallback to API**: Falls back to REST API if Socket.IO is unavailable
5. **Message Status**: Shows sending (⏳) and failed (⚠️) states
6. **Connection Status**: Displays real-time connection status

## Room Naming Convention

Chat rooms are named using the pattern:
```
chat-{CHAT_TYPE}-{requestId}
```

Examples:
- `chat-CAR-123`
- `chat-BIKE-456`
- `chat-MOBILE-789`
- `chat-LAPTOP-101`

## Message Format

Messages are normalized to have both `content` and `message` fields for compatibility:

```javascript
{
  messageId: Number,
  id: Number, // Same as messageId
  requestId: Number,
  senderUserId: Number,
  senderType: "BUYER" | "SELLER",
  content: String, // For UI
  message: String, // For backend compatibility
  createdAt: String,
  timestamp: String, // Same as createdAt
  optimistic: Boolean, // true for messages being sent
  failed: Boolean // true if send failed
}
```

## Error Handling

- Connection errors are handled gracefully
- Failed messages are marked and can be retried
- Falls back to API-based chat if Socket.IO fails
- Shows user-friendly error messages

## Integration with Existing Code

The Socket.IO chat is integrated into:
- `BuyerChatInterface.jsx` - Buyer chat UI
- `SellerChatInterface.jsx` - Seller chat UI
- Both components automatically use Socket.IO when available, with API fallback

## Backend Requirements

The backend should implement:

1. **Socket.IO Server** with authentication
2. **Room Management** for chat rooms
3. **Message Persistence** using ConversationMessageEntity
4. **Broadcasting** messages to all room participants
5. **Error Handling** and validation

## Testing

To test the Socket.IO chat:

1. Ensure backend Socket.IO server is running
2. Open chat in two different browser windows/tabs
3. Send messages from both sides
4. Verify real-time updates
5. Test reconnection by disconnecting and reconnecting
