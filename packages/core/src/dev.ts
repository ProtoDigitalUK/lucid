import lucid, { BrickBuilder } from "./index";

const bricks = [
  new BrickBuilder("banner")
    .addText({
      key: "title",
    })
    .addWysiwyg({
      key: "description",
    })
    .addImage({
      key: "image",
    }),
];

lucid({
  port: 8393,
  origin: "*",
  environment: "development",
  secret_key: "f3b2e4b00b1a4b1e9b0a8b0a9b1e0b1a",
  // bricks: [bricks],
});
