import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

const Reminder = () => {
  const { email } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [currentReminders, setCurrentReminders] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const timingSlots = {
    Morning: [6, 12],
    Afternoon: [12, 17],
    Evening: [17, 20],
    Night: [20, 23],
  };

  const slotOrder = ['Morning', 'Afternoon', 'Evening', 'Night'];

  // Fetch reminders
  useEffect(() => {
    if (!email) return;
    const fetchReminders = async () => {
      try {
        const res = await fetch(
          `https://aura-git-main-shreyas-projects-f842d25f.vercel.app/api/user/fetch-reminders?email=${encodeURIComponent(email)}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        const data = await res.json();
        setReminders(data.reminders || []);
      } catch (err) {
        console.error('Error fetching reminders:', err);
      }
    };
    fetchReminders();
    const interval = setInterval(fetchReminders, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [email]);

  // Separate current and upcoming slots
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    const current = [];
    const upcoming = [];
     console.log("Reminders:", reminders);
    reminders.forEach((med) => {
      med.timing.forEach((slot) => {
        if (slot.status !== 'pending') return;

        const [start, end] = timingSlots[slot.slot];

        if (hour >= start && hour < end) {
          // Current slot
          current.push({
            ...slot,
            medName: med.medName,
            dose: med.dose,
            disease: med.diseaseName || med.name,
            medicationId: med._id,
            diseaseId: med.diseaseId || med._id,
          });
        } else if (hour < end) {
          // Upcoming slot
          upcoming.push({
            ...slot,
            medName: med.medName,
            dose: med.dose,
            disease: med.diseaseName || med.name,
            medicationId: med._id,
            diseaseId: med.diseaseId || med._id,
          });
        }
      });
    });

    // Sort upcoming by slotOrder
    upcoming.sort((a, b) => slotOrder.indexOf(a.slot) - slotOrder.indexOf(b.slot));

    setCurrentReminders(current);
    setUpcomingReminders(upcoming);
  }, [reminders, timingSlots, slotOrder]);

  // Mark slot as done
  const markAsDone = async (reminder) => {
    try {
      const res = await fetch('https://aura-git-main-shreyas-projects-f842d25f.vercel.app/api/user/update-reminder-status', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          diseaseId: reminder.diseaseId,
          medicationId: reminder.medicationId,
          slot: reminder.slot,
          status: 'done',
        }),
      });
      if (!res.ok) throw new Error('Failed to update reminder');

      // Update local state
      setReminders((prev) =>
        prev.map((med) => {
          if (med._id !== reminder.medicationId) return med;
          return {
            ...med,
            timing: med.timing.map((t) =>
              t._id === reminder._id ? { ...t, status: 'done' } : t
            ),
          };
        })
      );
      setDropdownOpen(null);
    } catch (err) {
      console.error('Error updating reminder:', err);
      alert('Failed to mark as done. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Medication Reminders</h3>

      {/* Current Reminders */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Current Reminders</h4>
        {currentReminders.length === 0 ? (
          <p style={styles.noReminders}>No current reminders. ✅</p>
        ) : (
          <ul style={styles.list}>
            {currentReminders.map((r) => (
              <li key={r._id} style={styles.item}>
                <div style={styles.itemContent}>
                  <div>
                    <strong>{r.medName}</strong> for <em>{r.disease}</em> - {r.dose} 💊 ({r.slot})
                  </div>
                  <div style={styles.statusContainer}>
                    <button
                      style={styles.statusBtn}
                      onClick={() =>
                        setDropdownOpen(dropdownOpen === r._id ? null : r._id)
                      }
                    >
                      Pending ▼
                    </button>
                    {dropdownOpen === r._id && (
                      <div style={styles.dropdown}>
                        <div
                          style={styles.dropdownOption}
                          onClick={() => markAsDone(r)}
                        >
                          Mark as Done
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Upcoming Reminders */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Upcoming Reminders</h4>
        {upcomingReminders.length === 0 ? (
          <p style={styles.noReminders}>No upcoming reminders.</p>
        ) : (
          <ul style={styles.list}>
            {upcomingReminders.map((r) => (
              <li key={r._id} style={styles.item}>
                <div style={styles.itemContent}>
                  <div>
                    <strong>{r.medName}</strong> for <em>{r.disease}</em> - {r.dose} 💊
                  </div>
                  <div style={styles.upcomingLabel}>{r.slot}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '700px',
    margin: '20px auto',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  section: { marginBottom: '40px' },
  sectionTitle: {
    color: '#34495e',
    fontSize: '22px',
    marginBottom: '15px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '5px',
  },
  noReminders: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  list: { listStyle: 'none', padding: 0 },
  item: {
    background: '#fff',
    borderRadius: '10px',
    padding: '20px',
    margin: '10px 0',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  itemContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: { position: 'relative' },
  statusBtn: {
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    zIndex: 10,
    minWidth: '120px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  dropdownOption: { padding: '10px 15px', cursor: 'pointer' },
  upcomingLabel: {
    background: '#f39c12',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
};

export default Reminder;
