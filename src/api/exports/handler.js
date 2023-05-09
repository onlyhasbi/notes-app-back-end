const { Pool } = require('pg');

class ExportsHandler {
  constructor(service, validator) {
    this._pool = new Pool();
    this._service = service;
    this._validator = validator;
  }

  async postExportNotesHandler({ auth, payload }, h) {
    this._validator.validateExportNotesPayload(payload);
    const { id: userId } = auth.credentials;

    const message = {
      userId,
      targetEmail: payload.targetEmail,
    };

    await this._service.sendMessage('export:notes', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan anda dalam antrian',
    });

    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
