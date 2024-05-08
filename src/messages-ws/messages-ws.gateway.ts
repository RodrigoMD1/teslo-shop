import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';



@WebSocketGateway({ cors: true, namespace: '/' })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {


  constructor(
    private readonly messagesWsService: MessagesWsService


  ) { }
  handleConnection(client: Socket) {
    console.log('cliente conectado', client.id);

  }
  handleDisconnect(client: Socket) {
    console.log('cliente desconectado', client.id);
  }



}
