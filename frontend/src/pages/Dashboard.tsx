import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import UserMenu from "@/components/UserMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Dashboard = () => {
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
              title="Total Earning"
              value="45,678.90 DH"
            />
            <StatCard
              title="This Month Earning"
              value="10,540.00 DH"
              subtitle="+33% month over last month"
              subtitleColor="success"
            />
            <StatCard
              title="Total Members"
              value="476"
              subtitle="-8% month over last month"
              subtitleColor="error"
            />
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

export default Dashboard;
