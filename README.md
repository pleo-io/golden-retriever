<h1 align="center">
🐶🦮🐶
</h1>
<h1 align="center">Golden Retriever</h1>

<p align="center">An application for retrieving related data for OpsLevel services and transmitting it back to OpsLevel for use in OpsLevel Checks. </p>

---

This app retrieves OpsLevel services and data about their GitHub repositories, transforms this data and transmits it back to OpsLevel for use in OpsLevel Checks.

## Environment variables

The app expects the following environment variables to be present:

```
OPSLEVEL_TOKEN=
GITHUB_TOKEN=
GITHUB_ORGANIZATION=
OPSLEVEL_CUSTOM_EVENT_WEBHOOK=
```

## Running

_Requires `docker` to be installed._

```sh
# Build the app
docker build -t golden-retriever .

# Run the app with required environment variables
docker run \
  -e OPSLEVEL_TOKEN=$OPSLEVEL_TOKEN
  -e GITHUB_TOKEN=$GITHUB_TOKEN
  -e GITHUB_ORGANIZATION=$GITHUB_ORGANIZATION
  -e OPSLEVEL_CUSTOM_EVENT_WEBHOOK=$OPSLEVEL_CUSTOM_EVENT_WEBHOOK
  golden-retriever
```

## Development

_Requires [`bun`](https://bun.sh) to be installed._

```sh
# Install dependencies
bun install

# Run the app
bun run src/main.ts
```

## Contributing

If you have suggestions for how `golden-retriever` could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[Unlicense](LICENSE) © 2022 pleo-io
