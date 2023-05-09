import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, Res, HttpStatus } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AlbumImage } from 'src/tourpackage/entities/albumimage.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

@Controller('blog')
export class BlogController {
  constructor(
    @InjectRepository(Blog) private BlogRepo: Repository<Blog>,
    private readonly blogService: BlogService,
    private s3service: S3Service) {}

  @Post('addblog')
  @Post('Addpackage')
  @UseInterceptors(
    FileInterceptor('url'),
  )
  async AddTravelPackage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body() body,
    @Res() res: Response) {
    const { Title, Description, Name, Date } = req.body;
    const coverimageurl = await this.s3service.Addimage(file)
    const blog = new Blog();
    blog.coverimage =coverimageurl
    blog.Title =Title
    blog.Description =Description
    blog.Date=Date
    blog.Name =Name
    await this.BlogRepo.save(blog)
    return res.status(HttpStatus.OK).send({ status: "success", message: "blog created successfully", })
}


  @Get()
  findAll() {
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
