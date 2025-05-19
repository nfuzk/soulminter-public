import { useEffect } from "react";
import useNotificationStore from "../stores/useNotificationStore";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Notification = () => {
  const { notifications, set: setNotificationStore } = useNotificationStore();

  // Automatically remove notifications after 5 seconds
  useEffect(() => {
    if (notifications.length === 0) return;
    const timers = notifications.map((n, idx) =>
      n.persistent
        ? null
        : setTimeout(() => {
            setNotificationStore((state) => {
              state.notifications = state.notifications.filter((_, i) => i !== idx);
            });
          }, 5000)
    );
    return () => timers.forEach((t) => t && clearTimeout(t));
  }, [notifications, setNotificationStore]);

  const handleClose = (index: number) => {
    setNotificationStore((state) => {
      state.notifications = state.notifications.filter((_, i) => i !== index);
    });
  };

  return (
    <div
      className={`z-50 fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6`}
    >
      <div className={`flex flex-col w-full`}>
        {notifications.map((n, idx) => (
          <div
            key={idx}
            className={`max-w-sm w-full bg-[#1A2332] border border-purple-500 shadow-lg rounded-lg mt-2 pointer-events-auto ring-1 ring-black ring-opacity-5 p-4`}
          >
            <div className={`flex items-center`}>
              <div className="flex-shrink-0">
                {n.type === "success" ? (
                  <CheckCircleIcon className="mr-1 h-8 w-8 text-green-400" />
                ) : null}
                {n.type === "info" && (
                  <InformationCircleIcon className="mr-1 h-8 w-8 text-blue-400" />
                )}
                {n.type === "error" && (
                  <XCircleIcon className="mr-1 h-8 w-8 text-red-400" />
                )}
              </div>
              <div className={`ml-3 w-0 flex-1`}>
                <div className={`text-sm text-white`}>{n.message}</div>
                {n.description ? (
                  <div className={`mt-1 text-sm text-gray-400`}>
                    {n.description}
                  </div>
                ) : null}
                {n.txid ? (
                  <div className={`mt-1 text-sm`}>
                    <a
                      href={`https://explorer.solana.com/tx/${n.txid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-400 hover:text-purple-500"
                    >
                      View transaction
                    </a>
                  </div>
                ) : null}
              </div>
              <div className={`ml-4 flex-shrink-0 self-start flex`}>
                <button
                  onClick={() => handleClose(idx)}
                  className={`bg-[#1A2332] rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
