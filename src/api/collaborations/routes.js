const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: (request, h) => handler.postCollaborationHandler(request, h),
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: (request) => handler.deleteCollaborationHandler(request),
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

module.exports = routes;
