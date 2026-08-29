export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface ILoginUserResponse {
  accessToken: string;
  user: Partial<IUser>;
}
