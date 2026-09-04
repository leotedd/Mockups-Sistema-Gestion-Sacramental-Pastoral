import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variante = "default" | "primary" | "danger" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  sm?: boolean;
  icon?: ReactNode;
}

export function Button({ variante = "default", sm, icon, children, className = "", ...rest }: Props) {
  const clases = [
    "btn",
    variante === "primary" && "btn--primary",
    variante === "danger" && "btn--danger",
    variante === "ghost" && "btn--ghost",
    sm && "btn--sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={clases} {...rest}>
      {icon}
      {children}
    </button>
  );
}
