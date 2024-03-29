'use strict';

const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    const message = encodeURIComponent('로그인한 상태입니다.');
    res.redirect(`/?error${message}`);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.',
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.',
    });
  }
};

exports.apiLimiter = RateLimit({
  windowMs: 60 * 1000,
  max: 1,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.status,
      message:
        'free 사용자는 1분에 1회 요청 가능합니다. premium 사용자는 10회 요청 가능합니다.',
    });
  },
});

exports.apiLimiterFree = RateLimit({
  windowMs: 60 * 1000,
  max: 1,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.status,
      message:
        'free 사용자는 1분에 1회 요청 가능합니다. premium 사용자는 10회 요청 가능합니다.',
    });
  },
});

exports.apiLimiterPremium = RateLimit({
  windowMs: 60 * 1000,
  max: 10,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.status,
      message: 'premium 사용자는 1분 10회 요청 가능합니다.',
    });
  },
});

exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
  });
};
