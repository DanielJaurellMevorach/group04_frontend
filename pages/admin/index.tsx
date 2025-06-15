"use client"
import { BarChart3, Package, Settings, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsOverview } from "@/components/admin/StatsOverview"
import Navbar from "@/components/navbar"
import { useEffect, useState } from "react"

export default function AdminDashboard() {
  const [isAdmin,setIsAdmin] = useState(false);

  useEffect(() => {
    if(sessionStorage.getItem("role") === "admin") {
      setIsAdmin(true);
    }
  }, [])
  if (!isAdmin) {
    return ( 
      <div className="min-h-screen bg-[#F9F2EA]">
              <Navbar />
              <div className="container mx-auto px-4 py-8 ">
                <p className="text-3xl font-light tracking-wider text-[#8A5A3B] mb-2">This Is admin only page!</p>
              </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-[#F9F2EA]">
      <Navbar />
      <div className="container mx-auto px-4 py-8 ">
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-wider text-[#8A5A3B] mb-2">
            Admin <span className="font-medium">Dashboard</span>
          </h1>
          <p className="text-[#A67C52]">Manage your art boutique platform</p>
        </div>

        {/* Stats Overview */}
        <StatsOverview />
        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-8">
          <Card className="border-none shadow-sm rounded-none bg-white hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-[#8A5A3B]">Users</CardTitle>
                <Users className="h-6 w-6 text-[#C8977F]" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#A67C52] mb-3">Manage registered users and their accounts</p>
              <a href="/admin/users" className="text-[#C8977F] hover:text-[#B78370] text-sm font-medium">
                Manage Users →
              </a>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-none bg-white hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-[#8A5A3B]">Artworks</CardTitle>
                <Package className="h-6 w-6 text-[#C8977F]" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#A67C52] mb-3">Manage art pieces and their visibility</p>
              <a href="/admin/artworks" className="text-[#C8977F] hover:text-[#B78370] text-sm font-medium">
                Manage Artworks →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}