interface CardProps {
  children: React.ReactNode;
  className?: string;
  borderClassName?: string;
  shadowClassName?: string;
}

const baseClasses = "bg-light border rounded-3xl px-6 py-8";

export default function Card({
  children,
  className,
  borderClassName = "border-dark",
  shadowClassName = "shadow-[8px_8px_0px_#1f5534]",
}: CardProps) {
  const classNames = [baseClasses, borderClassName, shadowClassName, className]
    .filter(Boolean)
    .join(" ");

  return <div className={classNames}>{children}</div>;
}