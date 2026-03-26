import { ReactNode } from "react";

interface ProFeatureLockProps {
  children: ReactNode;
  className?: string;
}

export default function ProFeatureLock({ children, className = "" }: ProFeatureLockProps) {
  return <div className={className}>{children}</div>;
}
