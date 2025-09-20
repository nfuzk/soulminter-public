import { create } from 'zustand';
import { produce } from 'immer';

interface Notification {
  type: string;
  message: string;
  description?: string;
  txid?: string;
  persistent?: boolean;
}

interface NotificationStore {
  notifications: Array<Notification>;
  set: (fn: (state: NotificationStore) => void) => void;
}

const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  set: (fn) => set(produce(fn)),
}));

export default useNotificationStore;
