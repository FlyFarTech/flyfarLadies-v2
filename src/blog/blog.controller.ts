
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Req, Res, HttpStatus, NotFoundException, UploadedFiles } from '@nestjs/common';
import { BlogService } from './blog.service';
import { UpdateBlogDto } from './dto/update-blog.dto';
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
    private readonly blogService: BlogService,
    private s3service: S3Service) {}

  @Post('/addblog')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'Image1', maxCount: 2 },
    { name: 'Image2', maxCount: 2},
    { name: 'Image3', maxCount: 2 },
    { name: 'Image4', maxCount: 2 },
    { name: 'Image5', maxCount: 2 },
 ]))
  async Createblog(
    @UploadedFiles()
    file: {
      Image1?: Express.Multer.File[],
      Image2?: Express.Multer.File[],
      Image3?: Express.Multer.File[],
      Image4?: Express.Multer.File[] ,
      Image5?: Express.Multer.File[]},
    @Req() req: Request,
    @Body() body,
    @Res() res: Response) {
    const { Title, Description,Blogfor,WrittenBy } = req.body;
    const image1 = await this.s3service.Addimage(file.Image1[0])
    const image2 = await this.s3service.Addimage(file.Image2[0])
    const image3 = await this.s3service.Addimage(file.Image3[0])
    const image4 = await this.s3service.Addimage(file.Image4[0])
    const image5 = await this.s3service.Addimage(file.Image5[0])
    const blog = new Blog();
    blog.Image1 =image1
    blog.Image2 =image2
    blog.Image3 =image3
    blog.Image4 =image4
    blog.Image5=image5
    blog.Title =Title
    blog.Description =Description
    blog.Blogfor =Blogfor
    blog.WrittenBy =WrittenBy
    await this.BlogRepo.save({...blog})
    return res.status(HttpStatus.OK).send({ status: "success", message: "blog created successfully", })
}

@Patch('update/:blogid')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'Image1', maxCount: 1 },
  { name: 'Image2', maxCount: 1},
  { name: 'Image3', maxCount: 1 },
  { name: 'Image4', maxCount: 1 },
  { name: 'Image5', maxCount: 1 },
]))
async updateimage(
  @UploadedFiles()
  file: {
    Image1?: Express.Multer.File[],
    Image2?: Express.Multer.File[],
    Image3?: Express.Multer.File[],
    Image4?: Express.Multer.File[] ,
    Image5?: Express.Multer.File[]},
  @Req() req: Request,
  @Param ('blogid')blogid:string,
  @Body() body,
  @Res() res: Response) {
  const image1 = file.Image1? await this.s3service.updateBlogIMages(blogid,file.Image1[0]):null
  const image2 = file.Image2? await this.s3service.updateBlogIMages(blogid,file.Image2[0]):null
  const image3 = file.Image3? await this.s3service.updateBlogIMages(blogid,file.Image3[0]):null
  const image4 = file.Image4? await this.s3service.updateBlogIMages(blogid,file.Image4[0]):null
  const image5 = file.Image5? await this.s3service.updateBlogIMages(blogid,file.Image5[0]):null
  const blog = new Blog();
  if(image1) blog.Image1 =image1
  if(image2) blog.Image2 =image2
  if(image3) blog.Image3 =image3
  if(image4) blog.Image4 =image4
  if(image5) blog.Image5 =image5
  await this.BlogRepo.update({blogid},{...blog})
  return res.status(HttpStatus.OK).send({ status: "success", message: " image update successfully", })
}

  @Get('myblogs')
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @Delete(':id')
 async remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
