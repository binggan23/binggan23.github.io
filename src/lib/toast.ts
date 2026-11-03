import { Toast } from "@base-ui/react/toast";

/** One global toast manager so any component can stamp a notice. */
export const toastManager = Toast.createToastManager();

export function stampNotice(title: string, description: string) {
  toastManager.add({ title, description, type: "stamp", timeout: 4200 });
}
