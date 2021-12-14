import { genSalt, hash } from 'bcrypt';

import { UsersRepository } from '@root/users/users.repository';
import { User } from '@root/users/schemas/user.schema';

export const _users: User[] = [
  { email: 'example1@mail.com', name: 'example1', password: 'password1' },
  { email: 'example2@mail.com', name: 'example2', password: 'password2' },
];

export async function createUsers(
  usersRepository: UsersRepository,
  user: User,
) {
  const salt = await genSalt(10);

  return await usersRepository.create({
    ...user,
    password: await hash(user.password, salt),
  });
}
