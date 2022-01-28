import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UsersRepository } from '@root/users/users.repository';
import {
  CreateUserDto,
  FindOneUserDto,
  FindUsersDto,
  UpdateUserDto,
} from '@root/users/dto/users.dto';
import { $User, IUser } from '@root/users/interfaces/user.interface';
import { AuthService } from '@root/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const $users = await this.usersRepository.find({
      email: createUserDto.email,
    });

    if ($users.length) throw new ForbiddenException();

    createUserDto.password = await this.authService.hash(
      createUserDto.password,
    );

    return this.usersRepository.format(
      this.usersRepository.toJSON(
        await this.usersRepository.create(createUserDto),
      ),
    );
  }

  async find(findUserDto: FindUsersDto): Promise<IUser[]> {
    return (
      await this.usersRepository.find({}, findUserDto.offset, findUserDto.limit)
    ).map((userDocument) =>
      this.usersRepository.format(this.usersRepository.toJSON(userDocument)),
    );
  }

  me(user: IUser) {
    return user;
  }

  async findOne(findOneUserDto: FindOneUserDto): Promise<IUser> {
    const [userDocument] = await this.usersRepository.find({
      _id: findOneUserDto.id,
    });
    if (!userDocument) throw new NotFoundException();
    return this.usersRepository.format(
      this.usersRepository.toJSON(userDocument),
    );
  }

  async update(user: IUser, updateUserDto: UpdateUserDto): Promise<IUser> {
    const [userDocument] = await this.usersRepository.find({ _id: user._id });
    const $user: $User = this.usersRepository.toJSON(userDocument);
    if (
      !(await this.authService.validatePassword($user, updateUserDto.password))
    )
      throw new ForbiddenException();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...update } = updateUserDto;

    const $users = await this.usersRepository.find({
      email: updateUserDto.email,
    });

    if ($users.length) throw new ForbiddenException();

    await this.usersRepository.update({ _id: user._id }, update);
    const findOneUserDto: FindOneUserDto = { id: user._id };
    return this.findOne(findOneUserDto);
  }
}
