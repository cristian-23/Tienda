import { Skeleton as PrimeSkeleton } from 'primereact/skeleton'

type SkeletonProps = {
  width?: string
  height?: string
  borderRadius?: string
}

export function Skeleton({ width = '100%', height = '1rem', borderRadius }: SkeletonProps) {
  return <PrimeSkeleton width={width} height={height} borderRadius={borderRadius} />
}
