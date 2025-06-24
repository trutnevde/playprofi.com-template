import { GlobalSearch } from "iconsax-react";

function NotFoundPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-[40px] text-supporting">
      <GlobalSearch size="300" variant="Bulk" />
      <p>Page Not Found</p>
      <p>404</p>
    </div>
  );
}

export default NotFoundPage;
