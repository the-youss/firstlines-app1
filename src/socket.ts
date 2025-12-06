import { createServer } from 'http';
import { Server, ServerOptions, Socket } from 'socket.io';

class SocketHandler {
  public static instance: SocketHandler;
  public io: Server;
  public userToSocket: Map<string, Socket> = new Map();

  private httpServer = createServer();

  private _config: Partial<ServerOptions> = {
    allowRequest(req, fn) {
      fn(null, true);
    },
    path: '/io',
    serveClient: false,
    cors: { origin: '*' },
    transports: ['websocket'],
    pingInterval: 25000,
    pingTimeout: 5000,
  };

  constructor(port: number = 3001) {
    SocketHandler.instance = this;

    // Create Socket.IO server on internal HTTP server
    this.io = new Server(this.httpServer, this._config);

    // Middleware
    this.io.use(async (socket, next) => {
      next();
    });

    // Listeners
    this.io.on('connection', this.listeners);

    // Start the internal HTTP server
    this.httpServer.listen(port, () => {
      console.log(`🚀 Socket.IO server running on port ${port}`);
    });
  }

  private listeners = async (socket: Socket) => {
    console.log(`[socket] user-connected => ${socket.id}`);

    // this._joinChannels(socket);

    socket.on('disconnect', () => {
      console.log(`[socket] user-disconnected => ${socket.id}`);
    });
  };

  emit(event: string, data: any) {
    this.io.emit(event, data);
  }

  // private _joinChannels(socket: Socket) {
  //   SOCKET_CHANNELS.forEach(channel => socket.join(channel));
  // }
}

const SOCKET_PORT = 9090

let socket: SocketHandler | undefined;

export const getSocket = (): SocketHandler => {
  return socket ?? new SocketHandler(SOCKET_PORT)
}



export default function initSocketServer() {
  socket = new SocketHandler(SOCKET_PORT)
  simulateTestEvent()
}


function simulateTestEvent() {
  const socket = getSocket();
  setInterval(() => {
    socket.emit('test', { time: Date.now() })
  }, 2000)
}