export default [
  {
    method: 'GET',
    path: '/events',
    handler: 'eventController.index',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/config.json',
    handler: 'configController.index',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/services.json',
    handler: 'servicesController.index',
    config: {
      policies: [],
      auth: false,
    },
  },
];
