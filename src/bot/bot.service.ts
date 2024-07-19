import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class BotService implements OnModuleInit {
  private readonly logger = new Logger(BotService.name);
  private bot: TelegramBot;

  private funnyStatements = [
    'Hi there! Are you talking to me, or are you just practicing your typing?',
    "Hi! Did you just 'hello' me? How old-school!",
    "Hey! Typing 'hello' is so last century.",
    'Hi! I was just thinking about you... and pizza.',
    "Hello! If I had a dollar for every time someone said 'hello', I'd be rich.",
    "Hello! You're looking at your phone again, aren't you?",
  ];

  constructor(private configService: ConfigService) {
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.bot = new TelegramBot(botToken, { polling: true });
  }

  onModuleInit() {
    this.logger.log('Initializing Telegram bot...');
    this.bot.onText(/hello/i, (msg) => this.handleGreeting(msg));
    this.bot.on('message', (msg) => this.handleUnknownCommand(msg));
  }

  private handleGreeting(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    const statement = this.getRandomFunnyStatement();
    this.logger.log(
      `Received greeting from chat ID ${chatId}. Responding with: ${statement}`,
    );

    this.bot.sendMessage(chatId, statement);
  }

  private handleUnknownCommand(msg: TelegramBot.Message) {
    const chatId = msg.chat.id;
    if (!/hello/i.test(msg.text)) {
      const response = "I'm not sure what you mean. Try saying 'hello'.";
      this.logger.warn(
        `Received unknown command from chat ID ${chatId}. Responding with: ${response}`,
      );
      this.bot.sendMessage(chatId, response);
    }
  }

  private getRandomFunnyStatement(): string {
    const randomIndex = Math.floor(Math.random() * this.funnyStatements.length);
    return this.funnyStatements[randomIndex];
  }
}
