import { Test, TestingModule } from '@nestjs/testing';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

describe('StudentsController', () => {
  let controller: StudentsController;
  let service: StudentsService;

  const mockStudentsService = {
    create: jest
      .fn()
      .mockImplementation((dto: CreateStudentDto, parentId: string) => {
        return Promise.resolve({
          id: 'student-123',
          parentId,
          ...dto,
          status: 'APPLICATION_CREATED',
        });
      }),
    update: jest
      .fn()
      .mockImplementation(
        (id: string, dto: UpdateStudentDto, currentUser: any) => {
          return Promise.resolve({
            id,
            parentId: currentUser.id,
            studentName: dto.studentName || 'Alice Doe',
            applyingGrade: dto.applyingGrade || 'Grade 1',
            status: 'APPLICATION_CREATED',
          });
        },
      ),
    findOne: jest.fn().mockImplementation((id: string, currentUser: any) => {
      return Promise.resolve({
        id,
        parentId: currentUser.id,
        studentName: 'Alice Doe',
        applyingGrade: 'Grade 1',
        status: 'APPLICATION_CREATED',
      });
    }),
    findAll: jest
      .fn()
      .mockImplementation((currentUser: any, statusFilter?: string) => {
        return Promise.resolve([
          {
            id: 'student-123',
            parentId: currentUser.id,
            studentName: 'Alice Doe',
            status: statusFilter || 'APPLICATION_CREATED',
          },
        ]);
      }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentsController],
      providers: [
        {
          provide: StudentsService,
          useValue: mockStudentsService,
        },
      ],
    }).compile();

    controller = module.get<StudentsController>(StudentsController);
    service = module.get<StudentsService>(StudentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should invoke StudentsService.create with body and user ID', async () => {
      const dto: CreateStudentDto = {
        studentName: 'Alice Doe',
        dateOfBirth: '2015-05-15',
        gender: 'female',
        applyingGrade: 'Grade 1',
      };
      const user = { id: 'parent-123', role: 'parent' };

      const result = await controller.create(dto, user);
      expect(result).toEqual({
        id: 'student-123',
        parentId: 'parent-123',
        ...dto,
        status: 'APPLICATION_CREATED',
      });
      expect(service.create).toHaveBeenCalledWith(dto, 'parent-123');
    });
  });

  describe('update', () => {
    it('should invoke StudentsService.update with params, body, and current user', async () => {
      const dto: UpdateStudentDto = { studentName: 'Alice Updated' };
      const user = { id: 'parent-123', role: 'parent' };

      const result = await controller.update('student-123', dto, user);
      expect(result).toEqual({
        id: 'student-123',
        parentId: 'parent-123',
        studentName: 'Alice Updated',
        applyingGrade: 'Grade 1',
        status: 'APPLICATION_CREATED',
      });
      expect(service.update).toHaveBeenCalledWith('student-123', dto, user);
    });
  });

  describe('findOne', () => {
    it('should invoke StudentsService.findOne with ID and current user', async () => {
      const user = { id: 'parent-123', role: 'parent' };
      const result = await controller.findOne('student-123', user);
      expect(result).toEqual({
        id: 'student-123',
        parentId: 'parent-123',
        studentName: 'Alice Doe',
        applyingGrade: 'Grade 1',
        status: 'APPLICATION_CREATED',
      });
      expect(service.findOne).toHaveBeenCalledWith('student-123', user);
    });
  });

  describe('findAll', () => {
    it('should invoke StudentsService.findAll with user and status filter', async () => {
      const user = { id: 'parent-123', role: 'parent' };
      const result = await controller.findAll(user, 'APPLICATION_CREATED');
      expect(result).toEqual([
        {
          id: 'student-123',
          parentId: 'parent-123',
          studentName: 'Alice Doe',
          status: 'APPLICATION_CREATED',
        },
      ]);
      expect(service.findAll).toHaveBeenCalledWith(user, 'APPLICATION_CREATED');
    });
  });
});
