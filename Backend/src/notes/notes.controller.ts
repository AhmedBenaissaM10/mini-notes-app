import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';

import { NotesService } from './notes.service.js';
import { CreateNoteDto } from './dto/create-note.dto.js';
import { UpdateNoteDto } from './dto/update-note.dto.js';
import { NoteResponseDto } from './dto/note-response.dto.js';
import { ApiEnvelope, ApiErrors } from '../common/swagger/api-docs.decorator.js';


@ApiTags('Notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a note' })
  @ApiBody({ type: CreateNoteDto })
  @ApiEnvelope(NoteResponseDto, {
    status: 201,
    description: 'Note created successfully',
  })
  @ApiErrors(400, 503)
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  @ApiEnvelope(NoteResponseDto, {
    isArray: true,
    description: 'Notes retrieved successfully',
  })
  @ApiErrors(503)
  findAll() {
    return this.notesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Note UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiEnvelope(NoteResponseDto, {
    description: 'Note retrieved successfully',
  })
  @ApiErrors(404, 503)
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Note UUID',
  })
  @ApiBody({ type: UpdateNoteDto })
  @ApiEnvelope(NoteResponseDto, {
    description: 'Note updated successfully',
  })
  @ApiErrors(400, 404, 503)
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(id, updateNoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Note UUID',
  })
  @ApiEnvelope(NoteResponseDto, {
    description: 'Note deleted successfully',
  })
  @ApiErrors(404, 503)
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
