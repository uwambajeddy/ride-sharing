const  http = require('http');
const { Server } = require('socket.io');

 const httpServer = http.createServer();

 const io = new Server(httpServer, {
  cors: {
   origin: "*",
   methods: ["GET", "POST"]
   }
 });

 const connectedUsers = {};

io.on('connection', (socket) => {

  socket.on("sendUserDetails", ({ user }) => {
   console.log(`User ${user._id} connected.`);
    connectedUsers[user._id] = { ...user, socketId: socket.id };
    
   })
 

  
 socket.on("tripStatus", ({ trip, passengers, status }) => {
   
  passengers.forEach(passenger => {
   
    const targetUserId = passenger.passengerId._id;
    
    const targetSocketId = connectedUsers[targetUserId]?.socketId;
    
    if (targetSocketId) {
      
      io.to(targetSocketId).emit("tripStatus", { trip, status });
    } 
  });
 });
  
 socket.on("requestStatus", ({  passengerId, status }) => {
   
    
    const targetSocketId = connectedUsers[passengerId]?.socketId;
    
    if (targetSocketId) {
      
      io.to(targetSocketId).emit("requestStatus", {  status });
    } 
 });
 socket.on("passengerRequest", ({  driverId }) => {
  
    const targetSocketId = connectedUsers[driverId]?.socketId;
    
    if (targetSocketId) {
      
      io.to(targetSocketId).emit("passengerRequest");
    } 
 });
  
 socket.on("startTrip", ({ trip, coordinates, passengers }) => {
   
  passengers.forEach(passenger => {
   
    const targetUserId = passenger.passengerId._id;
    
    const targetSocketId = connectedUsers[targetUserId]?.socketId;
   
    if (targetSocketId) {
      
      io.to(targetSocketId).emit("tripCoordinates", { trip, coordinates });
    } 
  });
});
   
   socket.on('disconnect', () => {
     console.log('User disconnected');
   });
 });

 const port = process.env.PORT || 5000;
 httpServer.listen(port, () => {
   console.log(`WebSocket server running on port ${port}`);
 }); 
