import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';



@WebSocketGateway({ cors: true, namespace: '/' })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService

  ) { }

  ////////////////////////////////////////////////////////////////////////////////
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {

      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);

    } catch (error) {
      client.disconnect();
      return;
    }

    //console.log({payload});



    // console.log('cliente conectado', client.id);


    // console.log({ conectados: this.messagesWsService.getConnectedClients() });   // esto permite mostrar cuantos hay conectados 

    //* para avisar a todos que estas conectado en el servidor ,igual hay que poner que el cliente escuche este evento
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())



  }

  ////////////////////////////////////////////////////////////////////////////////
  handleDisconnect(client: Socket) {
    // console.log('cliente desconectado', client.id);

    this.messagesWsService.removeClient(client.id);


    // console.log({ conectados: this.messagesWsService.getConnectedClients() });

    // *esto para mostar cuando alguien de desconecta 
    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }
  ////////////////////////////////////////////////////////////////////////////////

  // message-from-client
  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {

    // !emite unicamente al cliente 
    //client.emit('message-from-server', {
    // fullName: 'soy yo ',
    // message: payload.message || 'no-message!!' });

    //!emitir a todos menos al cliente inicial seria la persona que esta escribiendo el mensaje originalmente 
    //client.broadcast.emit('message-from-server', {
    //  fullName: 'soy yo ',
    // message: payload.message || 'no-message!!'});


    // !esto se lo emite a todos incluso a la persona que lo escribio el mensaje originalmente
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    });

  }
  ////////////////////////////////////////////////////////////////////////////////


}
