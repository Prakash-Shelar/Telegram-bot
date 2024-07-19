import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BotService } from './bot.service';
import * as TelegramBot from 'node-telegram-bot-api';

jest.mock('node-telegram-bot-api');

describe('BotService', () => {
  let service: BotService;
  let botMock: jest.Mocked<TelegramBot>;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock-telegram-bot-token'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<BotService>(BotService);
    botMock = (TelegramBot as jest.MockedClass<typeof TelegramBot>).mock
      .instances[0];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should respond with a funny statement to a hello message', () => {
    const chatId = 123;
    const message = {
      chat: { id: chatId },
      text: 'hello',
    } as TelegramBot.Message;

    botMock.onText.mockImplementation((regex, callback) => {
      if (regex.test(message.text)) {
        callback(message);
      }
    });

    service.onModuleInit();

    expect(botMock.sendMessage).toHaveBeenCalledWith(
      chatId,
      expect.stringMatching(/Hello|Hi|Hey/),
    );
  });

  it('should respond with a default message to an unknown command', () => {
    const chatId = 123;
    const message = {
      chat: { id: chatId },
      text: 'unknown command',
    } as TelegramBot.Message;

    botMock.on.mockImplementation((event, callback) => {
      if (event === 'message') {
        callback(message);
      }
    });

    service.onModuleInit();

    expect(botMock.sendMessage).toHaveBeenCalledWith(
      chatId,
      "I'm not sure what you mean. Try saying 'hello'.",
    );
  });
});
