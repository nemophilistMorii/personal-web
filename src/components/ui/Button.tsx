import Link from 'next/link'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  href?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

export function Button({ variant = 'primary', size = 'md', children, className = '', href, disabled = false, type = 'button' }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200'
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark disabled:opacity-50',
    secondary: 'border-2 border-primary text-primary hover:bg-primary hover:text-white disabled:opacity-50',
    ghost: 'text-slate-600 hover:text-primary hover:bg-slate-100',
  }
  const sizes = { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-sm', lg: 'h-12 px-6 text-base' }

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if (href) {
    return <Link href={href} className={classes}>{children}</Link>
  }

  return <button type={type} className={classes} disabled={disabled}>{children}</button>
}
