import { TrendingUp, Users, Package, DollarSign } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsOverview() {
  const stats = [
    {
      title: "Total Users",
      value: "2,547",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Active Artworks",
      value: "1,234",
      change: "+8%",
      changeType: "positive" as const,
      icon: Package,
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-none shadow-sm rounded-none bg-gray-100 rounded-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#A67C52]">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-[#C8977F]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#8A5A3B]">{stat.value}</div>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}