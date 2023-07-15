import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssignStudentsToLessonInput {
  @IsUUID()
  @Field((type) => ID)
  lessonId;

  @IsUUID('4', { each: true })
  @Field((type) => [ID])
  studentIds;
}
