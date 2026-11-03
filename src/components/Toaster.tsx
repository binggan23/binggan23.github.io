import { Toast } from "@base-ui/react/toast";

/** Global toast viewport; styled as a stamped paper slip. */
export default function Toaster() {
  return (
    <Toast.Portal>
      <Toast.Viewport className="toaster">
        <ToastList />
      </Toast.Viewport>
    </Toast.Portal>
  );
}

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return (
    <>
      {toasts.map((toast) => (
        <Toast.Root key={toast.id} toast={toast} className="toast">
          <Toast.Content className="toast__content">
            <Toast.Title className="toast__title mono">{toast.title}</Toast.Title>
            <Toast.Description className="toast__desc">{toast.description}</Toast.Description>
          </Toast.Content>
          <Toast.Close className="toast__close mono" aria-label="关闭通知">✕</Toast.Close>
        </Toast.Root>
      ))}
    </>
  );
}
