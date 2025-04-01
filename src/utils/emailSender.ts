
import { RunwayData } from "@/types/calculator";
import { formatCurrency, formatDate } from "./formatters";
import { toast } from "@/components/ui/use-toast";

export const sendRunwayEmail = async (email: string, data: RunwayData) => {
  try {
    // In a real implementation, this would call an API endpoint that sends emails
    // For this demo, we'll just simulate a successful email send
    
    // Simulating API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Show success notification
    toast({
      title: "Email Sent Successfully!",
      description: `The runway analysis has been sent to ${email}`,
      variant: "default",
    });
    
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    
    toast({
      title: "Failed to Send Email",
      description: "There was an error sending your email. Please try again later.",
      variant: "destructive",
    });
    
    return false;
  }
};

// Helper function to generate email body HTML
export const generateRunwayEmailHtml = (data: RunwayData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #245e4f; color: white; padding: 20px; text-align: center; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .section { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; }
        th { background-color: #245e4f; color: white; text-align: left; padding: 10px; }
        td { padding: 10px; border-bottom: 1px solid #ddd; }
        .footer { background-color: #f2f2f2; padding: 15px; text-align: center; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Startup Runway Analysis</h1>
      </div>
      
      <div class="container">
        <div class="section">
          <h2>Input Parameters</h2>
          <table>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Total Available Cash</td>
              <td>${formatCurrency(data.totalCash)}</td>
            </tr>
            <tr>
              <td>Monthly Burn Rate</td>
              <td>${formatCurrency(data.monthlyBurn)}</td>
            </tr>
            <tr>
              <td>Additional Funding</td>
              <td>${formatCurrency(data.additionalFunding)}</td>
            </tr>
            <tr>
              <td>Monthly Growth Rate</td>
              <td>${data.growthRate}%</td>
            </tr>
            <tr>
              <td>Monthly Revenue</td>
              <td>${formatCurrency(data.monthlyRevenue)}</td>
            </tr>
          </table>
        </div>
        
        <div class="section">
          <h2>Runway Analysis Results</h2>
          <table>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
            <tr>
              <td>Runway Duration</td>
              <td>${data.runwayMonths} months</td>
            </tr>
            <tr>
              <td>Estimated End Date</td>
              <td>${formatDate(data.runwayDate)}</td>
            </tr>
          </table>
        </div>
        
        <div class="footer">
          <p>© Financial Runway Calculator | www.runway-calculator.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
