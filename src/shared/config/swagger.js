// filepath: d:\\Users\\moham\\Documents\\gestion_PFE\\src\\shared\\config\\swagger.js
import swaggerJSDoc from 'swagger-jsdoc';

// OpenAPI base specification and reusable components
const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'PFE Management API',
    version: '1.0.0',
    description:
      'REST API for PFE management: authentication, users, projects, and sprints. This documentation follows the OpenAPI 3.0 specification.',
  },
  servers: [
    {
      url: 'http://localhost:{port}/api',
      description: 'Local server',
      variables: {
        port: {
          default: '3000',
        },
      },
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication and authorization' },
    { name: 'Users', description: 'User profile and helpers' },
    { name: 'Projects', description: 'Project management' },
    { name: 'Sprints', description: 'Sprint management' },
    { name: 'User Stories', description: 'User story management' }

  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          error: { type: 'string', example: 'Invalid or expired token' },
          details: {
            type: 'array',
            items: { type: 'string' },
            example: ['email is required', 'password must be at least 6 characters'],
          },
        },
      },
      // Auth payloads
      StudentSignupRequest: {
        type: 'object',
        required: [
          'fullName',
          'phoneNumber',
          'email',
          'password',
          'role',
          'cin',
          'studentIdCardIMG',
          'degree',
          'degreeType',
          'companyName',
          'uniSupervisorId',
          'compSupervisorId',
        ],
        properties: {
          fullName: { type: 'string', example: 'John Doe' },
          phoneNumber: { type: 'string', example: '+21612345678' },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          password: { type: 'string', format: 'password', example: 'P@ssw0rd!' },
          role: { type: 'string', enum: ['Student'], example: 'Student' },
          cin: { type: 'string', example: '12345678' },
          studentIdCardIMG: { type: 'string', example: 'https://files.example.com/uni-card.png' },
          degree: { type: 'string', enum: ['Bachelor', 'Master', 'Engineer'], example: 'Engineer' },
          degreeType: { type: 'string', example: 'INLOG' },
          companyName: { type: 'string', example: 'Acme Corp' },
          uniSupervisorId: { type: 'string', example: '665f1f77bcf86cd799439011' },
          compSupervisorId: { type: 'string', example: '775f1f77bcf86cd799439022' },
        },
      },
      CompanySupervisorSignupRequest: {
        type: 'object',
        required: ['fullName', 'phoneNumber', 'email', 'password', 'role', 'companyName', 'badgeIMG'],
        properties: {
          fullName: { type: 'string' },
          phoneNumber: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
          role: { type: 'string', enum: ['CompSupervisor'], example: 'CompSupervisor' },
          companyName: { type: 'string' },
          badgeIMG: { type: 'string' },
        },
      },
      UniversitySupervisorSignupRequest: {
        type: 'object',
        required: ['fullName', 'phoneNumber', 'email', 'password', 'role', 'badgeIMG'],
        properties: {
          fullName: { type: 'string' },
          phoneNumber: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
          role: { type: 'string', enum: ['UniSupervisor'], example: 'UniSupervisor' },
          badgeIMG: { type: 'string' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', format: 'password' },
        },
      },
      VerifyEmailQuery: {
        type: 'object',
        required: ['token'],
        properties: { token: { type: 'string' } },
      },
      PasswordResetRequest: {
        type: 'object',
        required: ['email'],
        properties: { email: { type: 'string', format: 'email' } },
      },
      PasswordReset: {
        type: 'object',
        required: ['resetToken', 'newPassword'],
        properties: {
          resetToken: { type: 'string' },
          newPassword: { type: 'string', format: 'password' },
        },
      },
      PasswordChange: {
        type: 'object',
        required: ['currentPassword', 'newPassword'],
        properties: {
          currentPassword: { type: 'string', format: 'password' },
          newPassword: { type: 'string', format: 'password' },
        },
      },
      // Projects
      Project: {
        type: 'object',
        required: ['title', 'startDate', 'endDate'],
        properties: {
          title: { type: 'string', example: 'E-Commerce Platform Development' },
          description: { type: 'string', example: 'Build an e-commerce platform with React and Node.js' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          contributors: {
            type: 'array',
            items: { type: 'string' },
            description: 'Optional array of student IDs to add as contributors',
          },
        },
      },
      AddRemoveContributors: {
        type: 'object',
        required: ['projectId', 'studentIds'],
        properties: {
          projectId: { type: 'string', example: '507f1f77bcf86cd799439011' },
          studentIds: {
            type: 'array',
            items: { type: 'string' },
            example: ['665f1f77bcf86cd799439011', '665f1f77bcf86cd799439012'],
          },
        },
      },
      // User Story Schemas
  UserStory: {
    type: 'object',
    required: ['storyName', 'priority', 'storyPointEstimate', 'startDate', 'dueDate', 'sprintId'],
    properties: {
      userStoryId: { 
        type: 'string', 
        example: '507f1f77bcf86cd799439011',
        description: 'Unique identifier of the user story'
      },
      storyName: { 
        type: 'string', 
        example: 'User Authentication System',
        description: 'Name of the user story'
      },
      description: { 
        type: 'string', 
        example: 'As a user, I want to log in securely so that I can access my account',
        description: 'Detailed description of the user story'
      },
      priority: {
        type: 'string',
        enum: ['highest', 'high', 'medium', 'low', 'lowest'],
        example: 'high',
        description: 'Priority level of the user story'
      },
      storyPointEstimate: {
        type: 'number',
        minimum: 0,
        example: 8,
        description: 'Story points estimate for the user story'
      },
      startDate: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z',
        description: 'Start date of the user story'
      },
      dueDate: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T00:00:00.000Z',
        description: 'Due date of the user story'
      },
      sprintId: {
        type: 'string',
        example: '507f1f77bcf86cd799439012',
        description: 'ID of the sprint this user story belongs to'
      },
      sprint: {
        type: 'object',
        description: 'Populated sprint information',
        properties: {
          sprintId: { type: 'string' },
          title: { type: 'string', example: 'Sprint 1' },
          goal: { type: 'string', example: 'Complete MVP features' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          orderIndex: { type: 'number', example: 1 }
        }
      },
      tasks: {
        type: 'array',
        description: 'List of tasks associated with this user story',
        items: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            taskName: { type: 'string' },
            status: { type: 'string' },
            priority: { type: 'string' }
          }
        }
      },
      tasksCount: {
        type: 'number',
        example: 3,
        description: 'Number of tasks in this user story'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Creation timestamp'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Last update timestamp'
      }
    }
  },

  CreateUserStoryRequest: {
    type: 'object',
    required: ['storyName', 'priority', 'storyPointEstimate', 'startDate', 'dueDate', 'sprintId'],
    properties: {
      storyName: { 
        type: 'string', 
        example: 'User Authentication System' 
      },
      description: { 
        type: 'string', 
        example: 'As a user, I want to log in securely' 
      },
      priority: {
        type: 'string',
        enum: ['highest', 'high', 'medium', 'low', 'lowest'],
        example: 'high'
      },
      storyPointEstimate: {
        type: 'number',
        minimum: 0,
        example: 8
      },
      startDate: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-01T00:00:00.000Z'
      },
      dueDate: {
        type: 'string',
        format: 'date-time',
        example: '2025-01-15T00:00:00.000Z'
      },
      sprintId: {
        type: 'string',
        example: '507f1f77bcf86cd799439012'
      }
    }
  },
  UpdateUserStoryRequest: {
    type: 'object',
    properties: {
      storyName: { type: 'string' },
      description: { type: 'string' },
      priority: {
        type: 'string',
        enum: ['highest', 'high', 'medium', 'low', 'lowest']
      },
      storyPointEstimate: {
        type: 'number',
        minimum: 0
      },
      startDate: {
        type: 'string',
        format: 'date-time'
      },
      dueDate: {
        type: 'string',
        format: 'date-time'
      },
      sprintId: {
        type: 'string',
        description: 'Change the sprint of this user story'
      }
    }
  }
    },
    responses: {
      BadRequest: {
        description: 'Bad Request',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      Unauthorized: {
        description: 'Unauthorized',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      Forbidden: {
        description: 'Forbidden',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      NotFound: {
        description: 'Not Found',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
      InternalServerError: {
        description: 'Internal Server Error',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  // Scan route files for JSDoc OpenAPI annotations
  apis: [
    'src/modules/**/*.routes.js',
  ],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
