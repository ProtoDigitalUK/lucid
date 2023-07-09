import { RuntimeError } from "@utils/app/error-handler";

// Run all launch steps
const launchSteps = async () => {
  try {
  } catch (err) {
    new RuntimeError((err as Error).message);
  }
};

export default launchSteps;
