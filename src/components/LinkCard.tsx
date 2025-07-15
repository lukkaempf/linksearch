import { Edit, ExternalLink, Tag, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import type { Link } from "@/context/types";
import { useLinks } from "@/context/LinkContext";
import { Badge } from "./ui/badge";
import { useDialog } from "@/context/DialogContext";

export const LinkCard: React.FC<{ link: Link }> = ({ link }) => {
  const { folders, deleteLink } = useLinks();
  const { setEditingLink, setLinkDialogOpen } = useDialog();

  // Finde das zugehörige Verzeichnis
  const folder = folders.find((f) => f.id === link.folderId);

  // Standard-Farbe und Name, falls nicht gefunden
  const folderColor = folder?.color || "bg-gray-500";
  const folderName = folder?.name || "Uncategorized";

  return (
    console.log("Rendering LinkCard for:", link.title),
    (
      <Card key={link.id} className="hover:shadow-md transition-shadow">
        <CardContent className="px-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold truncate">{link.title}</h3>
                <Badge
                  variant="secondary"
                  className="shrink-0 bg-gray-100 rounded-full"
                >
                  <div className={`w-2 h-2 rounded-full ${folderColor} mr-1`} />
                  {folderName}
                </Badge>
              </div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-2"
              >
                {link.url}
                <ExternalLink className="w-3 h-3" />
              </a>
              {link.description && (
                <p className="text-sm text-muted-foreground mb-3">
                  {link.description}
                </p>
              )}

              {link.labels && link.labels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {link.labels.map((label) => (
                    <span
                      key={label}
                      className="inline-flex items-center px-2 py-0.5 border border-gray-300 rounded-full text-xs font-bold"
                    >
                      <Tag className="w-3 h-3 mr-1 flex-shrink-0" />
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-1 ml-4">
              <Button
                variant="ghost"
                size="default"
                onClick={() => {
                  setEditingLink(link);
                  setLinkDialogOpen(true);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="default"
                onClick={() => {
                  deleteLink(link.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  );
};
