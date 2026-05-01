import React from "react";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";
import "./Typography.css";

type TypographyVariant =
  | "header"
  | "subheader"
  | "body"
  | "caption"
  | "label"
  | "overline"
  | "link";

/**
 * Maps each variant to its default semantic HTML element.
 * Can always be overridden with the `as` prop.
 */
const VARIANT_TAG: Record<TypographyVariant, React.ElementType> = {
  header: "h1",
  subheader: "h2",
  body: "p",
  caption: "span",
  label: "label",
  overline: "span",
  link: "a",
};

type TypographyProps = {
  variant?: TypographyVariant;
  // size?: number;
  // height?: number;
  // weight?: number;
  // spacing?: number;
  upper?: boolean;
  color?: string;
  as?: React.ElementType;
  center?: boolean;
  noWrap?: boolean;
  // _blank: New tab | _self: Same tab (default)
  href?: string;
  target?: "_blank" | "_self";
  marginBottom?: number;
  style?: React.CSSProperties;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

// forwardRef EXPLAINED:
// without forwardRef component is black box — nothing outside of it can touch real DOM node
// forwarding ref, allows parent components to access underlying DOM node when necessary
// especially useful for focus management, animations, or direct DOM manipulations
const Typography = React.forwardRef<HTMLElement, PropsWithChildren<TypographyProps>>(
  (props, ref) => {
    const {
      variant = "body",
      // size,
      // height,
      // weight,
      // spacing,
      upper,
      color,
      as,
      center,
      noWrap,
      href,
      target = "_self",
      marginBottom,
      style = {},
      className,
      onClick,
      children,
    } = props;

    const Tag = as ?? VARIANT_TAG[variant];

    const customStyles: React.CSSProperties = {
      ...(color !== undefined && { color }),
      // ...(size !== undefined && { fontSize: `${size}px` }),
      // ...(height !== undefined && { lineHeight: `${height}px` }),
      // ...(weight !== undefined && { fontWeight: weight }),
      // ...(spacing !== undefined && { letterSpacing: `${spacing}px` }),
      ...(noWrap && { whiteSpace: "nowrap" }),
      ...(center && { textAlign: "center" }),
      ...(upper && { textTransform: "uppercase" }),
      ...(marginBottom !== undefined && { marginBottom: `${marginBottom}px` }),
      ...style,
    };

    const typographyClasses = cn("typography", `typography--${variant}`, className);

    return (
      <Tag
        ref={ref}
        className={typographyClasses}
        style={customStyles}
        onClick={onClick}
        {...(variant === "link" && {
          href,
          target,
          // only adds noreferrer (for security) if link opens in new tab
          // prevents security vulnerability where new page can access window.opener and potentially redirect user to malicious site
          rel: target === "_blank" ? "noreferrer" : undefined,
        })}>
        {children}
      </Tag>
    );
  },
);

export default Typography;
