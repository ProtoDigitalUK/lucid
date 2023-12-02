import T from "@translations/index.js";
// Utils
import { HeadlessError } from "@utils/app/error-handler.js";
// Models
import { BrickObject } from "@db/models/CollectionBrick.js";

const checkDuplicateOrders = (bricks: Array<BrickObject>) => {
  const builderOrders = bricks
    .filter((brick) => brick.type === "builder")
    .map((brick) => brick.order);
  // const fixedOrders = bricks
  //   .filter((brick) => brick.type === "fixed")
  //   .map((brick) => brick.order);

  const builderOrderDuplicates = builderOrders.filter(
    (order, index) => builderOrders.indexOf(order) !== index
  );
  // const fixedOrderDuplicates = fixedOrders.filter(
  //   (order, index) => fixedOrders.indexOf(order) !== index
  // );

  if (builderOrderDuplicates.length > 0) {
    throw new HeadlessError({
      type: "basic",
      name: T("error_saving_bricks"),
      message: T("error_saving_page_duplicate_order", {
        order: builderOrderDuplicates.join(", "),
      }),
      status: 400,
    });
  }
  // if (fixedOrderDuplicates.length > 0) {
  //   throw new HeadlessError({
  //     type: "basic",
  //     name: T("error_saving_bricks"),
  //     message: T("error_saving_page_duplicate_order", {
  //       order: fixedOrderDuplicates.join(", "),
  //     }),
  //     status: 400,
  //   });
  // }
};

export default checkDuplicateOrders;
