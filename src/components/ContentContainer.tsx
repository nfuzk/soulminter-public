import { FC, ReactNode } from "react";

interface ContentContainerProps {
  children: ReactNode;
}

export const ContentContainer: FC<ContentContainerProps> = ({ children }) => {
  return (
    <div className="flex-1">
      <div className="items-center">{children}</div>
    </div>
  );
};
