import { useRef, useState } from 'react';
import { cn } from 'cn';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn/components/tooltip';
import { Typography, type TypographyProps } from './Typography';

type TypographyWithTooltipProps = Omit<TypographyProps, 'ref'>;

/**
 * Single-line text that truncates with an ellipsis when it doesn't fit.
 * The full text is shown in a tooltip on hover — only when it's actually truncated.
 */
export const TypographyWithTooltip = ({ children, className, ...typographyProps }: TypographyWithTooltipProps) => {
  const [open, setOpen] = useState(false);
  const textRef = useRef<HTMLElement>(null);

  // Measured at hover time, so it also reacts to column / container resizes
  const handleOpenChange = (nextOpen: boolean) => {
    const element = textRef.current;
    const isTruncated = element !== null && element.scrollWidth > element.clientWidth;
    setOpen(nextOpen && isTruncated);
  };

  return (
    <Tooltip open={open} onOpenChange={handleOpenChange}>
      <TooltipTrigger
        delay={150}
        render={
          <Typography ref={textRef} className={cn('truncate', className)} {...typographyProps}>
            {children}
          </Typography>
        }
      />
      {/* max-w-none: width follows the content instead of shadcn's fixed max-w-xs */}
      <TooltipContent className="max-w-none">{children}</TooltipContent>
    </Tooltip>
  );
};
