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
      await this.usersRepository.create(createUserDto),
    );
  }

  async find(): Promise<IUser[]> {
    return (await this.usersRepository.find({})).map(($user) =>
      this.usersRepository.format($user),
    );
  }

  me(user: IUser) {
    return user;
  }

  async findOne(findOneUserDto: FindOneUserDto): Promise<IUser> {
    const [$user]: $User[] = await this.usersRepository.find({
      _id: findOneUserDto.id,
    });
    if (!$user) throw new NotFoundException();
    return this.usersRepository.format($user);
  }

  async update(user: IUser, updateUserDto: UpdateUserDto): Promise<IUser> {
    const [$user]: $User[] = await this.usersRepository.find({ _id: user._id });
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
