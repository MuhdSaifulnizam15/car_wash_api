const { v4: uuidv4 } = require('uuid');

const generateShortUUID = () => {
  return uuidv4().replace(/-/g, '').slice(0, 4);
}

module.exports = {
  generateShortUUID,
}