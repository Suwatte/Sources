import { Form, RunnerSetupProvider, UITextField } from "@suwatte/daisuke";
import { KomgaStore } from "../store";
import { healthCheck } from "../api";

type SetupForm = {
  host: string;
};
export const KomgaSetupProvider: RunnerSetupProvider = {
  getSetupMenu: async function (): Promise<Form> {
    return {
      sections: [
        {
          header: "Server URL",
          children: [
            UITextField({
              key: "host",
              label: "Server URL",
              value: (await KomgaStore.host()) ?? "",
            }),
          ],
        },
      ],
    };
  },
  validateSetupForm: async function ({
    host: value,
  }: SetupForm): Promise<void> {
    if (!value.endsWith("/")) value += "/";
    await ObjectStore.set("host", value);
    try {
      await healthCheck();
    } catch (error) {
      console.error(`${error}`);
      throw new Error("Cannot Connect to Komga Server");
    }
  },
};