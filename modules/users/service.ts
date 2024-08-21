import { NotFoundError } from "../common/errors";
import { User, Users } from "./models";

interface IUserService {
  createUser({ user }: { user: User }): Promise<User>;
  getUserById({ userId }: { userId: string }): Promise<User>;
  getUserByUsername({ username }: { username: string }): Promise<User>;
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
  async getUserById({ userId }: { userId: string }): Promise<User> {
    try {
      const user = await Users.findOne<User>({ _id: userId });

      if (!user) {
        throw new NotFoundError(`User with id ${userId} not found`);
      }

      return user;
    } catch (error) {
      console.error(error);
      // Handle error
      throw error;
    }
  }

  async getUserByUsername({ username }: { username: string }): Promise<User> {
    try {
      const user = await Users.findOne<User>({ username });

      if (!user) {
        throw new NotFoundError(`User with username ${username} not found`);
      }

      return user;
    } catch (error) {
      console.error(error);
      // Handle error
      throw error;
    }
  }

  async createUser({ user }: { user: Omit<User, '_id'> }): Promise<User> {
    try {
      const newUser = new Users(user);
      await newUser.save();

      return newUser;
    } catch (error) {
      console.error(error);
      // Handle error
      throw error;
    }
  }

  async updateUser({
    userId,
    user,
  }: {
    userId: string;
    user: Partial<User>;
  }): Promise<User> {
    try {
      const updatedUser = await Users.findOneAndUpdate<User>(
        { _id: userId },
        { $set: user },
        { new: true }
      );

      if (!updatedUser) {
        throw new NotFoundError(`User with id ${userId} not found`);
      }

      return updatedUser;
    } catch (error) {
      console.error(error);
      // Handle error
      throw error
    }
  }

  async deleteUser({ userId }: { userId: string }): Promise<User> {
    try {
      const deletedUser = await Users.findOneAndDelete<User>({ _id: userId });

      if (!deletedUser) {
        throw new NotFoundError(`User with id ${userId} not found`);
      }

      return deletedUser;
    } catch (error) {
      console.error(error);
      // Handle error
      throw error;
    }
  }
}
