import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EnquiryGraph = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        axios.get("http://localhost:5000/enquiryStats")
            .then(response => {
                const months = response.data.map(item => item.month);
                const counts = response.data.map(item => item.totalEnquiries);

                setChartData({
                    labels: months,
                    datasets: [
                        {
                            label: "Total Enquiries",
                            data: counts,
                            borderColor: "orange",
                            backgroundColor: "rgba(0, 123, 255, 0.3)",
                            fill: true,
                            tension: 0.4,
                        },
                    ],
                });
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div style={{ width: "100%", height: "350px", margin: "auto" }}>
            <h3 style={{ textAlign: "center" }}>Monthly Enquiry Overview</h3>
            <Line 
                data={chartData} 
                options={{ 
                    responsive: true,
                    maintainAspectRatio: false, // Allows custom height & width
                }} 
            />
        </div>
    );
};

export default EnquiryGraph;
