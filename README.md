# Ticket YSWS

Build a website themed around a movie, we ship you tickets to go watch more movies

## Deploy with Docker

The backend serves both the API and the built frontend, so deploy the repository as
one container rather than deploying the frontend separately.

1. Install Docker Engine and the Docker Compose plugin on the deployment host.
2. Copy `.env.example` to `.env` and set the Hack Club Auth, Hackatime, and Airtable
   credentials. Set `APP_URL` to the public HTTPS origin of the site (without a
   trailing slash). `OBSERVE_APP_KEY` and `OBSERVE_APP_SECRET` are optional.
3. Configure the Hack Club Auth and Hackatime OAuth callback URLs to
   `https://your-domain.example/api/auth/hca/callback` and
   `https://your-domain.example/api/auth/hackatime/callback`, using the actual
   value of `APP_URL`.
4. Build and start the service:

   ```sh
   docker compose up --build -d
   ```

The app listens on port `3000` in the container. By default, Compose publishes it
on host port `3000`; set `HOST_PORT` in the shell or Compose `.env` file to change
the host port. Put a TLS-terminating reverse proxy in front of the container for
public production traffic, and forward requests to the container's port `3000`.

To view logs or stop the service:

```sh
docker compose logs -f app
docker compose down
```
