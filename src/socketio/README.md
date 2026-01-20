# Live Products Auction - Socket.IO Implementation

## Overview
This implementation adds a real-time live auction system to the Dashboard, allowing buyers to bid on products in real-time using Socket.IO.

## File Structure

```
src/
├── socketio/
│   ├── socketConnection.js      # Socket.IO connection setup
│   ├── useLiveAuction.js        # Custom hook for live auction logic
│   └── README.md                # This file
├── components/
│   └── LiveProducts/
│       ├── LiveProductCard.jsx      # Individual product card component
│       └── LiveProductsSection.jsx  # Main section component
└── store/
    └── services/
        └── auctionServices.js    # API service functions
```

## Features

1. **Real-time Live Products**
   - Products set for auction appear in real-time
   - Automatic updates when products go live or end

2. **Real-time Bidding**
   - Buyers can place bids instantly
   - All connected users see bid updates in real-time

3. **Top 3 Bids Display**
   - Shows the top 3 highest bids for each product
   - Visual ranking (Gold, Silver, Bronze)

4. **Winner Announcement**
   - Real-time winner announcement when auction ends
   - Displays winner name and winning bid

5. **Product Type Support**
   - Cars (CAR)
   - Bikes (BIKE)
   - Mobiles (MOBILE)
   - Laptops (LAPTOP)

## Socket.IO Events

### Client → Server Events

- `join-live-auctions` - Join room for specific product type
  ```javascript
  socket.emit("join-live-auctions", { productType: "CAR" });
  ```

- `get-live-products` - Request list of live products
  ```javascript
  socket.emit("get-live-products", { productType: "CAR" });
  ```

- `place-bid` - Place a bid on a product
  ```javascript
  socket.emit("place-bid", {
    productId: 123,
    productType: "CAR",
    buyerId: 456,
    bidAmount: 50000
  });
  ```

- `leave-live-auctions` - Leave product type room
  ```javascript
  socket.emit("leave-live-auctions", { productType: "CAR" });
  ```

### Server → Client Events

- `live-products` - List of live products
  ```javascript
  socket.on("live-products", (products) => {
    // products: Array of live products
  });
  ```

- `product-live` - New product went live
  ```javascript
  socket.on("product-live", (product) => {
    // product: Product object
  });
  ```

- `product-auction-ended` - Auction ended for a product
  ```javascript
  socket.on("product-auction-ended", (productId) => {
    // productId: ID of product whose auction ended
  });
  ```

- `bid-updated` - Bid was placed/updated
  ```javascript
  socket.on("bid-updated", (data) => {
    // data: { productId, currentBid, topBids, totalBids }
  });
  ```

- `auction-winner` - Winner announced
  ```javascript
  socket.on("auction-winner", (data) => {
    // data: { productId, winner, winnerName, winnerBid }
  });
  ```

## Backend API Endpoints Expected

The following REST API endpoints should be available:

```
GET  /api/v1/auctions/live?productType={type}
GET  /api/v1/auctions/live/{productId}?productType={type}
POST /api/v1/auctions/bid
GET  /api/v1/auctions/bids/top/{productId}?productType={type}&limit=3
GET  /api/v1/auctions/winner/{productId}?productType={type}
POST /api/v1/auctions/set-live
```

## Usage

### In Dashboard Component

The Live Products tab is automatically added to the Dashboard. Users can:
1. Click on "LIVE PRODUCTS" tab
2. Filter by product type (All, Cars, Bikes, Mobiles, Laptops)
3. View live products with real-time updates
4. Place bids on products
5. See top 3 bids and winners

### Setting a Product as Live (Backend)

To set a product as live for auction, the backend should:
1. Mark product status as "LIVE" or similar
2. Set auction start/end times
3. Emit `product-live` event via Socket.IO
4. Store auction data in database

## Configuration

Socket.IO connection URL is configured in `socketConnection.js`:
- Uses `VITE_BASE_URL` environment variable
- Defaults to `http://localhost:8087`
- Automatically includes JWT token from localStorage

## Product Data Structure

Each product should have:
```javascript
{
  // Product identifiers (one of these)
  carId: number,
  bike_id: number,
  bikeId: number,
  mobileId: number,
  laptopId: number,
  id: number,
  
  // Product info
  brand: string,
  model: string,
  price: number,
  prize: number, // Alternative field name
  
  // Auction info
  currentBid: number,
  startingBid: number,
  totalBids: number,
  auctionEndTime: string, // ISO date string
  auctionEnded: boolean,
  
  // Images
  images: [{ imageUrl: string }],
  
  // Other
  yearOfPurchase: number,
  condition: string,
  location: string,
  
  // Top bids (from socket)
  topBids: [{ buyerName: string, bidAmount: number }],
  
  // Winner (from socket)
  winner: number, // buyerId
  winnerName: string,
  winnerBid: number
}
```

## Notes

- Socket connection is automatically established when user is logged in
- Connection persists across component mounts/unmounts
- Multiple product types can be monitored simultaneously
- Real-time updates are synchronized across all connected clients

