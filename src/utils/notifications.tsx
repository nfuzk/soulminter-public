import useNotificationStore from "../stores/useNotificationStore";

export function notify(newNotification: {
  type: string;
  message: string;
  description?: string;
  txid?: string;
  persistent?: boolean;
}) {
  const { set: setNotificationStore } = useNotificationStore.getState();

  setNotificationStore((state) => {
    state.notifications.push({
      ...newNotification,
      type: newNotification.type || 'info',
    });
  });
}
