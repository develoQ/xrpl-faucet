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
  const commonClassName =
    'rounded w-48 py-2 px-4 transition duration-100 ripple-bg-black disabled:cursor-not-allowed disabled:opacity-50'

  const containedClassName = 'border border-blue-700 bg-blue-500 font-bold text-white enabled:hover:bg-blue-700'
  const outlineClassName =
    'border border-blue-500 bg-transparent font-semibold text-blue-700 enabled:hover:border-transparent enabled:hover:bg-blue-500 enabled:hover:text-white'
  const textClassName =
    'bg-transparent font-semibold text-blue-700 enabled:hover:border-transparent enabled:hover:bg-blue-100'

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
