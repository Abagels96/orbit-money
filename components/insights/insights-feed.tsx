import { Card } from "@/components/ui/card";
import { mockInsights } from "@/data";
import { cn } from "@/lib/cn";

export function InsightsFeed() {
  return (
    <div className="space-y-4">
      {mockInsights.map((item, i) => (
        <Card
          key={item.id}
          className={cn(
            "p-6 sm:p-7",
            i === 0 && "lg:ml-0 lg:mr-12",
            i === 1 && "lg:ml-8 lg:mr-0"
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-400/80">
            {item.deltaLabel}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">{item.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.body}</p>
        </Card>
      ))}
    </div>
  );
}
