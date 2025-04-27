import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

function Dashboard() {
  const { products, loading } = useSelector((state) => state.products);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <h1 className="text-3xl font-black underline">Wecome</h1>
    </>
  );
}

export default Dashboard;


// import { Box, Package, PackageX, AlertTriangle, Sun, Moon } from "lucide-react"
// import { cn } from "../lib/utils"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
// import { ScrollArea } from "./ui/scroll-area";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts"
// import { useTheme } from '../context/themeContext';

// const monthlyData = [
//   { month: "Jan", sales: 4000, target: 4500, avgPrice: 350 },
//   { month: "Feb", sales: 3000, target: 4500, avgPrice: 320 },
//   { month: "Mar", sales: 2000, target: 4500, avgPrice: 380 },
//   { month: "Apr", sales: 2780, target: 4500, avgPrice: 390 },
//   { month: "May", sales: 1890, target: 4500, avgPrice: 400 },
//   { month: "Jun", sales: 2390, target: 4500, avgPrice: 380 },
//   { month: "Jul", sales: 3490, target: 4500, avgPrice: 410 },
//   { month: "Aug", sales: 4000, target: 4500, avgPrice: 395 },
//   { month: "Sep", sales: 3000, target: 4500, avgPrice: 380 },
//   { month: "Oct", sales: 2000, target: 4500, avgPrice: 375 },
//   { month: "Nov", sales: 2780, target: 4500, avgPrice: 390 },
//   { month: "Dec", sales: 1890, target: 4500, avgPrice: 400 },
// ]

// const recentSales = [
//   { item: "Printer Paper A4", quantity: 50, amount: "$2,500", customer: "Office Depot", timestamp: "2 minutes ago" },
//   { item: "Office Chairs", quantity: 10, amount: "$4,500", customer: "Corporate Solutions", timestamp: "1 hour ago" },
//   { item: "Desk Organizers", quantity: 100, amount: "$1,500", customer: "Workspace Pro", timestamp: "3 hours ago" },
//   { item: "Filing Cabinets", quantity: 5, amount: "$3,000", customer: "Modern Office", timestamp: "5 hours ago" },
// ]

// const recentPurchases = [
//   { item: "Ink Cartridge Black", quantity: 100, amount: "$1,200", supplier: "Tech Supplies Inc", timestamp: "15 minutes ago" },
//   { item: "Desk Lamps", quantity: 50, amount: "$3,200", supplier: "Lightning Co", timestamp: "2 hours ago" },
//   { item: "Paper Clips", quantity: 1000, amount: "$300", supplier: "Office Basics", timestamp: "4 hours ago" },
//   { item: "Notebooks", quantity: 200, amount: "$800", supplier: "Paper Products", timestamp: "6 hours ago" },
// ]

// const stockSummary = [
//   { label: "Total Products", value: "1,234", change: "+15", trend: "up", icon: Package },
//   { label: "Out of Stock", value: "23", change: "-5", trend: "down", icon: PackageX },
//   { label: "Low Stock", value: "45", change: "+12", trend: "up", icon: AlertTriangle },
//   { label: "Total Sales", value: "$254,300", change: "+12%", trend: "up", icon: Box },
// ]

// function Dashboard() {
//     const { theme, toggleTheme } = useTheme();
//   return (
//       <div className="min-h-screen bg-background">
//         <main>

//           <div className="p-6">
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//               {stockSummary.map((item) => (
//                 <Card key={item.label}>
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">
//                       {item.label}
//                     </CardTitle>
//                     <item.icon className={cn(
//                       "h-4 w-4",
//                       item.trend === "up" ? "text-emerald-500" : "text-red-500"
//                     )} />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold">{item.value}</div>
//                     <p className={cn(
//                       "text-xs",
//                       item.trend === "up" ? "text-emerald-500" : "text-red-500"
//                     )}>
//                       {item.change}
//                     </p>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>

//             <Card className="mt-6">
//               <CardHeader>
//                 <CardTitle>Monthly Sales Performance</CardTitle>
//                 <CardDescription>Sales vs Target with Average Price Trend</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="h-[400px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={monthlyData}>
//                       <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
//                       <XAxis 
//                         dataKey="month"
//                         allowDecimals={false}
//                         axisLine={true}
//                         tickLine={true}
//                         fontSize={12}
//                         padding={{ left: 0, right: 0 }}
//                         tickMargin={8}
//                       />
//                       <YAxis 
//                         yAxisId="left"
//                         allowDecimals={false}
//                         axisLine={true}
//                         tickLine={true}
//                         fontSize={12}
//                         tickMargin={8}
//                       />
//                       <YAxis 
//                         yAxisId="right"
//                         orientation="right"
//                         domain={[0, 500]}
//                         allowDecimals={false}
//                         axisLine={true}
//                         tickLine={true}
//                         fontSize={12}
//                         tickMargin={8}
//                       />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: "hsl(var(--card))",
//                           border: "1px solid hsl(var(--border))",
//                         }}
//                       />
//                       <Legend wrapperStyle={{ paddingTop: "8px" }} />
//                       <Line
//                         yAxisId="left"
//                         type="monotone"
//                         dataKey="sales"
//                         stroke="hsl(var(--chart-1))"
//                         strokeWidth={2}
//                         name="Sales"
//                         dot={false}
//                       />
//                       <Line
//                         yAxisId="left"
//                         type="monotone"
//                         dataKey="target"
//                         stroke="hsl(var(--chart-2))"
//                         strokeWidth={2}
//                         strokeDasharray="5 5"
//                         name="Target"
//                         dot={false}
//                       />
//                       <Line
//                         yAxisId="right"
//                         type="monotone"
//                         dataKey="avgPrice"
//                         stroke="hsl(var(--chart-3))"
//                         strokeWidth={2}
//                         name="Avg Price"
//                         dot={false}
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="mt-6 grid gap-6 md:grid-cols-2">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Recent Sales</CardTitle>
//                   <CardDescription>Latest sales activities</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <ScrollArea className="h-[300px]">
//                     <div className="space-y-4">
//                       {recentSales.map((sale, i) => (
//                         <div
//                           key={i}
//                           className="flex items-center justify-between rounded-lg border p-4"
//                         >
//                           <div>
//                             <p className="font-medium">{sale.item}</p>
//                             <p className="text-sm text-muted-foreground">
//                               {sale.customer} • {sale.quantity} units
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-medium">{sale.amount}</p>
//                             <p className="text-sm text-muted-foreground">
//                               {sale.timestamp}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </ScrollArea>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Recent Purchases</CardTitle>
//                   <CardDescription>Latest purchase activities</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <ScrollArea className="h-[300px]">
//                     <div className="space-y-4">
//                       {recentPurchases.map((purchase, i) => (
//                         <div
//                           key={i}
//                           className="flex items-center justify-between rounded-lg border p-4"
//                         >
//                           <div>
//                             <p className="font-medium">{purchase.item}</p>
//                             <p className="text-sm text-muted-foreground">
//                               {purchase.supplier} • {purchase.quantity} units
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-medium">{purchase.amount}</p>
//                             <p className="text-sm text-muted-foreground">
//                               {purchase.timestamp}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </ScrollArea>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </main>
//       </div>
//   )
// }

// export default Dashboard;
