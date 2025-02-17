import { Args, Mutation, Query, Resolver, Int } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';
import { Post } from './models/post.model';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private prisma: PrismaService) {}

  @Query(() => [Post])
  async posts() {
    return this.prisma.post.findMany({
      select: {
        id: true,
        title: true,
      },
    });
  }

  @Mutation(() => Post)
  async createPost(@Args('title') title: string) {
    return this.prisma.post.create({
      data: { title },
      select: {
        id: true,
        title: true,
      },
    });
  }

  // ✅ `id` の型を `Int` に修正
  @Mutation(() => Boolean, { nullable: false })
  async removePost(@Args('id', { type: () => Int }) id: number) { 
    console.log("Received ID:", id); // ✅ 確認のためのログ

    try {
      await this.prisma.post.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw new Error(`Failed to delete post: ${error.message}`);
    }
  }
}
