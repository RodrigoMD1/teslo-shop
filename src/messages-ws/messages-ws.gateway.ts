import { WebSocketGateway } from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway()
export class MessagesWsGateway {
  constructor(private readonly messagesWsService: MessagesWsService) {}
}
