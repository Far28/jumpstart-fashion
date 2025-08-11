import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  PieChart,
  Clock,
  Users
} from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SentimentTrendData {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  totalReviews: number;
}

interface IssueTrend {
  category: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  impact: 'high' | 'medium' | 'low';
}

interface EnhancedSentimentAnalysisProps {
  productId?: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

// Mock data for advanced sentiment analysis
const mockTrendData: SentimentTrendData[] = [
  { date: '2025-08-03', positive: 82, negative: 12, neutral: 6, totalReviews: 45 },
  { date: '2025-08-04', positive: 78, negative: 15, neutral: 7, totalReviews: 52 },
  { date: '2025-08-05', positive: 85, negative: 10, neutral: 5, totalReviews: 38 },
  { date: '2025-08-06', positive: 91, negative: 6, neutral: 3, totalReviews: 41 },
  { date: '2025-08-07', positive: 76, negative: 18, neutral: 6, totalReviews: 67 },
  { date: '2025-08-08', positive: 88, negative: 8, neutral: 4, totalReviews: 55 },
  { date: '2025-08-09', positive: 92, negative: 5, neutral: 3, totalReviews: 49 },
];

const mockIssues: IssueTrend[] = [
  { category: 'Sizing Issues', count: 23, trend: 'up', percentage: 15, impact: 'high' },
  { category: 'Delivery Delays', count: 18, trend: 'down', percentage: -8, impact: 'medium' },
  { category: 'Quality Concerns', count: 12, trend: 'stable', percentage: 2, impact: 'medium' },
  { category: 'Color Mismatch', count: 8, trend: 'up', percentage: 12, impact: 'low' },
  { category: 'Fabric Feel', count: 5, trend: 'down', percentage: -20, impact: 'low' },
];

export const EnhancedSentimentAnalysis: React.FC<EnhancedSentimentAnalysisProps> = ({ 
  productId, 
  timeRange = '30d' 
}) => {
  const [trendData, setTrendData] = useState<SentimentTrendData[]>(mockTrendData);
  const [issueData, setIssueData] = useState<IssueTrend[]>(mockIssues);
  const [loading, setLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  useEffect(() => {
    fetchSentimentTrends();
  }, [productId, selectedTimeRange]);

  const fetchSentimentTrends = async () => {
    setLoading(true);
    try {
      // In real implementation, fetch from API with filters
      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      setTrendData(mockTrendData);
      setIssueData(mockIssues);
    } catch (error) {
      console.error('Error fetching sentiment trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentSentiment = trendData.length > 0 ? trendData[trendData.length - 1] : null;
  const previousSentiment = trendData.length > 1 ? trendData[trendData.length - 2] : null;
  
  const sentimentChange = currentSentiment && previousSentiment 
    ? currentSentiment.positive - previousSentiment.positive 
    : 0;

  const criticalIssues = issueData.filter(issue => 
    issue.impact === 'high' && issue.trend === 'up'
  );

  const getTrendIcon = (trend: string, percentage: number) => {
    if (trend === 'up') return <TrendingUp className={`h-4 w-4 ${percentage > 10 ? 'text-red-500' : 'text-yellow-500'}`} />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <BarChart3 className="h-4 w-4 text-gray-500" />;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert for Critical Issues */}
      {criticalIssues.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Attention Required:</strong> {criticalIssues.length} critical issue{criticalIssues.length > 1 ? 's' : ''} trending upward. 
            Immediate action recommended for {criticalIssues.map(i => i.category).join(', ')}.
          </AlertDescription>
        </Alert>
      )}

      {/* Time Range Selector */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium">Time Range:</span>
        {(['7d', '30d', '90d', '1y'] as const).map((range) => (
          <Button
            key={range}
            variant={selectedTimeRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTimeRange(range)}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sentiment Trend Analysis
                </CardTitle>
                <CardDescription>
                  AI-powered sentiment tracking over time
                </CardDescription>
              </div>
              {currentSentiment && (
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {sentimentChange > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : sentimentChange < 0 ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <BarChart3 className="h-4 w-4 text-gray-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      sentimentChange > 0 ? 'text-green-600' : 
                      sentimentChange < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {sentimentChange > 0 ? '+' : ''}{sentimentChange.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">vs previous period</div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number, name: string) => [`${value}%`, name.charAt(0).toUpperCase() + name.slice(1)]}
                />
                <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} name="positive" />
                <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} name="negative" />
                <Line type="monotone" dataKey="neutral" stroke="#6b7280" strokeWidth={2} name="neutral" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Current Sentiment Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Current Sentiment Overview
            </CardTitle>
            <CardDescription>
              Real-time sentiment distribution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentSentiment && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      😊 Positive Reviews
                    </span>
                    <span className="text-sm font-bold text-green-600">{currentSentiment.positive}%</span>
                  </div>
                  <Progress value={currentSentiment.positive} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      😞 Negative Reviews
                    </span>
                    <span className="text-sm font-bold text-red-600">{currentSentiment.negative}%</span>
                  </div>
                  <Progress value={currentSentiment.negative} className="h-2 bg-red-100" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      😐 Neutral Reviews
                    </span>
                    <span className="text-sm font-bold text-gray-600">{currentSentiment.neutral}%</span>
                  </div>
                  <Progress value={currentSentiment.neutral} className="h-2 bg-gray-100" />
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Reviews</span>
                    <span className="font-medium">{currentSentiment.totalReviews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Score</span>
                    <span className="font-medium">
                      {((currentSentiment.positive * 5 + currentSentiment.neutral * 3 + currentSentiment.negative * 1) / 100).toFixed(1)}/5.0
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Issue Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Issue Trend Analysis
          </CardTitle>
          <CardDescription>
            Automated categorization and trending of customer complaints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issueData.map((issue, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getTrendIcon(issue.trend, Math.abs(issue.percentage))}
                  <div>
                    <h4 className="font-medium">{issue.category}</h4>
                    <p className="text-sm text-muted-foreground">
                      {issue.count} mentions
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`text-sm font-medium ${
                    issue.trend === 'up' ? 'text-red-600' : 
                    issue.trend === 'down' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {issue.trend === 'up' ? '+' : issue.trend === 'down' ? '-' : ''}
                    {Math.abs(issue.percentage)}%
                  </div>
                  <Badge variant={getImpactColor(issue.impact)}>
                    {issue.impact}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">AI Insights & Recommendations</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• <strong>Sizing Issues:</strong> Consider updating size guide or improving size recommendation algorithm</p>
              <p>• <strong>Delivery Performance:</strong> Positive trend - recent logistics improvements showing results</p>
              <p>• <strong>Quality Monitoring:</strong> Stable quality perception - maintain current standards</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSentimentAnalysis;
