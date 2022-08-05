import { IsEnum, IsNotEmpty } from "class-validator";
import { ProjectsEnum } from "./projects.enum";

export class UpdateDictsDTO {
  @IsNotEmpty()
  @IsEnum(ProjectsEnum)
  project: ProjectsEnum
}
