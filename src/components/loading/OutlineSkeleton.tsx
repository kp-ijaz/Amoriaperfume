import { cn } from '@/lib/utils';

type OutlineSkeletonProps = React.ComponentProps<'div'>;

export function OutlineSkeleton({ className, style, ...props }: OutlineSkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse border border-[#E8E3DC] bg-[#FAF8F5]', className)}
      style={style}
      {...props}
    />
  );
}
