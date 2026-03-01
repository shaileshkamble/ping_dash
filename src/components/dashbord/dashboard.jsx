import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import "./dashboard.css";



/* =============================
   Reusable Graph Component
============================= */

const GraphCard = ({ title, dataKey, stroke, data }) => (


    <div className="card">
        <h3>{title}</h3>

        <ResponsiveContainer width="100%" height={260}>
            <LineChart
                data={data}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
                <CartesianGrid
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                />

                <XAxis
                    dataKey="time"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />

                <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                />

                <Tooltip
                    contentStyle={{
                        background: "#0f172a",
                        border: "none",
                        borderRadius: "10px",
                        color: "white"
                    }}
                />

                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={stroke}
                    strokeWidth={3}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

/* =============================
   Main Dashboard
============================= */

const Dashboard = () => {
    const [target, setTarget] = useState("");
    const [data, setData] = useState([]);
    const intervalRef = useRef(null);

    const fetchPing = useCallback(async () => {
        if (!target) return;

        try {
            const res = await fetch(
                `http://localhost:5000/ping?host=${target}`
            );
            const result = await res.json();

            const newPoint = {
                time: new Date().toLocaleTimeString(),
                latency: result.rtt || result.latency,
                packetLoss: result.packetLoss,
                status: result.alive,
                avgRtt: result.avgRtt
            };

            // setData(prev => [...prev.slice(-29), newPoint]);
            setData(prev => {
                const updated = [...prev.slice(-29), newPoint];

                localStorage.setItem("pingData", JSON.stringify(updated));
                return updated;
            });

        } catch (err) {
            console.error("Ping failed", err);
        }
    }, [target]);

    // useEffect(() => {
    //     if (!target) return;

    //     fetchPing(); // immediate call

    //     intervalRef.current = setInterval(fetchPing, 3000);

    //     return () => clearInterval(intervalRef.current);
    // }, [fetchPing, target]);

    // useEffect(() => {
    //     const savedData = localStorage.getItem("pingData");
    //     const savedTarget = localStorage.getItem("pingTarget");

    //     if (savedData) {
    //         setData(JSON.parse(savedData));
    //     }

    //     if (savedTarget) {
    //         setTarget(savedTarget);
    //     }
    // }, []);

    // Load saved data on mount
    useEffect(() => {
        const savedData = localStorage.getItem("pingData");
        const savedTarget = localStorage.getItem("pingTarget");

        if (savedData) {
            setData(JSON.parse(savedData));
        }

        if (savedTarget) {
            setTarget(savedTarget);
        }
    }, []);


    // Start live polling when target exists
    useEffect(() => {
        if (!target) return;

        fetchPing(); // immediate first call

        intervalRef.current = setInterval(fetchPing, 3000);

        return () => clearInterval(intervalRef.current);
    }, [target, fetchPing]);



    const graphs_set1 = [
        { title: "Latency (ms)", key: "latency", color: "#3b82f6" },
        { title: "Packet Loss (%)", key: "packetLoss", color: "#ef4444" },
    ];
    const graphs_set2 = [
        { title: "Status (1=Up)", key: "status", color: "#10b981" },
        { title: "Average RTT (ms)", key: "avgRtt", color: "#a855f7" }
    ];

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <h2>Live Network Monitor</h2>

                <input
                    type="text"
                    placeholder="Enter IP or domain"
                    value={target}
                    // onChange={(e) => setTarget(e.target.value)}
                    onChange={(e) => {
                        setTarget(e.target.value);
                        localStorage.setItem("pingTarget", e.target.value);
                    }}
                />
            </div>

            <div className="graph-grid_set1">
                {graphs_set1.map(graphs_set1 => (
                    <GraphCard
                        key={graphs_set1.key}
                        title={graphs_set1.title}
                        dataKey={graphs_set1.key}
                        stroke={graphs_set1.color}
                        data={data}
                    />
                ))}
            </div>

            <div className="graph-grid_set2">
                {graphs_set2.map(graphs_set2 => (
                    <GraphCard
                        key={graphs_set2.key}
                        title={graphs_set2.title}
                        dataKey={graphs_set2.key}
                        stroke={graphs_set2.color}
                        data={data}
                    />
                ))}
            </div>

        </div>
    );
};

export default Dashboard;