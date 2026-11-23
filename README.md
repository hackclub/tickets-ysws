# Tickets YSWS

Tickets is a Hack Club YSWS where you ship a website or game themed around a movie, and we ship you tickets (grants) to go watch more movies

## Run locally

You need Node.js 24 and pnpm 12. From the repository root, install dependencies
and create a local backend environment file:

```sh
pnpm install
cp .env.example backend/.env
```

Edit `backend/.env` and set at least the Airtable credentials. Set `APP_URL` to
`http://localhost:3000` (or the origin matching your `PORT`). Hack Club Auth and
Hackatime credentials are needed to try those login flows; register their
callbacks as `http://localhost:3000/api/auth/hca/callback` and
`http://localhost:3000/api/auth/hackatime/callback`. Observe credentials are
optional.

Start the app in development mode:

```sh
pnpm dev
```

This runs the frontend `dev:build` and backend `dev` scripts concurrently. The
backend serves the frontend and API. Open `http://localhost:3000` (or the port
configured in `backend/.env`). Stop the processes with Ctrl+C.

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

![ticket logo](/marketing/logo.png)
