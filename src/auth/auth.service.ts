import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, genSalt, hash } from 'bcrypt';
import {
  Observable,
  from,
  concatMap,
  of,
  map,
  switchMap,
  tap,
  catchError,
  throwError,
  switchMapTo,
  mapTo,
} from 'rxjs';

import {
  IAuth,
  $RefreshPayload,
  $AccessPayload,
} from '@root/auth/interfaces/auth.interface';
import { TokensRepository } from '@root/auth/tokens.repository';
import { UsersRepository } from '@root/users/users.repository';
import { IUser, $User } from '@root/users/interfaces/user.interface';
import { RefreshDto, UpdatePasswordDto } from '@root/auth/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private tokensRepository: TokensRepository,
    @Inject(forwardRef(() => UsersRepository))
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  login(user: IUser): Observable<IAuth> {
    return of({ sub: user._id }).pipe(
      switchMap(($accessPayload: $AccessPayload) =>
        this.createAccessToken($accessPayload),
      ),
      switchMap((accessToken) =>
        this.tokensRepository.create({ user: user._id }).pipe(
          map((tokenDocument) => this.tokensRepository.toJSON(tokenDocument)),
          map(($token) => ({
            sub: user._id.toString(),
            jti: $token._id.toString(),
          })),
          switchMap(($refreshPayload: $RefreshPayload) =>
            this.createRefreshToken($refreshPayload),
          ),
          map((refreshToken) => ({
            token_type: 'Bearer',
            access_token: accessToken,
            expires_in: this.configService.get<number>(
              'token.access.expires_in',
            ),
            refresh_token: refreshToken,
            refresh_token_expires_in: this.configService.get<number>(
              'token.refresh.expires_in',
            ),
          })),
        ),
      ),
    );
  }

  refresh(refreshDto: RefreshDto): Observable<IAuth> {
    return from(
      this.jwtService.verifyAsync<$RefreshPayload>(refreshDto.refresh, {
        secret: this.configService.get<string>('token.refresh.secret'),
        ignoreExpiration: false,
      }),
    ).pipe(
      switchMap(($refreshPayload: $RefreshPayload) =>
        this.tokensRepository.find({
          _id: $refreshPayload.jti,
          user: $refreshPayload.sub,
        }),
      ),
      tap(([tokenDocument]) => {
        if (!tokenDocument) throw new UnauthorizedException();
      }),
      map(([tokenDocument]) => ({
        sub: tokenDocument.user.toString(),
        jti: tokenDocument._id.toString(),
      })),
      switchMap(($refreshPayload: $RefreshPayload) =>
        this.createRefreshToken($refreshPayload).pipe(
          switchMap((refreshToken) =>
            this.createAccessToken({ sub: $refreshPayload.sub }).pipe(
              map((accessToken) => ({
                token_type: 'Bearer',
                access_token: accessToken,
                expires_in: this.configService.get<number>(
                  'token.access.expires_in',
                ),
                refresh_token: refreshToken,
                refresh_token_expires_in: this.configService.get<number>(
                  'token.refresh.expires_in',
                ),
              })),
            ),
          ),
        ),
      ),
      catchError(() =>
        of<$RefreshPayload>(
          this.jwtService.decode(refreshDto.refresh) as $RefreshPayload,
        ).pipe(
          tap(($refreshPayload) =>
            this.tokensRepository.delete({ _id: $refreshPayload.jti }),
          ),
          switchMap(() =>
            throwError(
              () =>
                new BadRequestException(['refresh must be a valid jwt string']),
            ),
          ),
        ),
      ),
    );
  }

  validateLocal(email: string, password: string) {
    return this.usersRepository.find({ email }).pipe(
      tap(([userDocument]) => {
        if (!userDocument) throw new UnauthorizedException();
      }),
      map(([userDocument]) => this.usersRepository.toJSON(userDocument)),
      switchMap(($user) =>
        this.isValidatedPassword($user, password).pipe(
          tap((isValid) => {
            if (!isValid) throw new UnauthorizedException();
          }),
          mapTo($user),
        ),
      ),
      map(($user) => this.usersRepository.format($user)),
    );
  }

  validateJwt(sub: string): Observable<IUser> {
    return this.usersRepository.find({ _id: sub }).pipe(
      tap(([userDocument]) => {
        if (!userDocument) throw new UnauthorizedException();
      }),
      map(([userDocument]) => this.usersRepository.toJSON(userDocument)),
      map(($user) => this.usersRepository.format($user)),
    );
  }

  isValidatedPassword(user: $User, password: string): Observable<boolean> {
    return from(compare(password, user.password));
  }

  hash(password: string): Observable<string> {
    return from(genSalt(10)).pipe(
      concatMap((salt) => from(hash(password, salt))),
    );
  }

  createAccessToken(accessPayload: $AccessPayload): Observable<string> {
    return from(this.jwtService.signAsync(accessPayload));
  }

  createRefreshToken($refreshPayload: $RefreshPayload): Observable<string> {
    return from(
      this.jwtService.signAsync($refreshPayload, {
        secret: this.configService.get<string>('token.refresh.secret'),
        expiresIn: this.configService.get<number>('token.refresh.expires_in'),
      }),
    );
  }

  updatePassword(
    user: IUser,
    updatePasswordDto: UpdatePasswordDto,
  ): Observable<IAuth> {
    return this.usersRepository.find({ _id: user._id }).pipe(
      map(([userDocument]) => this.usersRepository.toJSON(userDocument)),
      switchMap(($user) =>
        this.isValidatedPassword($user, updatePasswordDto.password).pipe(
          tap((isValidPassword) => {
            if (!isValidPassword) throw new ForbiddenException();
          }),
        ),
      ),
      switchMap(() => this.hash(updatePasswordDto.newPassword)),
      tap((newPassword) =>
        this.usersRepository.update(
          { _id: user._id },
          { password: newPassword },
        ),
      ),
      tap(() => this.tokensRepository.delete({ user: user._id })),
      switchMapTo(this.login(user)),
    );
  }
}
