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

      // Add in your socket initialization
      socketInstance.on('channelMessage', (message) => {
        // Handle new channel messages
      });

      socketInstance.on('channelJoin', (userId) => {
        // Handle user joining channel
      });

      socketInstance.on('channelLeave', (userId) => {
        // Handle user leaving channel
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
