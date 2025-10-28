import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthContext"; // Assuming you have AuthContext for email

const MedicationFetcher = ({ apiBaseUrl = "https://aura-pz3yexz22-shreyas-projects-f842d25f.vercel.app" }) => {
  const { email } = useAuth(); 
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
     
    if (!email) {
      setError("Email not found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchMeds = async () => {

      try {
        const response = await fetch(
          `${apiBaseUrl}/api/user/diseases?email=${encodeURIComponent(email)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch medications");
        const data = await response.json();
        const diseases = data.diseases || [];
        console.log("Fetched diseases:", diseases);
      

        // Logic: if disease is paused/discontinued → all meds paused
        const ongoingMeds = diseases.flatMap((disease) => {
          const isDiseasePaused =
            disease.status === "paused" || disease.status === "discontinued";

          return (disease.medications || [])
            .map((m) => {
              const medStatus = isDiseasePaused ? "paused" : disease.status;
              return {
                _id: m._id || `${disease._id}-${m.name}-${Math.random()}`,
                name: m.name || "Unnamed",
                dose: m.dose || "",
                timing: m.timing || [], // Changed to array default
                duration: m.duration || "",
                diseaseName: disease.name || "",
                status: medStatus,
              };
            })
            .filter((m) => disease.status === "ongoing"); // Only ongoing meds
        });

        setMedications(ongoingMeds);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeds();
  }, [email, apiBaseUrl]);

  if (loading) return <div style={styles.loading}>💊 Loading your meds...</div>;
  if (error) return <div style={styles.error}>🚨 {error}</div>;

  if (medications.length === 0)
    return <div style={styles.loading}>No ongoing medications found.</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Ongoing Medications</h2>
      <ul style={styles.list}>
        {medications.map((med) => (
          <li key={med._id} style={styles.item}>
            <div style={styles.itemContent}>
              <div style={styles.medDetails}>
                <strong style={styles.medName}>{med.name}</strong> - {med.dose} (
                {med.timing && med.timing.length > 0
                  ? med.timing.map(t => t.slot).join(', ')
                  : 'No timing'}
                , {med.duration})
              </div>
              <div style={styles.diseaseLabel}>
                [{med.diseaseName}]
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "30px auto",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
    background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#2c3e50",
    border: "1px solid #e0e4ea",
  },
  title: {
    textAlign: "center",
    color: "#34495e",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "bold",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  item: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    margin: "15px 0",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    border: "1px solid #ecf0f1",
  },
  itemContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  medDetails: {
    flex: 1,
    fontSize: "16px",
    color: "#2c3e50",
  },
  medName: {
    color: "#3498db",
    fontSize: "18px",
  },
  diseaseLabel: {
    fontStyle: "italic",
    color: "#7f8c8d",
    fontSize: "14px",
    background: "#ecf0f1",
    padding: "5px 10px",
    borderRadius: "20px",
    marginLeft: "10px",
  },
  loading: {
    textAlign: "center",
    fontSize: "20px",
    color: "#3498db",
    fontWeight: "500",
    padding: "20px",
  },
  error: {
    textAlign: "center",
    fontSize: "20px",
    color: "#e74c3c",
    fontWeight: "500",
    padding: "20px",
  },
};

export default MedicationFetcher;
