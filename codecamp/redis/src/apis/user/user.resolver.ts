import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Cache } from 'cache-manager';
import { CreateUserInput } from './dto/craeteUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Query(() => [User])
  fetchUsers() {
    return this.userService.find();
  }

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput, //
  ) {
    await this.cacheManager.set('aaa', createUserInput, {
      ttl: 0,
    });

    const result = await this.cacheManager.get('aaa');

    console.log(result);

    return result;
    // return this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  updateUser(
    @Args('userId') userId: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput, //
  ) {
    return this.userService.update({ id: userId, updateUserInput });
  }

  @Mutation(() => String)
  deleteUser(
    @Args('userId') userId: string, //
  ) {
    return this.userService.delete({ id: userId });
  }
}
