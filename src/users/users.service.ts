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
import { Observable, tap, switchMap, from, map, toArray } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  create(createUserDto: CreateUserDto): Observable<IUser> {
    return this.usersRepository.rxFind({ email: createUserDto.email }).pipe(
      tap((usersDocument) => {
        if (usersDocument.length) throw new ForbiddenException();
      }),
      switchMap(() => this.authService.rxHash(createUserDto.password)),
      switchMap((hashed: string) =>
        this.usersRepository.rxCreate({
          ...createUserDto,
          password: hashed,
        }),
      ),
      map((userDocument) => this.usersRepository.toJSON(userDocument)),
      map(($user: $User) => this.usersRepository.format($user)),
    );
  }

  find(findUsersDto: FindUsersDto): Observable<IUser[]> {
    return this.usersRepository
      .rxFind({}, findUsersDto.offset, findUsersDto.limit)
      .pipe(
        switchMap((usersDocument) => from(usersDocument)),
        map((userDocument) => this.usersRepository.toJSON(userDocument)),
        map(($user: $User) => this.usersRepository.format($user)),
        toArray(),
      );
  }

  me(user: IUser) {
    return user;
  }

  findOne(findOneUserDto: FindOneUserDto): Observable<IUser> {
    return this.usersRepository.rxFind({ _id: findOneUserDto.id }).pipe(
      tap(([userDocument]) => {
        if (!userDocument) throw new NotFoundException();
      }),
      map(([userDocument]) => this.usersRepository.toJSON(userDocument)),
      map(($user: $User) => this.usersRepository.format($user)),
    );
  }

  update(user: IUser, updateUserDto: UpdateUserDto): Observable<IUser> {
    return this.usersRepository.rxFind({ _id: user._id }).pipe(
      map(([userDocument]) => this.usersRepository.toJSON(userDocument)),
      switchMap(($user: $User) =>
        this.authService.rxValidatePassword($user, updateUserDto.password),
      ),
      tap((isValidPassword: boolean) => {
        if (!isValidPassword) throw new ForbiddenException();
      }),
      switchMap(() =>
        this.usersRepository.rxFind({ email: updateUserDto.email }),
      ),
      tap((usersDocument) => {
        if (usersDocument.length) throw new ForbiddenException();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...update } = updateUserDto;
        this.usersRepository.rxUpdate({ _id: user._id }, update);
      }),
      map(() => ({ id: user._id })),
      switchMap((findOneUserDto) => this.findOne(findOneUserDto)),
    );
  }
}
