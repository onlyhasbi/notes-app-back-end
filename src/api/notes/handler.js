class NotesHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postNoteHandler({ payload }, h) {
    this._validator.validateNotePayload(payload);

    const { title = 'untitled', body, tags } = payload;
    const noteId = await this._service.addNote({ title, body, tags });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: { noteId },
    });

    response.code(201);
    return response;
  }

  async getNotesHandler() {
    const notes = await this._service.getNotes();
    return {
      status: 'success',
      data: {
        notes,
      },
    };
  }

  async getNoteByIdHandler({ params }, h) {
    const { id } = params;
    const note = await this._service.getNoteById(id);

    const response = h.response({
      status: 'success',
      data: { note },
    });

    response.code(200);
    return response;
  }

  async putNoteByIdHandler({ params, payload }) {
    this._validator.validateNotePayload(payload);

    const { id } = params;
    await this._service.editNoteById(id, payload);

    return {
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    };
  }

  async deleteNoteByIdHandler({ params }) {
    const { id } = params;
    await this._service.deleteNoteById(id);

    return {
      status: 'success',
      message: 'Catatan berhasil dihapus',
    };
  }
}

module.exports = NotesHandler;
