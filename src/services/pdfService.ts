import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface ItineraryResponse {
  id: string;
  destination: string;
  numberOfDays: number;
  itinerary: DayItinerary[];
  createdAt: string;
}

export interface DayItinerary {
  day: number;
  activities: Activity[];
}

export interface Activity {
  time: string;
  activity: string;
  description: string;
  location?: string;
}

export const pdfService = {
  createPDFHTML(itinerary: ItineraryResponse): string {
    const emojis = {
      morning: "🌅",
      afternoon: "☀️",
      evening: "🌆",
      night: "🌙",
      food: "🍽️",
      culture: "🏛️",
      nature: "🌿",
      beach: "🏖️",
      shopping: "🛍️",
      adventure: "🏃‍♂️",
      relaxation: "🧘‍♀️",
      transport: "🚗",
      hotel: "🏨"
    };

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 40px;
            background: linear-gradient(135deg, #ff6b6b, #feca57);
            color: white;
            padding: 30px;
            border-radius: 15px;
            margin: -40px -40px 40px -40px;
          }
          .header h1 {
            font-size: 2.5em;
            margin: 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .header p {
            font-size: 1.2em;
            margin: 10px 0 0 0;
            opacity: 0.9;
          }
          .day-section {
            margin-bottom: 30px;
            border-left: 4px solid #ff6b6b;
            padding-left: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            padding: 20px;
          }
          .day-title {
            font-size: 1.5em;
            color: #ff6b6b;
            margin-bottom: 15px;
            font-weight: bold;
          }
          .activity {
            margin-bottom: 15px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .activity-time {
            font-weight: bold;
            color: #ff6b6b;
            font-size: 1.1em;
          }
          .activity-name {
            font-weight: bold;
            margin: 5px 0;
            color: #333;
          }
          .activity-description {
            color: #666;
            margin: 5px 0;
          }
          .activity-location {
            color: #888;
            font-style: italic;
            font-size: 0.9em;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🗺️ ${itinerary.destination} Adventure 🗺️</h1>
            <p>${itinerary.numberOfDays}-Day Travel Itinerary ✈️</p>
            <p>Created on ${new Date(itinerary.createdAt).toLocaleDateString()} 📅</p>
          </div>
    `;

    itinerary.itinerary.forEach(day => {
      html += `
        <div class="day-section">
          <div class="day-title">📅 Day ${day.day} - ${itinerary.destination} Adventure</div>
      `;

      day.activities.forEach(activity => {
        const time = activity.time;
        let emoji = emojis.morning;
        
        if (time.includes('12') || time.includes('13') || time.includes('14')) {
          emoji = emojis.afternoon;
        } else if (time.includes('18') || time.includes('19') || time.includes('20')) {
          emoji = emojis.evening;
        } else if (time.includes('21') || time.includes('22') || time.includes('23')) {
          emoji = emojis.night;
        }

        // Add specific emojis based on activity keywords
        if (activity.activity.toLowerCase().includes('breakfast') || 
            activity.activity.toLowerCase().includes('lunch') || 
            activity.activity.toLowerCase().includes('dinner') ||
            activity.activity.toLowerCase().includes('food') ||
            activity.activity.toLowerCase().includes('restaurant')) {
          emoji = emojis.food;
        } else if (activity.activity.toLowerCase().includes('museum') || 
                   activity.activity.toLowerCase().includes('temple') ||
                   activity.activity.toLowerCase().includes('church') ||
                   activity.activity.toLowerCase().includes('palace')) {
          emoji = emojis.culture;
        } else if (activity.activity.toLowerCase().includes('beach') || 
                   activity.activity.toLowerCase().includes('park') ||
                   activity.activity.toLowerCase().includes('garden')) {
          emoji = emojis.nature;
        } else if (activity.activity.toLowerCase().includes('shopping') || 
                   activity.activity.toLowerCase().includes('market')) {
          emoji = emojis.shopping;
        }

        html += `
          <div class="activity">
            <div class="activity-time">${emoji} ${activity.time}</div>
            <div class="activity-name">${activity.activity}</div>
            <div class="activity-description">${activity.description}</div>
            ${activity.location ? `<div class="activity-location">📍 <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}" target="_blank" style="color: #007bff; text-decoration: underline;">${activity.location}</a></div>` : ''}
          </div>
        `;
      });

      html += `</div>`;
    });

    html += `
          <div class="footer">
            <p>🎉 Happy Travels! 🎉</p>
            <p>Generated with AI-powered Travel Planning ✨</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return html;
  },

  async exportToPDF(itinerary: ItineraryResponse): Promise<void> {
    try {
      // Generate HTML content
      const html = this.createPDFHTML(itinerary);
      
      // Create a temporary container for the HTML
      const container = document.createElement('div');
      container.innerHTML = html;
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);

      // Convert HTML to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: container.scrollHeight
      });

      // Remove the temporary container
      document.body.removeChild(container);

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Save the PDF
      pdf.save(`${itinerary.destination}-${itinerary.numberOfDays}-day-itinerary.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw new Error("Failed to generate PDF. Please try again.");
    }
  }
}; 