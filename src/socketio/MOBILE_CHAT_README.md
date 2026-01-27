# Mobile Socket.IO Chat Implementation

This document describes the Socket.IO-based real-time chat implementation specifically for Mobile products, using the `ConversationMessageEntity` structure.

## Backend Entity Structure

```java
ConversationMessageEntity {
    messageId: Long
    request_id: Long (MobileRequest ID)
    sender_user_id: Long
    senderType: "BUYER" | "SELLER"
    message: String (max 1000 chars)
    createdAt: OffsetDateTime
}
```

## Socket.IO Events for Mobile Chat

### Client → Server Events

#### 1. `join-mobile-chat`
Join a mobile chat room for a specific request.

```javascript
socket.emit("join-mobile-chat", {
  roomName: "mobile-chat-{requestId}",
  requestId: Number,
  senderUserId: Number,
  senderType: "BUYER" | "SELLER"
});
```

#### 2. `get-mobile-chat-history`
Request chat history for a mobile request.

```javascript
socket.emit("get-mobile-chat-history", {
  requestId: Number
});
```

#### 3. `send-mobile-message`
Send a new message in mobile chat.

```javascript
socket.emit("send-mobile-message", {
  requestId: Number,
  senderUserId: Number,
  senderType: "BUYER" | "SELLER",
  message: String,
  tempId: String // For optimistic updates
});
```

#### 4. `leave-mobile-chat`
Leave a mobile chat room.

```javascript
socket.emit("leave-mobile-chat", {
  roomName: "mobile-chat-{requestId}"
});
```

### Server → Client Events

#### 1. `mobile-chat-history`
Received when chat history is loaded.

```javascript
socket.on("mobile-chat-history", (data) => {
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

#### 2. `mobile-new-message`
Received when a new message is sent (broadcast to all room participants).

```javascript
socket.on("mobile-new-message", (data) => {
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

#### 3. `mobile-message-sent`
Confirmation that a message was successfully saved.

```javascript
socket.on("mobile-message-sent", (data) => {
  data: {
    messageId: Number,
    requestId: Number,
    tempId: String // Matches the tempId from send-mobile-message
  }
});
```

#### 4. `mobile-chat-error`
Error occurred during mobile chat operation.

```javascript
socket.on("mobile-chat-error", (errorData) => {
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
import { useMobileSocketChat } from "../../socketio/useMobileSocketChat";

const MobileChatInterface = ({ requestId }) => {
  const { messages, loading, sending, error, sendMessage, connected } = 
    useMobileSocketChat(requestId, "BUYER");
  
  // Use messages, sendMessage, etc.
};
```

### Seller Side

```javascript
import { useMobileSocketChat } from "../../socketio/useMobileSocketChat";

const MobileChatInterface = ({ requestId }) => {
  const { messages, loading, sending, error, sendMessage, connected } = 
    useMobileSocketChat(requestId, "SELLER");
  
  // Use messages, sendMessage, etc.
};
```

## Room Naming Convention

Mobile chat rooms are named using the pattern:
```
mobile-chat-{requestId}
```

Example:
- `mobile-chat-123`
- `mobile-chat-456`

## Key Differences from Other Chat Types

1. **Uses `requestId` instead of `bookingId`** - Mobile uses MobileRequest entity
2. **Event names prefixed with `mobile-`** - e.g., `mobile-chat-history`, `mobile-new-message`
3. **Room naming** - Uses `mobile-chat-{requestId}` pattern
4. **API Fallback** - Falls back to REST API (`/api/v1/mobile/requests/{requestId}/message`) if Socket.IO fails

## Integration Points

- **BuyerChatList** - Uses `MobileChatInterface` when `activeTab === "MOBILE"`
- **SellerRequestsPage** - Uses `MobileChatInterface` when `activeProduct === "mobile"`
- **MobileChat Page** - Standalone page for mobile chat (`/mobile-chat/:requestId`)
- **Routes**:
  - `/buyer/chat/mobile/:requestId` - Buyer mobile chat
  - `/seller/mobile-request-chat/:requestId` - Seller mobile chat
  - `/mobile-chat/:requestId` - Universal mobile chat (auto-detects role)

## Features

1. **Real-time Messaging**: Messages appear instantly for all participants
2. **Optimistic Updates**: Messages show immediately while being saved
3. **Auto-reconnection**: Automatically reconnects if connection is lost
4. **Fallback to API**: Falls back to REST API if Socket.IO is unavailable
5. **Message Status**: Shows sending (⏳) and failed (⚠️) states
6. **Connection Status**: Displays real-time connection status

## Backend Requirements

The backend should implement:

1. **Socket.IO Server** on port 9092 with authentication
2. **Room Management** for mobile chat rooms (`mobile-chat-{requestId}`)
3. **Message Persistence** using ConversationMessageEntity
4. **Broadcasting** messages to all room participants
5. **Error Handling** and validation

## Testing

To test the mobile Socket.IO chat:

1. Ensure backend Socket.IO server is running on port 9092
2. Create a mobile request (buyer side)
3. Open chat in two different browser windows/tabs (buyer and seller)
4. Send messages from both sides
5. Verify real-time updates
6. Test reconnection by disconnecting and reconnecting
