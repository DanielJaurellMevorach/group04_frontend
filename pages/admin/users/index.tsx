"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, Eye, Mail, Calendar, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Navbar from "@/components/navbar"
import userService from "@/services/user.service"

export default function UsersManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const handleDeleteUser = async (userId: string) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      await userService.deleteUser(userId, token);
      // Refresh the users list after successful deletion
      getUsers(token);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }


  const [isAdmin, setIsAdmin] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false); // flag to prevent premature render
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)


  const getUsers = async (token : string | null) => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers(token);
  
      console.log(response, "these are users");
  
      if (response.users && Array.isArray(response.users.users)) {
        setData(response.users.users);
      } else if (response.users && Array.isArray(response.users)) {
        setData(response.users);
        console.log(data);
      } else {
        setData([]); 
        console.warn("Unexpected data format for users");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const role = sessionStorage.getItem("role");
    let token;
    if (role === "admin") {
      token = sessionStorage.getItem("token")
      setIsAdmin(true);
      getUsers(token);
    }
    setCheckedAuth(true);    
  }, []);
  
  if (!checkedAuth) {
    return null; // or a loading spinner if you'd like
  }
  const filteredUsers = data?.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesRole
  })
  if (!isAdmin) {
    return ( 
      <div className="min-h-screen bg-[#F9F2EA]">
        <Navbar />
        <div className="container mx-auto px-4 py-8 ">
          <p className="text-3xl font-light tracking-wider text-[#8A5A3B] mb-2">
            This is an admin-only page!
          </p>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F2EA]">
      <Navbar />
      <div className="container mx-auto px-4 py-8 ">
        <p className="text-3xl font-light tracking-wider text-[#8A5A3B] mb-2">
          LOADING.....
        </p>
      </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F9F2EA]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-wider text-[#8A5A3B] mb-2">
            User <span className="font-medium">Management</span>
          </h1>
          <p className="text-[#A67C52]">Manage registered users and their accounts</p>
        </div>

        <Card className="border-none shadow-sm rounded-none bg-white">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-xl font-medium text-[#8A5A3B]">All Users ({data?.length})</CardTitle>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A67C52]" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-[#E8D7C9] rounded-none focus:border-[#C8977F] focus:ring-[#C8977F] w-full sm:w-64"
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="border-[#E8D7C9] rounded-none focus:border-[#C8977F] focus:ring-[#C8977F] w-full sm:w-32">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E8D7C9]">
                    <TableHead className="text-[#8A5A3B]">User</TableHead>
                    <TableHead className="text-[#8A5A3B]">Role</TableHead>
                    <TableHead className="text-[#8A5A3B]">Registration Date</TableHead>
                    <TableHead className="text-[#8A5A3B]">Artworks</TableHead>
                    <TableHead className="text-[#8A5A3B] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user) => (
                    <TableRow key={user.id} className="border-[#E8D7C9]">
                      <TableCell>
                        <div>
                          <div className="font-medium text-[#8A5A3B]">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-[#A67C52]">@{user.username}</div>
                          <div className="text-sm text-[#A67C52] flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === "admin" ? "bg-[#C8977F]/10 text-[#C8977F]" : "bg-[#A67C52]/10 text-[#A67C52]"
                          }`}
                        >
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-[#A67C52]">
                          <Calendar className="h-3 w-3" />
                          {user?.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'Loading...'}
                        </div>
                      </TableCell>
                      <TableCell className="text-[#A67C52]">{user?.createdPieces?.length}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-red-300 text-red-600 hover:bg-red-50 rounded-none"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white rounded-none">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-[#8A5A3B]">Delete User</AlertDialogTitle>
                                <AlertDialogDescription className="text-[#A67C52]">
                                  Are you sure you want to delete {user.firstName} {user.lastName}? This action cannot be undone and will
                                  remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-[#E8D7C9] text-[#A67C52] hover:bg-[#F3EAE0] rounded-none">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white rounded-none"
                                >
                                  Delete User
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers?.length === 0 && (
              <div className="text-center py-8">
                <p className="text-[#A67C52]">No users found matching your search criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
