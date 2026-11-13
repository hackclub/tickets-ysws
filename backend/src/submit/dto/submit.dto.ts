import { IsString, IsUrl } from 'class-validator';

export class SubmitProjectDto {
  @IsString()
  projectName: string;
  @IsUrl({ require_tld: true })
  playableUrl: string;
  @IsUrl(
    { protocols: ['https'], host_whitelist: ['github.com', 'gitlab.com'] },
    { message: 'Must be a valid https://github.com or https://gitlab.com URL' },
  )
  codeUrl: string;
  @IsString()
  movieName: string;
  @IsString()
  description: string;
  @IsString()
  plannedMovieToWatch: string;
}
