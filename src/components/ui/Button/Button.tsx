import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'whatsapp'
type ButtonSize = 'sm' | 'md' | 'lg'

type BaseProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  children?: ReactNode
  className?: string
  icon?: ReactNode
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never }

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsLink

function buildClassName(variant: ButtonVariant, size: ButtonSize, fullWidth?: boolean, extra?: string) {
  return [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ')
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  fullWidth,
  children,
  className,
  icon,
  ...props
}: ButtonProps) {
  const classes = buildClassName(variant, size, fullWidth, className)

  const content = (
    <>
      {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : icon}
      {children}
    </>
  )

  if ('href' in props && props.href) {
    const { href, ...linkProps } = props
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    )
  }

  const { disabled, type = 'button', ...buttonProps } = props as ButtonAsButton

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      {...buttonProps}
    >
      {content}
    </button>
  )
}
