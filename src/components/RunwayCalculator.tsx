
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { calculateRunway } from "@/utils/calculatorLogic";
import { downloadRunwayPdf } from "@/utils/pdfGenerator";
import { sendRunwayEmail } from "@/utils/emailSender";
import { RunwayData } from "@/types/calculator";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BadgeIndianRupee, Mail, Download, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const RunwayCalculator = () => {
  const [totalCash, setTotalCash] = useState<number>(1000000);
  const [monthlyBurn, setMonthlyBurn] = useState<number>(200000);
  const [additionalFunding, setAdditionalFunding] = useState<number>(0);
  const [growthRate, setGrowthRate] = useState<number>(5);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(50000);
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculatorData, setCalculatorData] = useState<RunwayData | null>(null);
  const { toast } = useToast();

  // Calculate on initial load and when inputs change
  useEffect(() => {
    handleCalculate();
  }, []);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      try {
        const result = calculateRunway(
          totalCash,
          monthlyBurn,
          additionalFunding,
          growthRate,
          monthlyRevenue
        );
        
        setCalculatorData(result);
        setIsCalculating(false);
      } catch (error) {
        console.error("Calculation error:", error);
        toast({
          title: "Calculation Error",
          description: "There was an error calculating the runway. Please check your inputs and try again.",
          variant: "destructive",
        });
        setIsCalculating(false);
      }
    }, 500);
  };

  const handleDownloadPdf = () => {
    if (!calculatorData) return;
    
    try {
      downloadRunwayPdf(calculatorData);
      
      toast({
        title: "PDF Downloaded",
        description: "Your runway analysis has been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF download error:", error);
      toast({
        title: "Download Error",
        description: "There was an error downloading the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async () => {
    if (!calculatorData || !emailAddress) return;
    
    if (!emailAddress.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    await sendRunwayEmail(emailAddress, calculatorData);
  };

  // Prepare chart data
  const chartData = calculatorData?.projectedData.map(data => ({
    name: `Month ${data.month + 1}`,
    cash: Math.round(data.remaining),
    revenue: Math.round(data.revenue),
    burn: Math.round(data.burn),
  })) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-cream">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Card */}
        <Card className="col-span-1 shadow-md border-t-4 border-t-primary animate-fadeIn">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <BadgeIndianRupee className="h-6 w-6" />
              Runway Calculator
            </CardTitle>
            <CardDescription>
              Calculate how long your startup's cash will last
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="totalCash">Total Available Cash (₹)</Label>
              <Input
                id="totalCash"
                type="number"
                min="0"
                value={totalCash}
                onChange={(e) => setTotalCash(Number(e.target.value))}
                className="input-focus"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthlyBurn">Monthly Burn Rate (₹)</Label>
              <Input
                id="monthlyBurn"
                type="number"
                min="0"
                value={monthlyBurn}
                onChange={(e) => setMonthlyBurn(Number(e.target.value))}
                className="input-focus"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthlyRevenue">Monthly Revenue (₹)</Label>
              <Input
                id="monthlyRevenue"
                type="number"
                min="0"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="input-focus"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="growthRate">Monthly Revenue Growth Rate (%)</Label>
              <Input
                id="growthRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={growthRate}
                onChange={(e) => setGrowthRate(Number(e.target.value))}
                className="input-focus"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalFunding">Additional Funding (₹)</Label>
              <Input
                id="additionalFunding"
                type="number"
                min="0"
                value={additionalFunding}
                onChange={(e) => setAdditionalFunding(Number(e.target.value))}
                className="input-focus"
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              {isCalculating ? "Calculating..." : "Calculate Runway"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Results Card */}
        <Card className="col-span-1 lg:col-span-2 shadow-md border-t-4 border-t-secondary animate-fadeIn">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Results</CardTitle>
            <CardDescription>
              Your startup's projected runway analysis
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {calculatorData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-charcoal mb-2">Runway Duration</h3>
                    <p className="text-3xl font-bold text-primary">
                      {calculatorData.runwayMonths} months
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-charcoal mb-2">Projected End Date</h3>
                    <p className="text-3xl font-bold text-primary">
                      {formatDate(calculatorData.runwayDate)}
                    </p>
                  </div>
                </div>
                
                <div className="h-80 w-full">
                  <ChartContainer 
                    className="mt-4" 
                    config={{
                      cash: { color: '#245e4f', label: 'Remaining Cash' },
                      revenue: { color: '#7ac9a7', label: 'Monthly Revenue' },
                      burn: { color: '#e9c46a', label: 'Monthly Burn' },
                    }}
                  >
                    <AreaChart
                      data={chartData.slice(0, 12)} // Show first 12 months
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis 
                        tickFormatter={(value) => `₹${(value/1000)}K`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="cash" 
                        name="Remaining Cash" 
                        stroke="#245e4f" 
                        fill="#245e4f" 
                        fillOpacity={0.2} 
                        activeDot={{ r: 8 }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        name="Monthly Revenue" 
                        stroke="#7ac9a7" 
                        fill="#7ac9a7" 
                        fillOpacity={0.2} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="burn" 
                        name="Monthly Burn" 
                        stroke="#e9c46a" 
                        fill="#e9c46a" 
                        fillOpacity={0.2} 
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleDownloadPdf}
                    className="flex-1 border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download PDF Report
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1 bg-accent hover:bg-accent/90 text-charcoal">
                        <Mail className="mr-2 h-4 w-4" /> Email Results
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Email Your Runway Analysis</DialogTitle>
                        <DialogDescription>
                          Enter your email address to receive a copy of this runway analysis.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          onClick={handleSendEmail}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Send Email
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* SEO Content Section */}
      <div className="mt-16 prose prose-lg max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-6">Understanding Startup Runway Calculations</h2>
        
        <p className="text-charcoal mb-4">
          A runway calculator is an essential financial planning tool for startups and businesses that helps determine how long your current cash reserves will last at your current burn rate. This critical metric provides valuable insights for strategic decision-making, fundraising timelines, and financial sustainability.
        </p>
        
        <h3 className="text-2xl font-semibold text-primary mt-8 mb-4">What is Startup Runway?</h3>
        
        <p className="text-charcoal mb-4">
          Startup runway refers to the amount of time a company can continue operating before it runs out of money. It's typically measured in months and is calculated by dividing the total available cash by the monthly burn rate (the amount of money the company spends each month).
        </p>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 my-8">
          <h4 className="text-xl font-semibold text-primary mb-4">Key Components of Runway Calculation</h4>
          
          <ul className="list-disc pl-6 space-y-3">
            <li><strong>Total Available Cash:</strong> The current cash reserves your startup has in the bank.</li>
            <li><strong>Monthly Burn Rate:</strong> The amount of money your business spends each month on operational expenses.</li>
            <li><strong>Monthly Revenue:</strong> The income your business generates each month, which offsets your burn rate.</li>
            <li><strong>Revenue Growth Rate:</strong> The expected monthly percentage increase in your revenue.</li>
            <li><strong>Additional Funding:</strong> Any upcoming investments or funding that will be added to your cash reserves.</li>
          </ul>
        </div>
        
        <h3 className="text-2xl font-semibold text-primary mt-8 mb-4">Why Runway Calculation Matters</h3>
        
        <p className="text-charcoal mb-4">
          Understanding your startup's runway is crucial for several reasons:
        </p>
        
        <ol className="list-decimal pl-6 space-y-3 mb-8">
          <li><strong>Strategic Planning:</strong> Knowing how much time you have before running out of cash allows you to make informed decisions about hiring, expansion, and other investments.</li>
          <li><strong>Fundraising Timeline:</strong> It helps determine when you need to start your next fundraising round, giving you enough buffer to secure funding before cash runs out.</li>
          <li><strong>Financial Discipline:</strong> Regular runway calculations enforce financial accountability and help prioritize spending on activities that drive growth.</li>
          <li><strong>Investor Communications:</strong> Investors often ask about runway metrics to assess the financial health and sustainability of your startup.</li>
          <li><strong>Scenario Planning:</strong> It allows you to model different scenarios by adjusting variables like growth rate, burn rate, or additional funding.</li>
        </ol>
        
        <h3 className="text-2xl font-semibold text-primary mt-8 mb-4">Best Practices for Managing Your Runway</h3>
        
        <p className="text-charcoal mb-4">
          To effectively manage and extend your startup's runway:
        </p>
        
        <ul className="list-disc pl-6 space-y-3 mb-8">
          <li><strong>Monitor Regularly:</strong> Track your runway calculations monthly to stay aware of your financial position.</li>
          <li><strong>Maintain a Buffer:</strong> Aim for at least 12-18 months of runway to give yourself enough time to achieve milestones and raise additional capital.</li>
          <li><strong>Focus on Revenue Growth:</strong> Increasing revenue is often more sustainable than cutting costs for extending runway.</li>
          <li><strong>Optimize Burn Rate:</strong> Regularly review expenses to identify opportunities for efficiency without hampering growth.</li>
          <li><strong>Plan Fundraising in Advance:</strong> Start your fundraising efforts 6-9 months before you expect to run out of money.</li>
        </ul>
        
        <h3 className="text-2xl font-semibold text-primary mt-8 mb-4">How Our Runway Calculator Helps</h3>
        
        <p className="text-charcoal mb-4">
          Our interactive runway calculator simplifies financial planning by:
        </p>
        
        <ul className="list-disc pl-6 space-y-3 mb-8">
          <li>Providing clear visualizations of your cash trajectory over time</li>
          <li>Allowing you to model different scenarios with varying growth and burn rates</li>
          <li>Generating professional reports you can share with your team and investors</li>
          <li>Giving precise estimates of your runway duration and projected end date</li>
          <li>Helping you make data-driven decisions about your startup's financial strategy</li>
        </ul>
        
        <div className="bg-primary/10 p-6 rounded-lg my-8 border-l-4 border-primary">
          <h4 className="text-xl font-semibold text-primary mb-2">Start Planning Today</h4>
          <p className="text-charcoal">
            Use our runway calculator now to gain better visibility into your startup's financial future. Adjust different variables to see how changes in your burn rate, revenue growth, or additional funding can impact your runway. Download or email your results for future reference and team discussions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RunwayCalculator;
