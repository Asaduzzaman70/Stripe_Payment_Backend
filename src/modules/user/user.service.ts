import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../config/config';
import AppError from '../../utils/AppError';
import { ILoginUser, ILoginUserResponse, IUser } from './user.interface';
import { User } from './user.model';

const createUserIntoDB = async (payload: IUser) => {
  const isUserExist = await User.findOne({ email: payload.email.toLowerCase() });
  if (isUserExist) {
    throw new AppError(400, 'User already exists with this email address');
  }

  const result = await User.create(payload);
  return result;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const user = await User.findOne({ email: payload.email.toLowerCase() }).select('+password');
  if (!user) {
    throw new AppError(404, 'User does not exist');
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password as string);
  if (!isPasswordMatch) {
    throw new AppError(401, 'Password does not match');
  }

  const jwtPayload = {
    userId: user._id ? user._id.toString() : '',
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: config.jwt_expires_in as any,
  });

  const userObj = user.toObject();
  delete userObj.password;

  return {
    accessToken,
    user: userObj,
  };
};

const getAllUsersFromDB = async () => {
  const result = await User.find();
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(404, 'User not found');
  }
  return result;
};

export const UserService = {
  createUserIntoDB,
  loginUser,
  getAllUsersFromDB,
  getSingleUserFromDB,
};
