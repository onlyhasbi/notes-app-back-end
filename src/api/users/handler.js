class UserHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async getUsersByUsernameHandler({ query }) {
    const { username = '' } = query;
    const users = await this._service.getUsersByUsername(username);
    return {
      status: 'success',  
      data: {
        users,
      },
    };
  }

  async postUserHandler({ payload }, h) {
    this._validator.validateUserPayload(payload);
    const userId = await this._service.addUser(payload);

    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: { userId },
    });

    response.code(201);
    return response;
  }

  async getUserByIdHandler({ params }) {
    const { id } = params;
    const user = await this._service.getUserById(id);
    return { status: 'success', data: { user } };
  }
}

module.exports = UserHandler;
