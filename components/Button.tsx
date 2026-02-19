import { forwardRef } from 'react';

type ButtonVariant = 'main' | 'sub' | 'text' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonColor = 'dark' | 'light';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: ButtonColor;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    href?: undefined;
  };

type ButtonAsAnchor = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

function buildClassName(variant: ButtonVariant, size: ButtonSize, color: ButtonColor, className?: string) {
  const classes = ['button', `button--${variant}`];
  if (color === 'light') classes.push('button--light');
  if (size !== 'md') classes.push(`button--${size}`);
  if (className) classes.push(className);
  return classes.join(' ');
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant = 'main', size = 'md', color = 'dark', icon, children, className, ...rest }, ref) {
    const cls = buildClassName(variant, size, color, className);

    if ('href' in rest && rest.href !== undefined) {
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} className={cls} {...rest}>
          {children}
          {icon}
        </a>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={cls} {...(rest as ButtonAsButton)}>
        {children}
        {icon}
      </button>
    );
  },
);
