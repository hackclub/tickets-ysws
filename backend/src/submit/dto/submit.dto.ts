import { IsString, IsUrl } from 'class-validator';

export class SubmitProjectDto {
  @IsString()
  projectName: string;
  @IsUrl({require_tld: true})
  playableUrl: string;
  @IsUrl({})
  githubUrl: string;
  @IsString()
  movieName: string;
  @IsString()
  description: string;
  @IsString()
  plannedMovieToWatch: string;
}
