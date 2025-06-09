import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './card/card.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [CardsModule, BoardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
