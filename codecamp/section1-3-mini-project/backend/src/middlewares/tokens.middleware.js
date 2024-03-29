import coolsmsSDK from 'coolsms-node-sdk';
import 'dotenv/config';

import TokenModel from '../models/token.model.js';

export const checkPhone = (req, res, next) => {
  const { phone } = req.body;
  if (phone === undefined || (phone.length !== 11 && phone.length !== 10)) {
    res.status(422).send('휴대폰 번호를 정확히 입력해주세요');
  }
  return next();
};

export const getToken = (_, res, next) => {
  const size = 6;
  res.locals.token = String(Math.floor(Math.random() * 10 ** size)).padStart(
    size,
    '0'
  );
  return next();
};

export const sendTokenToSMS = async (req, res, next) => {
  try {
    const Coolsms = coolsmsSDK.default;
    const messageService = new Coolsms(
      process.env.SMS_API_KEY,
      process.env.SMS_API_SECRET
    );
    await messageService.sendOne({
      to: req.body.phone,
      from: process.env.SMS_SENDER,
      text: `인증번호는 ${res.locals.token}입니다.`,
    });
    return next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const compareTokenInDB = async (req, res, next) => {
  try {
    const { phone, token } = req.body;
    const exTokenInfo = await TokenModel.findOne({ phone });

    if (!exTokenInfo || token !== exTokenInfo.token) {
      return res.status(422).send('false');
    }
    res.locals.tokenInfo = exTokenInfo;
    delete req.body.token;
    next();
  } catch (error) {
    console.error(error);
    next(error);
  }
};
