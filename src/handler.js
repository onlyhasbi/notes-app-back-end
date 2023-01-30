const { nanoid } = require("../node_modules/nanoid");
const notes = require("./notes");

function addNoteHandler(request, h) {
  const { title, tags, body } = request.payload;

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id,
    title,
    tags,
    body,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id);

  return isSuccess
    ? h
        .response({
          status:'success',
          message: "catatan berhasil ditambahkan",
          data: { noteId: id },
        })
        .code(201)
    : h
        .response({ status: "fail", message: "catatan gagal ditambahkan" })
        .code(500);
}

function getAllNotesHandler(reques, h) {
  return h.response({ data: { notes } }).code(200);
}

function getNoteByIdHandler(request, h) {
  const { id } = request.params;
  const note = notes.find((item) => item.id === id);
  return note
    ? h.response({ status: "success", data: { note } }).code(200)
    : h
        .response({
          data: { status: "fail", message: "Catatan tidak ditemukan" },
        })
        .code(404);
}

function editNoteByIdHandler(request, h) {
  const { id } = request.params;
  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    return h
      .response({
        status: "success",
        message: "Catatan berhasil diperbaharui",
      })
      .code(200);
  }

  return h
    .response({
      status: "fail",
      message: "Catatan tidak ditemukan",
    })
    .code(404);
}

function deleteNoteByIdHandler(request, h) {
  const { id } = request.params;
  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes.filter((note) => note.id !== index);
    return h
      .response({
        status: "success",
        message: "Catatan berhasil dihapus",
      })
      .code(201);
  }

  return h
    .response({
      status: "fail",
      message: "Id catatan tidak ditemukan",
    })
    .code(404);
}

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
