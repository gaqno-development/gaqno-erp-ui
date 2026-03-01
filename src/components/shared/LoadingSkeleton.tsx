import { cn } from "@gaqno-development/frontcore/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  variant?: "card" | "list" | "stat";
}

export function LoadingSkeleton({ 
  className, 
  count = 1, 
  variant = "card" 
}: LoadingSkeletonProps) {
  const getSkeletonClass = () => {
    switch (variant) {
      case "card":
        return "h-32 rounded-xl";
      case "list":
        return "h-12 rounded-md w-full";
      case "stat":
        return "h-8 rounded-md w-20";
      default:
        return "h-32 rounded-xl";
    }
  };

  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-muted animate-pulse",
            getSkeletonClass(),
            className
          )}
        />
      ))}
    </>
  );
}
