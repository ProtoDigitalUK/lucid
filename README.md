![Proto Headless CMS](https://github.com/ProtoDigitalUK/proto_headless/blob/master/banner.png?raw=true)

## Installation

```bash
npm install @protodigital/headless
```

## Builders

- [Brick Builder]()
- [Collection Builder]()

## headless.config.ts/js

```ts
import { headlessConfig } from "@protodigital/headless";

import { Banner, Intro, DefaultMeta } from "./src/bricks";
import { Pages, Settings } from "./src/collections";

export default headlessConfig({
	mode: "development",
	host: "http://localhost:8393",
	databaseURL: process.env.DATABASE_URL as string,
	keys: {
		cookieSecret: process.env.COOKIE_SECRET as string,
		refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
		accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
	},
    collections: [Pages, Settings],
    bricks: [Banner, Intro, DefaultMeta],
});
```

> Check the example app: [example](https://github.com/ProtoDigitalUK/proto_headless/tree/master/apps/headless-example/headless.config.ts)
