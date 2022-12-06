import { FC, useContext } from "react";
import SocketContext from "./context/Socket/Context";

interface AppProps {}

const  App:FC<AppProps> = () =>  {
  const {socket, uid, users} = useContext(SocketContext).SocketState;

  return (
    <div className="App">
     Client Socket io
      <h2>Socket IO Information</h2>
      <p>
        Your user ID: <strong>{uid}</strong>
      </p>
      <p>
        Users online: <strong>{users.length}</strong>
      </p>
      <p>
        Socket IO Id: <strong>{socket?.id}</strong>
      </p>
    </div>
  );
}

export default App;

