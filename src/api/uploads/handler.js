class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUploadImageHandler({ payload }, h) {
    const { data } = payload;
    this._validator.validateImageHeaders(data.hapi.headers);

    const fileLocation = await this._service.writeFile(data, data.hapi);

    const response = h.response({
      status: 'success',
      data: {
        fileLocation,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
