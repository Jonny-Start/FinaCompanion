const newMessage = (type, messagePush, req) => {
  req.session.message ? "" : clearMessage(req);

  switch (type) {
    case "error":
      req.session.message.error
        ? req.session.message.error.push(messagePush)
        : (req.session.message.error = [messagePush]);
        
      break;
    case "success":
      req.session.message.success
        ? req.session.message.success.push(messagePush)
        : (req.session.message.success = [messagePush]);

      break;
    default:
      req.session.message.info.push(message);
      break;
  }
  return;
};

const clearMessage = (req) => {
  return (req.session.message = { error: [], success: [] });
};

module.exports = { newMessage, clearMessage };
