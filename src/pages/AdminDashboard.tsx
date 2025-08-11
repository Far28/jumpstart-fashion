import { useState, useEffect } from 'react';
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  ShoppingBag, 
  Star,
  Package,
  Store,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin
} from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

// Mock data for demonstration
const sentimentTrendData = [
  { month: 'Jan', positive: 78, negative: 12, neutral: 10 },
  { month: 'Feb', positive: 82, negative: 10, neutral: 8 },
  { month: 'Mar', positive: 75, negative: 15, neutral: 10 },
  { month: 'Apr', positive: 85, negative: 8, neutral: 7 },
  { month: 'May', positive: 88, negative: 7, neutral: 5 },
  { month: 'Jun', positive: 91, negative: 5, neutral: 4 },
];

const collectionPerformance = [
  { collection: 'Women\'s Summer', sales: 1250, sentiment: 4.8, growth: 15 },
  { collection: 'Men\'s Formal', sales: 890, sentiment: 4.6, growth: 8 },
  { collection: 'Accessories', sales: 650, sentiment: 4.7, growth: 22 },
  { collection: 'Sale Items', sales: 1100, sentiment: 4.4, growth: -5 },
];

const issueCategories = [
  { name: 'Sizing Issues', value: 35, color: '#ef4444' },
  { name: 'Delivery Delays', value: 28, color: '#f97316' },
  { name: 'Quality Concerns', value: 20, color: '#eab308' },
  { name: 'Product Mismatch', value: 12, color: '#06b6d4' },
  { name: 'Other', value: 5, color: '#6b7280' },
];

const storeMetrics = [
  { region: 'Northeast', stores: 185, performance: 92 },
  { region: 'Southeast', stores: 210, performance: 88 },
  { region: 'Midwest', stores: 160, performance: 85 },
  { region: 'Southwest', stores: 120, performance: 90 },
  { region: 'West Coast', stores: 75, performance: 95 },
];

const AdminDashboard = () => {
  const [alertsCount, setAlertsCount] = useState(3);
  const [totalStores] = useState(750);
  const [totalReviews] = useState(12847);
  const [avgSentiment] = useState(4.7);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                JumpStart Fashion Management Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                AI-powered insights for our 750+ stores nationwide
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                System Healthy
              </Badge>
              {alertsCount > 0 && (
                <Badge variant="destructive">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {alertsCount} Alerts
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStores.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Nationwide locations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReviews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Sentiment</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgSentiment}/5.0</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.2</span> vs last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{alertsCount}</div>
              <p className="text-xs text-muted-foreground">
                Require attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="sentiment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sentiment">Sentiment Analytics</TabsTrigger>
            <TabsTrigger value="collections">Collection Performance</TabsTrigger>
            <TabsTrigger value="issues">Issue Analysis</TabsTrigger>
            <TabsTrigger value="stores">Store Network</TabsTrigger>
            <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          </TabsList>

          {/* Sentiment Analytics Tab */}
          <TabsContent value="sentiment" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Trend Analysis</CardTitle>
                  <CardDescription>6-month sentiment evolution across all channels</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={sentimentTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Real-time Sentiment Monitoring</CardTitle>
                  <CardDescription>Live sentiment analysis from customer feedback</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Positive Reviews</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Negative Reviews</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                  <Progress value={8} className="h-2 bg-red-100" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Neutral Reviews</span>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                  <Progress value={5} className="h-2 bg-gray-100" />

                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <TrendingUp className="inline h-4 w-4 text-green-600 mr-1" />
                      Sentiment trending positive this week
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Collection Performance Tab */}
          <TabsContent value="collections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Collection Performance Metrics</CardTitle>
                <CardDescription>Sales performance and customer sentiment by collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {collectionPerformance.map((collection, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{collection.collection}</h4>
                        <p className="text-sm text-muted-foreground">
                          {collection.sales} units sold • {collection.sentiment}/5.0 sentiment
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center gap-1 ${collection.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {collection.growth > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          <span className="font-medium">{Math.abs(collection.growth)}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">vs last month</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issue Analysis Tab */}
          <TabsContent value="issues" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Issue Distribution</CardTitle>
                  <CardDescription>Customer complaint categories from AI analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={issueCategories}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {issueCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Issue Trends & Actions</CardTitle>
                  <CardDescription>Trending issues and recommended actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 border-l-4 border-red-500 bg-red-50">
                    <h4 className="font-semibold text-red-800">Sizing Issues ↑</h4>
                    <p className="text-sm text-red-700">35% of complaints mention sizing problems</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Review Size Guide
                    </Button>
                  </div>

                  <div className="p-3 border-l-4 border-orange-500 bg-orange-50">
                    <h4 className="font-semibold text-orange-800">Delivery Delays ↑</h4>
                    <p className="text-sm text-orange-700">28% of complaints about delivery times</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Check Logistics
                    </Button>
                  </div>

                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <h4 className="font-semibold text-green-800">Quality Concerns ↓</h4>
                    <p className="text-sm text-green-700">Down 5% from last month</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Store Network Tab */}
          <TabsContent value="stores" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Network Performance</CardTitle>
                <CardDescription>Performance metrics across our 750+ stores nationwide</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {storeMetrics.map((region, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h4 className="font-semibold">{region.region}</h4>
                          <p className="text-sm text-muted-foreground">{region.stores} stores</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{region.performance}%</div>
                        <p className="text-xs text-muted-foreground">Performance Score</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800">Network Summary</h4>
                  <p className="text-sm text-blue-700">
                    750 stores operating with 90% average performance score. 
                    West Coast leading with 95% performance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Alerts & Notifications</CardTitle>
                <CardDescription>Issues requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-800">High Priority</h4>
                    <Badge variant="destructive">New</Badge>
                  </div>
                  <p className="text-sm text-red-700">
                    Sudden spike in sizing complaints for Women's Summer Collection (15% increase in 24h)
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm">Investigate</Button>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>

                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <h4 className="font-semibold text-orange-800">Medium Priority</h4>
                  </div>
                  <p className="text-sm text-orange-700">
                    Delivery performance declining in Northeast region (3 stores affected)
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm">Review Logistics</Button>
                    <Button variant="outline" size="sm">Contact Stores</Button>
                  </div>
                </div>

                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-800">Low Priority</h4>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Monthly sentiment report ready for review (June 2025)
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm">Download Report</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
