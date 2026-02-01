"use client"

import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, Award, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface RevenueAnalytics {
  totalRevenue: number;
  orderCount: number;
  revenueByDate: Record<string, number>;
}

interface TopMeal {
  mealId: string;
  name: string;
  image: string | null;
  price: number;
  totalQuantity: number;
  orderCount: number;
  revenue: number;
}

const ProviderAnalytics = () => {
  const { user } = useAuth();
  const [revenueData, setRevenueData] = useState<RevenueAnalytics | null>(null);
  const [topMeals, setTopMeals] = useState<TopMeal[]>([]);
  const [isLoadingRevenue, setIsLoadingRevenue] = useState(false);
  const [isLoadingMeals, setIsLoadingMeals] = useState(false);
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (user) {
      fetchRevenueAnalytics();
      fetchTopMeals();
    }
  }, [user]);

  const fetchRevenueAnalytics = async () => {
    try {
      setIsLoadingRevenue(true);
      const result = await api.get<RevenueAnalytics>(
        `/api/provider/analytics/${user?.id}/revenue?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );

      if (result.success && result.data) {
        setRevenueData(result.data);
      } else {
        toast.error("Failed to load revenue analytics");
      }
    } catch (error) {
      console.error("Error fetching revenue analytics:", error);
      toast.error("An error occurred while loading analytics");
    } finally {
      setIsLoadingRevenue(false);
    }
  };

  const fetchTopMeals = async () => {
    try {
      setIsLoadingMeals(true);
      const result = await api.get<TopMeal[]>(
        `/api/provider/analytics/${user?.id}/top-meals?limit=${limit}`
      );

      if (result.success && result.data) {
        setTopMeals(result.data);
      } else {
        toast.error("Failed to load top meals");
      }
    } catch (error) {
      console.error("Error fetching top meals:", error);
      toast.error("An error occurred while loading top meals");
    } finally {
      setIsLoadingMeals(false);
    }
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    fetchRevenueAnalytics();
  };

  return (
    <div className="container py-8 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics</h1>
        <p className="text-muted-foreground">Track your revenue and best-selling meals</p>
      </div>

      {/* Revenue Analytics Section */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Date Range Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleApplyFilters} disabled={isLoadingRevenue} className="w-full">
                  {isLoadingRevenue ? "Loading..." : "Apply Filters"}
                </Button>
              </div>
            </div>

            {/* Revenue Stats */}
            {revenueData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg border bg-emerald-50 border-emerald-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-emerald-100">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                  <p className="text-3xl font-bold text-emerald-700">
                    ${revenueData.totalRevenue.toFixed(2)}
                  </p>
                </div>

                <div className="p-6 rounded-lg border bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-700">
                    {revenueData.orderCount}
                  </p>
                </div>

                <div className="p-6 rounded-lg border bg-purple-50 border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Avg per Order</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-700">
                    ${revenueData.orderCount > 0 
                      ? (revenueData.totalRevenue / revenueData.orderCount).toFixed(2) 
                      : "0.00"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Selling Meals Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Selling Meals
            </CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="limit" className="text-sm">Show:</Label>
              <select
                id="limit"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setTimeout(() => fetchTopMeals(), 100);
                }}
                className="px-3 py-1 border rounded-md text-sm"
              >
                <option value={5}>Top 5</option>
                <option value={10}>Top 10</option>
                <option value={20}>Top 20</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingMeals ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading top meals...</p>
            </div>
          ) : topMeals.length > 0 ? (
            <div className="space-y-4">
              {topMeals.map((meal, index) => (
                <div
                  key={meal.mealId}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 font-bold text-primary">
                      #{index + 1}
                    </div>
                    {meal.image && (
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{meal.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${meal.price.toFixed(2)} per unit
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity Sold</p>
                      <p className="text-lg font-bold text-foreground">{meal.totalQuantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Orders</p>
                      <p className="text-lg font-bold text-foreground">{meal.orderCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-lg font-bold text-emerald-600">
                        ${meal.revenue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No sales data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderAnalytics;