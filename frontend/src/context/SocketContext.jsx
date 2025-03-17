import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useUser } from "./UserContext";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    let socketInstance = null;

    if (user && user._id) {
      socketInstance = io("http://localhost:4000", {
        withCredentials: true,
        query: { userId: user._id }
      });

      socketInstance.on("connect", () => {
        setSocket(socketInstance);
      });

      // Handle community chat messages
      socketInstance.on('communityMessage', (message) => {
        // Message will be handled by the CommunityChat component
      });

      // Handle user joining community
      socketInstance.on('userJoinedCommunity', (data) => {
        console.log(`${data.username} joined the community`);
      });

      // Handle user leaving community
      socketInstance.on('userLeftCommunity', (data) => {
        console.log(`${data.username} left the community`);
      });
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
        setSocket(null);
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
