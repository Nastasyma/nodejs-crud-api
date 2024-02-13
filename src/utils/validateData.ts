import { IUser } from '../types/inteface';

export const isValidUserData = (user: IUser) => {
  return (
    typeof user === 'object' &&
    typeof user.username === 'string' &&
    typeof user.age === 'number' &&
    Array.isArray(user.hobbies) &&
    user.hobbies.every((hobby) => typeof hobby === 'string') &&
    user.username.trim() &&
    user.age.toString().trim()
  );
};
