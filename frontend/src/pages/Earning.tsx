import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import UserMenu from "@/components/UserMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Earning = () => {
  // Sample data
  const membersList = [
    { name: "Ahmed Ali", cose: "subscraption", price: "400 Dh" },
    { name: "Mouhamed Hamouch", cose: "subscraption", price: "300 Dh" },
    { name: "Aya Ibno El fakir", cose: "subscraption", price: "100 Dh" },
    { name: "Amine mohamed", cose: "subscraption", price: "1000 Dh" },
    { name: "Wiam bnt Iblad", cose: "subscraption", price: "2000 Dh" },
    { name: "Soufyan Zid", cose: "subscraption", price: "200 Dh" },
    { name: "Youssef malik", cose: "subscraption", price: "200 Dh" },
    { name: "Youssef malik", cose: "subscraption", price: "200 Dh" },
  ];

  const monthlyData = [
    { month: "Jan", value: 25000 },
    { month: "Feb", value: 32000 },
    { month: "Mar", value: 28000 },
    { month: "Apr", value: 35000 },
    { month: "May", value: 29000 },
    { month: "Jun", value: 32000 },
    { month: "Jul", value: 27000 },
    { month: "Aug", value: 38000 },
    { month: "Sep", value: 42000 },
    { month: "Oct", value: 45000 },
    { month: "Nov", value: 43000 },
    { month: "Dec", value: 40000 },
  ];

  const thisMonthData = [
    { day: 1, value: 25000 },
    { day: 5, value: 27000 },
    { day: 10, value: 29000 },
    { day: 15, value: 32000 },
    { day: 20, value: 35000 },
    { day: 25, value: 38000 },
    { day: 30, value: 40000 },
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

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Members List Table */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Members List</h3>
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-primary font-semibold">Name</TableHead>
                    <TableHead className="text-primary font-semibold">Cose</TableHead>
                    <TableHead className="text-primary font-semibold">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membersList.map((member, index) => (
                    <TableRow key={index} className="border-border">
                      <TableCell className="font-medium text-foreground">{member.name}</TableCell>
                      <TableCell className="text-foreground">{member.cose}</TableCell>
                      <TableCell className="text-foreground">{member.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Charts */}
            <div className="space-y-6">
              {/* This Month Chart */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={thisMonthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Earning Chart */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Monthly erning</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "hsl(var(--card))", 
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Earning;
