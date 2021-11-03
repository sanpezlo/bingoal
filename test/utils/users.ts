import { genSalt, hash } from 'bcrypt';

import { UsersRepository } from '@root/users/users.repository';
import { User } from '@root/users/schemas/user.schema';

export const $users: User[] = [
  { email: 'example1@mail.com', name: 'example1', password: 'password' },
];

export async function createUsers(usersRepository: UsersRepository) {
  const salt = await genSalt(10);

  for (const $user of $users) {
    await usersRepository.create({
      ...$user,
      password: await hash($user.password, salt),
    });
  }
}
