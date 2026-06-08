import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FolderGit, Database, Shield, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface WorkspaceCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  projectCount: number;
  storage: string;
  visibility: "public" | "private";
  lastActivity: string;
}

export function WorkspaceCard({
  id,
  name,
  description,
  memberCount,
  projectCount,
  storage,
  visibility,
  lastActivity,
}: WorkspaceCardProps) {
  return (
    <Card className="border border-border bg-card shadow-sm hover:shadow-md transition-all flex flex-col h-full group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg font-semibold tracking-tight truncate group-hover:text-primary transition-colors">
            <Link href={`/workspaces/${id}`}>{name}</Link>
          </CardTitle>
          <Badge
            variant={visibility === "private" ? "secondary" : "outline"}
            className="capitalize flex items-center gap-1 shrink-0"
          >
            {visibility === "private" ? (
              <Shield className="h-3 w-3" />
            ) : (
              <Globe className="h-3 w-3" />
            )}
            {visibility}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 min-h-[40px] leading-relaxed pt-1">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-1">
        <div className="grid grid-cols-3 gap-2 text-xs py-3 border-y border-border/50 text-muted-foreground">
          <div className="flex flex-col items-center gap-1 justify-center">
            <Users className="h-4 w-4 text-foreground/70" />
            <span className="font-semibold text-foreground">{memberCount}</span>
            <span>Members</span>
          </div>
          <div className="flex flex-col items-center gap-1 justify-center border-x border-border/50">
            <FolderGit className="h-4 w-4 text-foreground/70" />
            <span className="font-semibold text-foreground">{projectCount}</span>
            <span>Projects</span>
          </div>
          <div className="flex flex-col items-center gap-1 justify-center">
            <Database className="h-4 w-4 text-foreground/70" />
            <span className="font-semibold text-foreground">{storage}</span>
            <span>Storage</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex items-center justify-between text-xs text-muted-foreground mt-auto">
        <span>Active {lastActivity}</span>
        <Button variant="ghost" size="sm" render={<Link href={`/workspaces/${id}`} />} nativeButton={false} className="h-8 font-medium">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
