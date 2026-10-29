import { ApiProperty } from '@nestjs/swagger';

export class NoteResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Learn AWS Deployment' })
  title: string;

  @ApiProperty({
    example: 'Deploy my NestJS API to EC2.',
  })
  content: string;

  @ApiProperty({ example: '2026-10-29T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-29T10:00:00.000Z' })
  updatedAt: Date;
}
