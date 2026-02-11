import { forwardRef } from 'react';

type ButtonVariant = 'primary' | 'solid' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
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

function buildClassName(variant: ButtonVariant, size: ButtonSize, className?: string) {
  const classes = ['button', `button--${variant}`];
  if (size !== 'md') classes.push(`button--${size}`);
  if (className) classes.push(className);
  return classes.join(' ');
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant = 'primary', size = 'md', icon, children, className, ...rest }, ref) {
    const cls = buildClassName(variant, size, className);

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
