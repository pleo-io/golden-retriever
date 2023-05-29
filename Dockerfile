FROM oven/bun

COPY . ./app

WORKDIR app

RUN bun install --frozen-lockfile --prod
ENTRYPOINT ["bun", "run", "src/main.ts"]
