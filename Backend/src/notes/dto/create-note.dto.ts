import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({
    description: 'The title of the note',
    example: 'Learn AWS Deployment',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    description: 'The content of the note',
    example:
      'Deploy my NestJS API to EC2 and connect it to PostgreSQL on Amazon RDS.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
