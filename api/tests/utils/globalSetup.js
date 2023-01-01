const { dbConnect, dbDisconnect } = require('./dbHandler');

beforeAll(() => {
  dbConnect();
});

afterAll(() => {
  dbDisconnect();
});
