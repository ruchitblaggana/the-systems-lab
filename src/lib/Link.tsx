import { type ReactNode, useCallback } from 'react';
import { navigate } from './router';

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  isActive?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
}

export function Link({ to, children, className = '', activeClassName = '', isActive, onClick, ariaLabel }: LinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      navigate(to);
      onClick?.();
    },
    [to, onClick]
  );

  return (
    <a
      href={'#' + to}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''}`}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  );
}
