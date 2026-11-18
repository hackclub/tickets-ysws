import { Transform } from 'class-transformer';
import { IsString, IsUrl } from 'class-validator';

export class SubmitProjectDto {
  @IsString()
  projectName: string;
  @IsUrl({ require_tld: true })
  playableUrl: string;
  @IsUrl(
    { protocols: ['https'], host_whitelist: ['github.com'] },
    {
      message:
        'Public GitHub Repository must be a valid https://github.com URL',
    },
  )
  codeUrl: string;
  @IsString()
  movieName: string;
  @IsString()
  description: string;
  @IsString()
  plannedMovieToWatch: string;

  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsString({ each: true })
  hackatimeProjectNames: string[];
}
