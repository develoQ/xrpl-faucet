import { DOMAttributes, FC, MouseEventHandler } from 'react'
import { overrideTailwindClasses } from 'tailwind-override'

type Props = {
  variant: 'outline' | 'contained' | 'text'
  onClick?: MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
  className?: string
  disabled?: boolean
} & DOMAttributes<HTMLButtonElement>

export const Button: FC<Props> = ({ variant, onClick, children, className, disabled, ...props }) => {
  const commonClassName = 'btn w-48 btn-primary'

  const containedClassName = 'border'
  const outlineClassName = 'btn-outline'
  const textClassName = 'btn-ghost'

  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={overrideTailwindClasses(
        `${commonClassName}  ${
          variant === 'outline' ? outlineClassName : variant === 'contained' ? containedClassName : textClassName
        } ${className}`
      )}
      {...props}
    >
      {children}
    </button>
  )
}
