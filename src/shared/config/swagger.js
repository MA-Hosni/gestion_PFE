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
