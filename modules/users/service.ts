import { User } from "./models";

interface IUserService {
  createUser({ user }: { user: User }): Promise<User>;
  getUser({ userId }: { userId: string }): Promise<User>;
  updateUser({
    userId,
    user,
  }: {
    userId: string;
    user: Partial<User>;
  }): Promise<User>;
  deleteUser({ userId }: { userId: string }): Promise<User>;
}

export class UserService implements IUserService {
  getUser({ userId }: { userId: string }): Promise<User> {
    throw new Error("Method not implemented.");
  }

  createUser({ user }: { user: User }): Promise<User> {
    throw new Error("Method not implemented.");
  }

  updateUser({
    userId,
    user,
  }: {
    userId: string;
    user: Partial<User>;
  }): Promise<User> {
    throw new Error("Method not implemented.");
  }

  deleteUser({ userId }: { userId: string }): Promise<User> {
    throw new Error("Method not implemented.");
  }
}
