import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import UserMenu from "@/components/UserMenu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Members = () => {
  // Sample data
  const members = [
    { name: "Rufus Shannon", phone: "0600000000", date: "2025-11-15 22:53 GMT", createdBy: "Rufus Shannon", status: "active" as const },
    { name: "Stephen Snow...", phone: "0600000000", date: "2025-11-15 22:53 GMT", createdBy: "Rufus Shannon", status: "orange" as const },
    { name: "Peter Walker...", phone: "0600000000", date: "2025-11-15 22:53 GMT", createdBy: "Rufus Shannon", status: "frozen" as const },
    { name: "Aaron Richards...", phone: "0600000000", date: "2025-11-15 22:53 GMT", createdBy: "Rufus Shannon", status: "pending" as const },
    { name: "Joe Hagen...", phone: "0600000000", date: "2025-11-15 22:53 GMT", createdBy: "Rufus Shannon", status: "active" as const },
    { name: "Claude Glover...", phone: "0600000000", date: "2025-11-15 22:53 GMT", createdBy: "Rufus Shannon", status: "cancelled" as const },
    { name: "William Kessler...", phone: "0600000000", date: "2025-11-15 22:53 GMT", createdBy: "Rufus Shannon", status: "active" as const },
    { name: "Jessie Dickson...", phone: "0600000000", date: "2025-11-15 22:53 GMT", createdBy: "Rufus Shannon", status: "active" as const },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-end px-6">
          <UserMenu />
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Members"
              value="571"
            />
            <StatCard
              title="Total Active"
              value="300"
              subtitle="+33% month over last month"
              subtitleColor="success"
            />
            <StatCard
              title="This Month"
              value="476"
              subtitle="-8% month over last month"
              subtitleColor="error"
            />
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              <Input
                placeholder="Search ..."
                className="pl-10 h-12 bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="outline" className="h-12 px-6 border-border bg-card hover:bg-secondary">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              ADD
            </Button>
          </div>

          {/* Table */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-primary font-semibold">Name</TableHead>
                  <TableHead className="text-primary font-semibold">Phone</TableHead>
                  <TableHead className="text-primary font-semibold">Date</TableHead>
                  <TableHead className="text-primary font-semibold">create By</TableHead>
                  <TableHead className="text-primary font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow key={index} className="border-border">
                    <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                    <TableCell className="text-foreground">{member.phone}</TableCell>
                    <TableCell className="text-foreground">{member.date}</TableCell>
                    <TableCell className="text-foreground">{member.createdBy}</TableCell>
                    <TableCell>
                      <StatusBadge status={member.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Members;
