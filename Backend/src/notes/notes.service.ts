import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { UpdateNoteDto } from './dto/update-note.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        title: createNoteDto.title,
        content: createNoteDto.content,
      },
    });
  }

  async findAll() {
    return this.prisma.note.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    await this.findOne(id);

    return this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.note.delete({
      where: { id },
    });
  }
}
