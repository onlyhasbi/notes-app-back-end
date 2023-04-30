class CollaborationsHandler {
  constructor(collaborationService, noteService, validator) {
    this._collaborationService = collaborationService;
    this._noteService = noteService;
    this._validator = validator;
  }

  async postCollaborationHandler({ auth, payload }, h) {
    this._validator.validateCollaborationPayload(payload);
    const { id: credentialId } = auth.credentials;
    const { noteId, userId } = payload;
    await this._noteService.verifyNoteOwner(noteId, credentialId);
    const collaborationId = await this._collaborationService.addCollaboration(
      noteId,
      userId
    );

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCollaborationHandler({ auth, payload }) {
    this._validator.validateCollaborationPayload(payload);
    const { id: credentialId } = auth.credentials;
    const { noteId, userId } = payload;

    await this._noteService.verifyNoteOwner(noteId, credentialId);
    await this._collaborationService.deleteCollaboration(noteId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
