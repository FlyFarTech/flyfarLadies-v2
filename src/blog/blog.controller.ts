import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, Res, HttpStatus, NotFoundException } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AlbumImage } from 'src/tourpackage/entities/albumimage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { User } from 'src/userProfile/entitties/user.entity';

@Controller('blog')
export class BlogController {
  constructor(
    @InjectRepository(Blog) private BlogRepo: Repository<Blog>,
    @InjectRepository(User) private UserRepository: Repository<User>,
    private readonly blogService: BlogService,
    private s3service: S3Service) {}

  @Post('/addblog')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'image1', maxCount: 2 },
    { name: 'image2', maxCount: 2},
    { name: 'image3', maxCount: 2 },
 ]))
  async Createblog(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() body,
    @Res() res: Response) {
    const { Title, Description,Blogfor,WrittenBy } = req.body;
    const coverimageurl = await this.s3service.Addimage(file)
    const blog = new Blog();
    blog.coverimage =coverimageurl
    blog.Title =Title
    blog.Description =Description
    blog.Blogfor =Blogfor
    blog.WrittenBy =WrittenBy
    await this.BlogRepo.save({...blog})
    return res.status(HttpStatus.OK).send({ status: "success", message: "blog created successfully", })
}


  @Get('myblogs')
  findAll(uuid:string) {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, updateBlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(+id);
  }
}
