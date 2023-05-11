import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, HttpStatus, Req, Res, ParseFilePipeBuilder, HttpException } from '@nestjs/common';
import { TestimonialService } from './testimonial.service';
import { UpdateTestimonialDto } from './dto/update-testimonial.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Testimonial } from './entities/testimonial.entity';
import { Repository } from 'typeorm';
import { S3Service } from 'src/s3/s3.service';
import { Request, Response } from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';



@Controller('testimonial')
export class TestimonialController {
  constructor(
    @InjectRepository(Testimonial) private TestimonialRepository: Repository<Testimonial>,
    private s3service: S3Service,
    private readonly testimonialService: TestimonialService) {}
    
  @Post('addtestimonial')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'Image1', maxCount: 2 },
    { name: 'Image2', maxCount: 2},
    { name: 'Image3', maxCount: 2 },
    { name: 'Image4', maxCount: 2 },
    { name: 'Image5', maxCount: 2 },
    { name: 'ClientImage', maxCount: 2 },
 ]))
  async givetestimonia(
    @UploadedFiles()
    file: {
      Image1?: Express.Multer.File[],
      Image2?: Express.Multer.File[],
      Image3?: Express.Multer.File[],
      Image4?: Express.Multer.File[] ,
      Image5?: Express.Multer.File[],
      ClientImage?: Express.Multer.File[]},
    @Req() req: Request,
    @Body() body,
    @Res() res: Response) {
    const { ClientName,ClientDesignation,CompanyName, Description} = req.body;
    const image1 = file.Image1? await this.s3service.Addimage(file.Image1[0]):null
    const image2 = file.Image2? await this.s3service.Addimage(file.Image2[0]):null
    const image3 = file.Image3? await this.s3service.Addimage(file.Image3[0]):null
    const image4 = file.Image4? await this.s3service.Addimage(file.Image4[0]):null
    const image5 =  file.Image5? await this.s3service.Addimage(file.Image5[0]):null
    const ClientImage = file.ClientImage? await this.s3service.Addimage(file.ClientImage[0]):null
    const testimonial = new Testimonial();
    testimonial.ClientName=ClientName
    testimonial.ClientImage =ClientImage
    testimonial.Image1 =image1
    testimonial.Image2 =image2
    testimonial.Image3 =image3
    testimonial.Image4 =image4
    testimonial.Image5=image5
    testimonial.ClientImage =ClientImage
    testimonial.Description =Description
    testimonial.ClientDesignation =ClientDesignation
    testimonial.CompanyName =CompanyName
    await this.TestimonialRepository.save({...testimonial})
    return res.status(HttpStatus.OK).send({ status: "success", message: "testimonial created successfully", })
}



@Patch('update/:testid')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'Image1', maxCount: 1 },
  { name: 'Image2', maxCount: 1},
  { name: 'Image3', maxCount: 1 },
  { name: 'Image4', maxCount: 1 },
  { name: 'Image5', maxCount: 1 },
  { name: 'ClientImage', maxCount: 2 },
]))
async updateimage(
  @UploadedFiles( new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: 'webp',
  })
  .addMaxSizeValidator({
    maxSize: 1024 * 1024 * 6,
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  }),)

  file: {
    Image1?: Express.Multer.File[],
    Image2?: Express.Multer.File[],
    Image3?: Express.Multer.File[],
    Image4?: Express.Multer.File[] ,
    Image5?: Express.Multer.File[],
    ClientImage?: Express.Multer.File[]},
  @Req() req: Request,
  @Param ('testid')testid:string,
  @Body() body,
  @Res() res: Response) {
  const image1 = file.Image1? await this.s3service.updatetestumonialIMages(testid,file.Image1[0]):null
  const image2 = file.Image2? await this.s3service.updatetestumonialIMages(testid,file.Image2[0]):null
  const image3 = file.Image3? await this.s3service.updatetestumonialIMages(testid,file.Image3[0]):null
  const image4 = file.Image4? await this.s3service.updatetestumonialIMages(testid,file.Image4[0]):null
  const image5 = file.Image5? await this.s3service.updatetestumonialIMages(testid,file.Image5[0]):null
  const ClientImage = file.ClientImage? await this.s3service.updatetestumonialIMages(testid,file.ClientImage[0]):null
  const testimonial = new Testimonial();
  if(image1) testimonial.Image1 =image1
  if(image2) testimonial.Image2 =image2
  if(image3) testimonial.Image3 =image3
  if(image4) testimonial.Image4 =image4
  if(image5) testimonial.Image5 =image5
  if(ClientImage) testimonial.ClientImage 
  await this.TestimonialRepository.update({testid},{...testimonial})
  return res.status(HttpStatus.OK).send({ status: "success", message: " image update successfully", })
}

  @Get('alltestimonila')
 async findAll( @Res() res: Response) {
    const alltestimonila = await this.TestimonialRepository.find({})
    return res.status(HttpStatus.OK).json({alltestimonila})
  }

  @Get(':testid')
 async findOne(@Param('testid',) testid: string) {
    const testimonial= await this.TestimonialRepository.findOne({where:{testid}})
    if(!testimonial){
      throw new HttpException(
        "testimonial not found",
        HttpStatus.BAD_REQUEST
      );
    }
    return testimonial;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestimonialDto: UpdateTestimonialDto) {
    return this.testimonialService.update(id, {...updateTestimonialDto});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testimonialService.remove(id);
  }
}
