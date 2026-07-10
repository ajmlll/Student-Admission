import { Test, TestingModule } from '@nestjs/testing';
import { ExamSlotsController } from './exam-slots.controller';
import { ExamSlotsService } from './exam-slots.service';
import { CreateExamSlotDto } from './dto/create-exam-slot.dto';
import { BookExamSlotDto } from './dto/book-exam-slot.dto';

describe('ExamSlotsController', () => {
  let controller: ExamSlotsController;
  let service: ExamSlotsService;

  const mockExamSlotsService = {
    create: jest.fn().mockImplementation((dto: CreateExamSlotDto) => {
      return Promise.resolve({
        id: 'slot-123',
        ...dto,
        isBooked: false,
        bookedByStudentId: null,
      });
    }),
    findAll: jest
      .fn()
      .mockImplementation((currentUser: any, showAll?: boolean) => {
        return Promise.resolve([
          {
            id: 'slot-123',
            date: new Date('2026-07-15'),
            time: '10:00 AM',
            capacity: 1,
            isBooked: showAll ? true : false,
            bookedByStudentId: null,
          },
        ]);
      }),
    bookSlot: jest
      .fn()
      .mockImplementation(
        (slotId: string, studentId: string, currentUser: any) => {
          return Promise.resolve({
            id: slotId,
            date: new Date('2026-07-15'),
            time: '10:00 AM',
            capacity: 1,
            isBooked: true,
            bookedByStudentId: studentId,
          });
        },
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExamSlotsController],
      providers: [
        {
          provide: ExamSlotsService,
          useValue: mockExamSlotsService,
        },
      ],
    }).compile();

    controller = module.get<ExamSlotsController>(ExamSlotsController);
    service = module.get<ExamSlotsService>(ExamSlotsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should invoke ExamSlotsService.create with body', async () => {
      const dto: CreateExamSlotDto = {
        date: '2026-07-15',
        time: '10:00 AM',
        capacity: 1,
      };

      const result = await controller.create(dto);
      expect(result).toEqual({
        id: 'slot-123',
        ...dto,
        isBooked: false,
        bookedByStudentId: null,
      });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should invoke ExamSlotsService.findAll with user and showAll parsed boolean', async () => {
      const user = { id: 'parent-123', role: 'parent' };
      const result = await controller.findAll(user, 'false');
      expect(result).toEqual([
        {
          id: 'slot-123',
          date: new Date('2026-07-15'),
          time: '10:00 AM',
          capacity: 1,
          isBooked: false,
          bookedByStudentId: null,
        },
      ]);
      expect(service.findAll).toHaveBeenCalledWith(user, false);
    });

    it('should parse showAll as true when all query is "true"', async () => {
      const user = { id: 'staff-123', role: 'admission_team' };
      const result = await controller.findAll(user, 'true');
      expect(result).toEqual([
        {
          id: 'slot-123',
          date: new Date('2026-07-15'),
          time: '10:00 AM',
          capacity: 1,
          isBooked: true,
          bookedByStudentId: null,
        },
      ]);
      expect(service.findAll).toHaveBeenCalledWith(user, true);
    });
  });

  describe('bookSlot', () => {
    it('should invoke ExamSlotsService.bookSlot with slot ID, student ID, and user', async () => {
      const dto: BookExamSlotDto = { studentId: 'student-123' };
      const user = { id: 'parent-123', role: 'parent' };

      const result = await controller.bookSlot('slot-123', dto, user);
      expect(result).toEqual({
        id: 'slot-123',
        date: new Date('2026-07-15'),
        time: '10:00 AM',
        capacity: 1,
        isBooked: true,
        bookedByStudentId: 'student-123',
      });
      expect(service.bookSlot).toHaveBeenCalledWith(
        'slot-123',
        'student-123',
        user,
      );
    });
  });
});
