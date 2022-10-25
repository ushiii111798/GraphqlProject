import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { ImagesService } from './images.service';

@Resolver()
export class ImagesResolver {
  constructor(private readonly imagesService: ImagesService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => [String], {
    description: 'Image Upload, return Google Storage URL / Permission Needed',
  })
  async uploadImage(
    @Args({ name: 'images', type: () => [GraphQLUpload] }) images: FileUpload[],
  ) {
    const imageURL = await this.imagesService.upload({ images });
    await this.imagesService.savingImage({ images: imageURL });
    return imageURL;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean, {
    description: 'Image Delete, Permanent / Permission Needed',
  })
  async deleteImage(@Args('imageId') imageId: string) {
    return await this.imagesService.delete({ imageId });
  }
}
