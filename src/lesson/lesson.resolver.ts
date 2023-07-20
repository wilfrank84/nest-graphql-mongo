/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

import { StudentService } from 'src/student/student.service';
import { AssignStudentsToLessonInput } from './assign-students-to-lesson.input';
import { Lesson } from './lesson.entity';
import { CreateLessonInput } from './lesson.input';
import { LessonService } from './lesson.service';
import { LessonType } from './lesson.type';

const pubSub = new PubSub();

@Resolver((of) => LessonType)
export class LessonResolver {
  constructor(
    private lessonService: LessonService,
    private studentService: StudentService,
  ) {}

  @Query((returns) => LessonType)
  lesson(@Args('id') id: string) {
    return this.lessonService.getLesson(id);
  }

  @Query((returns) => [LessonType])
  lessons() {
    return this.lessonService.getLessons();
  }

  @Mutation((returns) => LessonType)
  createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ) {
    const newLesson = this.lessonService.createLesson(createLessonInput);
    pubSub.publish('lessonCreated', { lessonCreated: newLesson });
    return newLesson;
  }

  @Subscription((returns) => LessonType)
  lessonCreated() {
    return pubSub.asyncIterator('lessonCreated');
  }

  @Mutation((returns) => LessonType)
  assignStudentsToLesson(
    @Args('assignStudentsToLessonInput')
    assignStudentsToLessonInput: AssignStudentsToLessonInput,
  ) {
    const { lessonId, studentIds } = assignStudentsToLessonInput;
    return this.lessonService.assignStudentsToLesson(lessonId, studentIds);
  }

  @ResolveField()
  async students(@Parent() lesson: Lesson) {
    return this.studentService.getManyStudents(lesson.students);
  }
}
