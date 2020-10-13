import UserService from '../services/user.service';
import messages from '../utils/customMessage';
import helpers from '../utils/helpers';
import responses from '../utils/responses';
import statusCode from '../utils/statusCode';

const { getUserByIdOrEmail } = UserService;
const { errorResponse } = responses;
const { loginFail, userExist } = messages;
const { badRequest } = statusCode;
const { comparePassword } = helpers;

const checkEmailExist = (email) => {
  return getUserByIdOrEmail(email);
};

const userDuplicationAccount = async (req, res, next) => {
  const user = await checkEmailExist(req.body.email);
  if (!user) {
    return next();
  }
  return errorResponse(res, badRequest, userExist);
};

const checkLoginCredentials = async (req, res, next) => {
  const user = await checkEmailExist(req.body.email);
  const boolPassword = user
    ? await comparePassword(req.body.password, user.password)
    : null;
  if (!user || !boolPassword) {
    return errorResponse(res, badRequest, loginFail);
  }
  return next();
};

export default {
  userDuplicationAccount,
  checkLoginCredentials,
};