export const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-dark-graphite ${className}`}
    />
  );
}; 