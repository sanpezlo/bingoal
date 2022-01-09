import { UseFilters, UsePipes } from '@nestjs/common';
import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { SocketAuth } from '@root/app/decorators/auth.decorator';
import { JoinGameDto } from '@root/games/dto/games.dto';
import { SocketValidationPipe } from '@root/app/pipes/socket-validation.pipe';
import { Game } from '@root/games/schemas/game.schema';

@SocketAuth()
@UseFilters(new BaseWsExceptionFilter())
@UsePipes(new SocketValidationPipe({ whitelist: true, transform: true }))
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GamesGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('join')
  async join(
    @MessageBody() joinGameDto: JoinGameDto,
    @ConnectedSocket() socket: Socket,
  ) {
    socket.join(joinGameDto.game);
  }

  emitGame(game: string, data: Partial<Game>) {
    this.server.to(game).emit('game', data);
  }

  emitBall(game: string, ball: number) {
    this.server.to(game).emit('ball', ball);
  }

  emitWinners(game: string, winners: string[]) {
    this.server.to(game).emit('winners', winners);
    this.emitGame(game, { playing: false, played: true });
  }
}
