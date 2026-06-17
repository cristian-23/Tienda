import { ProgressSpinner } from 'primereact/progressspinner'

type SpinnerProps = {
  size?: number
}

export function Spinner({ size = 40 }: SpinnerProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <ProgressSpinner style={{ width: `${size}px`, height: `${size}px` }} />
    </div>
  )
}
