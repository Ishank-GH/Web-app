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
      const socketUrl = import.meta.env.VITE_BASE_URL;
      socketInstance = io(socketUrl, {
        withCredentials: true,
        query: { userId: user._id },
        transports: ['websocket', 'polling'],
        reconnection: true
      });

      socketInstance.on("connect", () => {
        console.log("Socket connected");
        setSocket(socketInstance);
      });

      socketInstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
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
