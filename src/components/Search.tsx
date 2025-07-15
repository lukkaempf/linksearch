import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useLinks } from "@/context/LinkContext";

export const SearchInput = () => {
  const { searchQuery, setSearchQuery } = useLinks();

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        placeholder="Search links, labels, or descriptions..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};
