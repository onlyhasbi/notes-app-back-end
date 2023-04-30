class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postNoteHandler({ auth, payload }, h) {
    this._validator.validateNotePayload(payload);

    const { title = 'untitled', body, tags } = payload;
    const { id: credentialId } = auth.credentials;

    const noteId = await this._service.addNote({
      title,
      body,
      tags,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: { noteId },
    });

    response.code(201);
    return response;
  }

  async getNotesHandler({ auth }) {
    const { id: credentialId } = auth.credentials;
    const notes = await this._service.getNotes(credentialId);
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler({ auth, params }, h) {
    const { id } = params;
    const { id: credentialId } = auth.credentials;

    await this._service.verifyNoteAccess(id, credentialId);
    const note = await this._service.getNoteById(id);

    const response = h.response({
      status: 'success',
      data: { note },
    });

    response.code(200);
    return response;
  }

  async putNoteByIdHandler({ auth, params, payload }) {
    this._validator.validateNotePayload(payload);

    const { id } = params;
    const { id: credentialId } = auth.credentials;

    await this._service.verifyNoteAccess(id, credentialId);
    await this._service.editNoteById(id, payload);

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deleteNoteByIdHandler({ auth, params }) {
    const { id } = params;
    const { id: credentialId } = auth.credentials;

    await this._service.verifyNoteOwner(id, credentialId);
    await this._service.deleteNoteById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = NotesHandler;
