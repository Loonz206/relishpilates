import Link from "next/link";

interface BaseButtonProps {
  children: React.ReactNode;
  className?: string;
}

interface ButtonAsLinkProps extends BaseButtonProps {
  href: string;
  ariaLabel?: string;
}

interface ButtonAsButtonProps extends BaseButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel?: string;
}

type ButtonProps = ButtonAsLinkProps | ButtonAsButtonProps;

const baseClasses =
  "inline-flex items-center justify-center bg-lavender border border-dark text-dark font-nunito font-normal text-lg leading-6 px-8 py-2 rounded-full shadow-[6px_6px_0px_#1d1d1f] no-underline transition-[transform,box-shadow] touch-manipulation motion-safe:hover:translate-x-[1px] motion-safe:hover:translate-y-[1px] motion-safe:hover:shadow-[4px_4px_0px_#1d1d1f]";

export default function Button(props: ButtonProps) {
  const mergedClassName = props.className ? `${baseClasses} ${props.className}` : baseClasses;

  if ("href" in props) {
    return (
      <Link href={props.href} className={mergedClassName} aria-label={props.ariaLabel}>
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      className={mergedClassName}
      aria-label={props.ariaLabel}
    >
      {props.children}
    </button>
  );
}