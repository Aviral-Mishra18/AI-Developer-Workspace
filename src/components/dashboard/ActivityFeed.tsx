import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GitCommit, GitPullRequest, GitMerge, AlertCircle, MessageSquare, Cpu } from "lucide-react";

export interface ActivityFeedItem {
  id: string;
  type: string;
  action: string;
  target: string;
  time: string;
  user: {
    name: string;
    avatar: string;
  };
}

export function ActivityFeed({ data }: { data: ActivityFeedItem[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "commit":
        return <GitCommit className="h-4 w-4 text-sky-500" />;
      case "pr":
        return <GitPullRequest className="h-4 w-4 text-emerald-500" />;
      case "merge":
        return <GitMerge className="h-4 w-4 text-indigo-500" />;
      case "issue":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-pink-500" />;
      case "deploy":
        return <Cpu className="h-4 w-4 text-purple-500" />;
      default:
        return <GitCommit className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <Card className="border border-border bg-card shadow-sm h-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
        <CardDescription>Workspace activity timeline across all projects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6 space-y-6 after:absolute after:inset-y-0 after:left-2.5 after:w-px after:bg-border/60">
          {data.map((item) => (
            <div key={item.id} className="relative flex items-start gap-3 text-sm">
              <div className="absolute -left-6 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border shadow-sm">
                {getIcon(item.type)}
              </div>
              <Avatar className="h-7 w-7 border border-border">
                <AvatarImage src={item.user.avatar} alt={item.user.name} />
                <AvatarFallback>{item.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1 min-w-0">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground hover:underline cursor-pointer">
                    {item.user.name}
                  </span>{" "}
                  {item.action}{" "}
                  <span className="font-medium text-foreground hover:underline cursor-pointer truncate inline-block max-w-[180px] align-bottom">
                    {item.target}
                  </span>
                </p>
                <p className="text-[10px] text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
