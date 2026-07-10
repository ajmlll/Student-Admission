import { Test, TestingModule } from '@nestjs/testing';
import { AdmissionController } from './admission.controller';
import { AdmissionService } from './admission.service';
import { UpdateExamScoreDto } from './dto/update-exam-score.dto';
import { AssignCourseDto } from './dto/assign-course.dto';

describe('AdmissionController', () => {
  let controller: AdmissionController;
  let service: AdmissionService;

  const mockAdmissionService = {
    findAll: jest.fn().mockImplementation((statusFilter?: string) => {
      return Promise.resolve([
        {
          id: 'student-123',
          studentName: 'Alice Doe',
          status: statusFilter || 'SLOT_BOOKED',
          examScore: statusFilter === 'ADMISSION_COMPLETED' ? 85 : undefined,
          assignedCourse:
            statusFilter === 'ADMISSION_COMPLETED' ? 'Grade 1' : undefined,
        },
      ]);
    }),
    submitExamScore: jest
      .fn()
      .mockImplementation((studentId: string, score: number) => {
        return Promise.resolve({
          id: studentId,
          studentName: 'Alice Doe',
          examScore: score,
          status: 'EXAM_COMPLETED',
        });
      }),
    assignCourse: jest
      .fn()
      .mockImplementation((studentId: string, course: string) => {
        return Promise.resolve({
          id: studentId,
          studentName: 'Alice Doe',
          examScore: 85,
          assignedCourse: course,
          status: 'ADMISSION_COMPLETED',
        });
      }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdmissionController],
      providers: [
        {
          provide: AdmissionService,
          useValue: mockAdmissionService,
        },
      ],
    }).compile();

    controller = module.get<AdmissionController>(AdmissionController);
    service = module.get<AdmissionService>(AdmissionService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should invoke AdmissionService.findAll with query status', async () => {
      const result = await controller.findAll('SLOT_BOOKED');
      expect(result).toEqual([
        {
          id: 'student-123',
          studentName: 'Alice Doe',
          status: 'SLOT_BOOKED',
        },
      ]);
      expect(service.findAll).toHaveBeenCalledWith('SLOT_BOOKED');
    });
  });

  describe('submitExamScore', () => {
    it('should invoke AdmissionService.submitExamScore with params and score body', async () => {
      const dto: UpdateExamScoreDto = { score: 90 };
      const result = await controller.submitExamScore('student-123', dto);
      expect(result).toEqual({
        id: 'student-123',
        studentName: 'Alice Doe',
        examScore: 90,
        status: 'EXAM_COMPLETED',
      });
      expect(service.submitExamScore).toHaveBeenCalledWith('student-123', 90);
    });
  });

  describe('assignCourse', () => {
    it('should invoke AdmissionService.assignCourse with params and course body', async () => {
      const dto: AssignCourseDto = { course: 'Grade 1' };
      const result = await controller.assignCourse('student-123', dto);
      expect(result).toEqual({
        id: 'student-123',
        studentName: 'Alice Doe',
        examScore: 85,
        assignedCourse: 'Grade 1',
        status: 'ADMISSION_COMPLETED',
      });
      expect(service.assignCourse).toHaveBeenCalledWith('student-123', 'Grade 1');
    });
  });

  describe('findCompleted', () => {
    it('should invoke AdmissionService.findAll with ADMISSION_COMPLETED filter', async () => {
      const result = await controller.findCompleted();
      expect(result).toEqual([
        {
          id: 'student-123',
          studentName: 'Alice Doe',
          status: 'ADMISSION_COMPLETED',
          examScore: 85,
          assignedCourse: 'Grade 1',
        },
      ]);
      expect(service.findAll).toHaveBeenCalledWith('ADMISSION_COMPLETED');
    });
  });
});
