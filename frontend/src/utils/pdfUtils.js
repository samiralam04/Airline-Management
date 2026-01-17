import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Common colors
const COLORS = {
  primary: [0, 86, 164], // SkyWings Blue (similar to IndiGo blue)
  secondary: [240, 240, 240], // Light Gray
  text: [0, 0, 0],
  textSecondary: [100, 100, 100],
  accent: [0, 150, 255],
};

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

const formatTime = (dateString) => {
  try {
    return (
      new Date(dateString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }) + " Hrs"
    );
  } catch (e) {
    return "00:00 Hrs";
  }
};

/**
 * Generates an E-Ticket PDF similar to EaseMyTrip style but with SkyWings branding
 */
export const generateTicketPDF = (booking) => {
  try {
    const doc = new jsPDF();
    const flight = booking.flight;
    const passenger = booking.passenger;

    // --- Header ---
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SkyWings", 15, 20);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(".com", 48, 20); // Mimic the .com style

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("E-Ticket", 195, 20, { align: "right" });

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Booking ID - ${booking.id}`, 195, 26, { align: "right" });
    doc.text(
      `Booking Date - ${new Date(booking.bookingTime).toLocaleString()}`,
      195,
      31,
      { align: "right" },
    );

    // --- Onward Flight Header ---
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Onward Flight", 15, 45);

    // Gray Bar
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 48, 180, 14, "F");

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `${flight.departureAirport.city} → ${flight.arrivalAirport.city}`,
      20,
      56,
    );
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(formatDate(flight.departureTime), 20, 61);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(`PNR: ${booking.id}`, 190, 58, { align: "right" });

    // --- Flight Details Box ---
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(15, 68, 180, 55, 2, 2);

    // Airline Logo (Placeholder square if image fails/not available)
    // Check for valid hex string before setting
    const airlineColor =
      flight.airlineColor && flight.airlineColor.startsWith("#")
        ? flight.airlineColor
        : COLORS.primary[0];
    if (typeof airlineColor === "string") {
      doc.setFillColor(airlineColor);
    } else {
      // Fallback if numbers or invalid
      doc.setFillColor(0, 0, 0);
    }

    doc.rect(20, 75, 10, 10, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(flight.airline, 35, 79);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`${flight.airline}, ${flight.flightNumber}`, 35, 84);

    // Flight Route Visuals
    const startY = 80;
    const midX = 105;

    // Dep
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(flight.departureAirport.code, midX - 30, startY, {
      align: "center",
    });
    doc.text(formatTime(flight.departureTime), midX - 30, startY + 6, {
      align: "center",
    });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(formatDate(flight.departureTime), midX - 30, startY + 11, {
      align: "center",
    });
    doc.text(
      `${flight.departureAirport.city}, ${flight.departureAirport.terminal}`,
      midX - 30,
      startY + 16,
      { align: "center" },
    );

    // Arrow / Duration
    doc.setDrawColor(150, 150, 150);
    doc.line(midX - 10, startY - 2, midX + 10, startY - 2);
    doc.circle(midX, startY - 2, 1, "F");
    doc.setFontSize(8);
    doc.text(flight.duration, midX, startY - 5, { align: "center" });

    // Arr
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(flight.arrivalAirport.code, midX + 30, startY, {
      align: "center",
    });
    doc.text(formatTime(flight.arrivalTime), midX + 30, startY + 6, {
      align: "center",
    });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(formatDate(flight.arrivalTime), midX + 30, startY + 11, {
      align: "center",
    });
    doc.text(
      `${flight.arrivalAirport.city}, ${flight.arrivalAirport.terminal}`,
      midX + 30,
      startY + 16,
      { align: "center" },
    );

    // Baggage Info Row
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Baggage: Cabin - 7Kg | Check-in - ${booking.baggage || "15kg"} | Class: ${passenger.flightClass}`,
      20,
      115,
    );

    // --- Traveller Details ---
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Traveller Details", 15, 135);

    autoTable(doc, {
      startY: 140,
      margin: { left: 15, right: 15 },
      head: [["Passenger Name", "Ticket Number", "Seat", "Status"]],
      body: [
        [
          passenger.name || `${passenger.firstName} ${passenger.lastName}`,
          `${booking.id}/1`,
          passenger.seat || "Assigned at Check-in",
          booking.status,
        ],
      ],
      theme: "plain",
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      bodyStyles: {
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
        minCellHeight: 12,
      },
    });

    // --- Fare Summary (Simplified) ---
    // Safely access finalY
    const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) || 160;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Fare Summary", 15, finalY + 15);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Total Amount Paid: INR ${booking.totalAmount.toLocaleString()}`,
      15,
      finalY + 23,
    );

    doc.save(`SkyWings-Ticket-${booking.id}.pdf`);
  } catch (error) {
    console.error("Ticket Generation Error:", error);
    alert("Failed to generate ticket PDF. Please try again.");
  }
};

/**
 * Generates a Boarding Pass PDF similar to IndiGo style
 */
export const generateBoardingPassPDF = (booking) => {
  try {
    const doc = new jsPDF("l", "mm", [200, 85]); // Landscape format, roughly boarding pass dimensions
    const flight = booking.flight;
    const passenger = booking.passenger;
    const passengerName = (
      passenger.name || `${passenger.lastName}/${passenger.firstName}`
    ).toUpperCase();

    // Left Section (Main Stub)
    // Logo
    doc.setTextColor(...COLORS.primary);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("SkyWings", 8, 10);

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Boarding Pass (Web Check-in)", 35, 10);

    // Passenger Name
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(passengerName, 8, 20);

    // Route Name
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `${flight.departureAirport.city} To ${flight.arrivalAirport.city.toUpperCase()} (${flight.arrivalAirport.terminal})`,
      90,
      20,
      { align: "right" },
    );

    // Grid Info
    const row1Y = 30;
    const row2Y = 40;

    // Flight
    doc.setFontSize(7);
    doc.text("Flight", 8, row1Y);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(flight.flightNumber, 8, row2Y);

    // Gate
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("Gate", 30, row1Y);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("TBD", 30, row2Y); // Gate usually TBD for web checkin

    // Boarding Time
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("Boarding Time", 55, row1Y);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    // Boarding starts 45 mins before
    const boardingDate = new Date(
      new Date(flight.departureTime).getTime() - 45 * 60000,
    );
    doc.text(
      formatTime(boardingDate.toISOString()).replace(" Hrs", ""),
      55,
      row2Y,
    );
    doc.setFontSize(8);
    doc.text("Hrs", 75, row2Y);

    // Boarding Zone (Random or fixed)
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("Zone", 90, row1Y);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Zone 1", 90, row2Y);

    // Seat
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text("Seat", 115, row1Y);
    doc.setFontSize(14); // Emphasize Seat
    doc.setTextColor(0, 0, 0);
    doc.text(passenger.seat || "12A", 115, row2Y);

    // Date/Seq
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Date", 30, 50);
    doc.setTextColor(0, 0, 0);
    doc.text(formatDate(flight.departureTime), 45, 50);

    doc.setTextColor(100, 100, 100);
    doc.text("Seq", 30, 55);
    doc.setTextColor(0, 0, 0);
    doc.text("0045", 45, 55);

    // Services
    doc.setTextColor(100, 100, 100);
    doc.text("Services", 90, 50);
    doc.setTextColor(0, 0, 0);
    doc.text(passenger.flightClass === "Business" ? "BUS" : "ECO", 110, 50);

    // QR Code Placeholder
    doc.setFillColor(0, 0, 0);
    doc.rect(8, 50, 20, 20, "F");
    doc.setFillColor(255, 255, 255);
    doc.rect(10, 52, 16, 16, "F");
    doc.setFillColor(0, 0, 0);
    doc.rect(12, 54, 12, 12, "F");

    // Footer Disclaimer
    doc.setFontSize(5);
    doc.setTextColor(150, 150, 150);
    doc.text(
      "Gate is subject to change and will close 25 minutes prior to departure.",
      8,
      78,
    );

    // --- Right Section (Small Stub) ---
    // Divider Line (dashed)
    doc.setDrawColor(200, 200, 200);
    doc.setLineDash([2, 2], 0);
    doc.line(140, 5, 140, 80);
    doc.setLineDash([]);

    const stubX = 145;

    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(passengerName, stubX, 15);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${flight.departureAirport.code} -> ${flight.arrivalAirport.code}`,
      stubX,
      22,
    );

    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Flight", stubX, 30);
    doc.setTextColor(0, 0, 0);
    doc.text(flight.flightNumber, stubX + 25, 30, { align: "right" });

    doc.setTextColor(100, 100, 100);
    doc.text("Date", stubX, 35);
    doc.setTextColor(0, 0, 0);
    doc.text(formatDate(flight.departureTime), stubX + 25, 35, {
      align: "right",
    });

    doc.setTextColor(100, 100, 100);
    doc.text("PNR", stubX, 40);
    doc.setTextColor(0, 0, 0);
    doc.text(booking.id.substring(0, 6), stubX + 25, 40, { align: "right" });

    // QR Code Small
    doc.setFillColor(0, 0, 0);
    doc.rect(stubX, 50, 15, 15, "F");

    // Seat Big
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Seat", stubX + 25, 55, { align: "right" });
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.font = "bold";
    doc.text(passenger.seat || "12A", stubX + 25, 62, { align: "right" });

    doc.save(`SkyWings-BoardingPass-${booking.id}.pdf`);
  } catch (error) {
    console.error("Boarding Pass Generation Error:", error);
    alert("Failed to generate boarding pass PDF. Please try again.");
  }
};