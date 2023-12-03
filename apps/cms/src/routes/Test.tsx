import { Component, createMemo, onMount } from "solid-js";
// Types
import { BrickConfigT } from "@headless/types/src/bricks";
// Store
import builderStore from "@/store/builderStore";
// Components
import PageBuilder from "@/components/Groups/PageBuilder";
import SelectMediaModal from "@/components/Modals/Media/SelectMedia";

const TESTING_CONFIG: BrickConfigT = {
  key: "testing",
  title: "Testing",
  preview: {
    image:
      "https://usersnap.com/blog/wp-content/uploads/2021/03/7-Common-Types-of-Software-Testing@1x-1280x720.png",
  },
  fields: [
    {
      type: "tab",
      title: "Content",
      key: "content_tab",
      fields: [
        {
          type: "text",
          title: "Text Key",
          key: "text-key",
          description: "Testing title",
          default: "",
        },
        {
          type: "wysiwyg",
          title: "Wysiwyg Key",
          key: "wysiwyg-key",
          default: "",
        },
        {
          type: "media",
          title: "Media Key",
          key: "media-key",
          validation: {
            extensions: ["png"],
            type: "image",
          },
        },
        {
          type: "repeater",
          title: "Repeater Key",
          key: "repeater-key",
          fields: [
            {
              type: "text",
              title: "Repeater Title",
              key: "repeater-title",
              default: "",
            },
            {
              type: "repeater",
              title: "Repeater Key Nested",
              key: "repeater-key-nested",
              fields: [
                {
                  type: "text",
                  title: "Repeater Title Nested",
                  key: "repeater-title-nested",
                  default: "",
                },
              ],
            },
          ],
        },
        {
          type: "number",
          title: "Number Key",
          key: "number-key",
          default: 0,
        },
        {
          type: "checkbox",
          title: "Checkbox Key",
          key: "checkbox-key",
          default: false,
        },
        {
          type: "select",
          title: "Select Key",
          key: "select-key",
          options: [
            {
              label: "Option 1",
              value: "option-1",
            },
            {
              label: "Option 2",
              value: "option-2",
            },
            {
              label: "Option 3",
              value: "option-3",
            },
          ],
          default: "",
        },
        {
          type: "textarea",
          title: "Textarea Key",
          key: "textarea-key",
          default: "",
        },
      ],
    },
    {
      type: "tab",
      title: "Advanced",
      key: "advanced_tab",
      fields: [
        {
          type: "json",
          title: "Json Key",
          key: "json-key",
          default: {},
        },
        {
          type: "colour",
          title: "Colour Key",
          key: "colour-key",
          default: "",
        },
        {
          type: "datetime",
          title: "Datetime Key",
          key: "datetime-key",
          default: "",
        },
        {
          type: "pagelink",
          title: "Page Link Key",
          key: "page-link-key",
        },
        {
          type: "link",
          title: "Link Key",
          key: "link-key",
        },
      ],
    },
  ],
};

const TestRoute: Component = () => {
  // ------------------------------------
  // Mount
  onMount(() => {
    builderStore.get.reset();

    builderStore.get.addBrick({
      brick: {
        key: "testing",
        type: "builder",
        order: 0,
        fields: [],
        groups: [],
      },
    });
  });

  // ------------------------------------
  // Memos
  const builderBricks = createMemo(() => builderStore.get.bricks);
  const firstBrick = createMemo(() => builderBricks()[0]);

  // ------------------------------------
  // Render
  return (
    <>
      <div class="border-b border-border mb-2.5 pb-2.5">
        <h1>Test</h1>
        <p>You have {builderBricks().length} builder brick:</p>
      </div>
      <div class="bg-white">
        <h2 class="mb-2.5">First Brick: {firstBrick()?.key}</h2>

        <PageBuilder.BrickBody
          state={{
            brick: firstBrick(),
            config: TESTING_CONFIG,
          }}
        />

        <SelectMediaModal />
      </div>
    </>
  );
};

export default TestRoute;
