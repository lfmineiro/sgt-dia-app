// Para construir a component de input temos que pensar o que ela vai receber
// label, iconLeft, iconRight, error + as props normais do Input
// Uso do forwardRef para 
import { forwardRef, type ReactNode } from "react"

//inicialmente colocar as props aqui, depois avaliar se eu vou centralizar em outro canto

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  iconLeft?: ReactNode
  error?: ReactNode
  iconRight?: ReactNode 
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, iconLeft, iconRight, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-slate-900">
            {label}
          </label>
        )}
        
        <div className="relative">
          {iconLeft && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {iconLeft}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full rounded-xl border bg-white py-3 text-slate-900 placeholder:text-slate-400 
              focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500
              transition-colors duration-200
              ${iconLeft ? 'pl-12' : 'pl-4'} 
              ${iconRight ? 'pr-12' : 'pr-4'}
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500/20' 
              }
              ${className}
            `}
            {...props}
          />
          
          {iconRight && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {iconRight}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';