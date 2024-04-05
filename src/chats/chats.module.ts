import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsResolver } from './chats.resolver';
import { ChatsRepository } from './chats.repository';
import { Chat, ChatSchema } from './entities/chat.entity';
import { DatabaseModule } from '../common/database/database.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]), // Import the DatabaseModule and use the forFeature() method to define the Chat entity
  ],
  providers: [ChatsResolver, ChatsService, ChatsRepository]
})
export class ChatsModule { }
