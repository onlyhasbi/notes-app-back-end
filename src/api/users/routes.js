const routes = (handler) => [
  {
    method: 'GET',
    path: '/users',
    handler: (request) => handler.getUsersByUsernameHandler(request),
  },
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.postUserHandler(request, h),
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: (request) => handler.getUserByIdHandler(request),
  },
];

module.exports = routes;
