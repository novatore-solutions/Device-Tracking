const preparePayload = (payload, defaultMessage, defaultStatusCode) => {
  let data = {
    statusCode: defaultStatusCode,
  };

  if (!payload) {
    data.message = defaultMessage;
  } else if (typeof payload === 'string') {
    data.message = payload;
  } else {
    data = {
      message: defaultMessage,
      ...payload,
    };
  }

  return data;
};

class HttpError extends Error {
  constructor(payload = {}) {
    super();

    const { statusCode, ...rest } = payload;

    this.data = { success: false, ...rest };
    this.statusCode = statusCode;
    this.message = payload.message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class Http400Error extends HttpError {
  constructor(payload) {
    super(preparePayload(payload, 'Bad request', 400));
  }
}

class Http401Error extends HttpError {
  constructor(payload) {
    super(preparePayload(payload, 'Unauthorized', 401));
  }
}

class Http403Error extends HttpError {
  constructor(payload) {
    super(preparePayload(payload, 'Forbidden', 403));
  }
}

class Http404Error extends HttpError {
  constructor(payload) {
    super(preparePayload(payload, 'Not found', 404));
  }
}

class Http409Error extends HttpError {
  constructor(payload) {
    super(preparePayload(payload, 'Conflict', 409));
  }
}

class Http419Error extends HttpError {
  constructor(payload) {
    super(preparePayload(payload, 'Expired', 419));
  }
}

module.exports = {
  HttpError,
  Http400Error,
  Http401Error,
  Http403Error,
  Http404Error,
  Http409Error,
  Http419Error,
};
