export const userPaths = {
  '/api/v1/users': {
    post: {
      summary: 'Create a new user',
      tags: ['Users'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'password'],
              properties: {
                name: {
                  type: 'string',
                },
                email: {
                  type: 'string',
                },
                password: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      responses: {
        '201': {
          description: 'User registered successfully',
        },
      },
    },
    get: {
      summary: 'Retrieve a list of users',
      tags: ['Users'],
      responses: {
        '200': {
          description: 'Users retrieved successfully',
        },
      },
    },
  },
};
