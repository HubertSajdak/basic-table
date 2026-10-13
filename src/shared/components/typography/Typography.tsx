import type { ElementType, HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from 'cn';

export type TypographyVariant =
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'caption' | 'button';

// Full class names (not interpolated) so Tailwind can detect them
const variantClasses: Record<TypographyVariant, string> = {
  h1: 'typography-h1',
  h2: 'typography-h2',
  h3: 'typography-h3',
  h4: 'typography-h4',
  h5: 'typography-h5',
  h6: 'typography-h6',
  subtitle1: 'typography-subtitle1',
  subtitle2: 'typography-subtitle2',
  body1: 'typography-body1',
  caption: 'typography-caption',
  button: 'typography-button',
};

// Default HTML element per variant (same as MUI variantMapping)
const variantElements: Record<TypographyVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  caption: 'span',
  button: 'span',
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  component?: ElementType;
  className?: string;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}

// Extra props and ref are forwarded, so Typography can be a trigger (e.g. for Tooltip)
export const Typography = ({ variant = 'body1', component, className, children, ...props }: TypographyProps) => {
  const Component = component ?? variantElements[variant];

  return (
    <Component className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </Component>
  );
};
