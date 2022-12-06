import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useReducer,
  useState,
} from "react";
import { useSocket } from "../../hooks/useSocket";
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from "./Context";

interface SocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: FunctionComponent<
  SocketContextComponentProps
> = ({ children }) => {
  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState
  );
  const [isLoading, setIsLoading] = useState(true);
  //'ws://localhost:3007'
  const socket = useSocket("ws://localhost:3007", {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
  });

  const SendHandshake = () => {
    console.info("Sending handshake to server ...");

    socket.emit("handshake", async (uid: string, users: string[]) => {
      console.info("User handshake callback message received");
      SocketDispatch({ type: "update_users", payload: users });
      SocketDispatch({ type: "update_uid", payload: uid });
    });

    setIsLoading(false);
  };

  const StartListeners = () => {
    /** Messages */
    socket.on("user_connected", (users: string[]) => {
      console.info("User connected message received");
      SocketDispatch({ type: "update_users", payload: users });
    });

    /** Messages */
    socket.on("user_disconnected", (uid: string) => {
      console.info("User disconnected message received");
      SocketDispatch({ type: "remove_user", payload: uid });
    });

    /** Connection / reconnection listeners */
    socket.io.on("reconnect", (attempt) => {
      console.info("Reconnected on attempt: " + attempt);
      SendHandshake();
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.info("Reconnection Attempt: " + attempt);
    });

    socket.io.on("reconnect_error", (error) => {
      console.info("Reconnection error: " + error);
    });

    socket.io.on("reconnect_failed", () => {
      console.info("Reconnection failure.");
      alert(
        "We are unable to connect you to the chat service.  Please make sure your internet connection is stable or try again later."
      );
    });
  };

  useEffect(() => {
    // Connect to the Web Socket
    socket.connect();

    // Save The socket in context
    SocketDispatch({ type: "update_socket", payload: socket });

    // Start the event listeners
    StartListeners();

    //
    SendHandshake();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) return <p>Loading Socket IO ... </p>;

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
