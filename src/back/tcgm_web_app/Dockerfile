FROM elixir:1.14-alpine

RUN apk add --no-cache build-base git nodejs npm bash

RUN mix local.hex --force && \
    mix local.rebar --force

ENV MIX_ENV=prod
ENV PORT=4000

WORKDIR /app

COPY . .

RUN mix deps.get --only prod

RUN mix compile

RUN mix phx.digest

EXPOSE 4000

CMD ["mix", "phx.server"]
