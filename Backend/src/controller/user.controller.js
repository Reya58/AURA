import Patient from '../models/user.model.js';
import dotenv from "dotenv";
dotenv.config();

// Add a new disease to a patient
export const addDisease = async (req, res) => {
 try{
   const {email,disease}=req.body;
    const patient=await Patient.findOne({email});
    if(!patient) return res.status(404).json({message:"Patient not found"});
    patient.diseases.push(disease);
    await patient.save();
    res.status(200).json({message:"Disease added",diseases:patient.diseases});
 }
  catch(err){
    res.status(500).json({message:err.message});
  }

}




// Get full patient profile including all diseases
export const getProfile = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const patient = await Patient.findOne({ email }).select('-password');
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// add reminder
export const addReminder = async (req, res) => {
  try {
    const { email, reminder } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    patient.reminders.push(reminder);
    await patient.save();

    res.status(200).json({ message: "Reminder added", reminders: patient.reminders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all reminders
export const getReminders = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: 'Email required' });

    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    const reminders = [];

    patient.diseases.forEach((disease) => {
      // Skip diseases that are paused or discontinued
      if (disease.status === 'paused' || disease.status === 'discontinued') return;

      disease.medications.forEach((med) => {
        // Skip medications that are paused or discontinued
       

        reminders.push({
          disease: disease.name,
          medName: med.name,
          dose: med.dose,
          timing: med.timing,
          status: med.status,
          diseaseId: disease._id,
          _id: med._id,
        });
      });
    });

    res.status(200).json({ reminders });
  } catch (err) {
    console.error('Error fetching reminders:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// update reminder status
export const updateReminderStatus = async (req, res) => {
  const { email, medicationId, slot,diseaseId } = req.body;
  try {
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const disease = patient.diseases.id(diseaseId);
    if (!disease) return res.status(404).json({ message: "Disease not found" });
    const medication = disease.medications.id(medicationId);
    if (!medication) return res.status(404).json({ message: "Medication not found" });
    const timingSlot = medication.timing.find(t => t.slot === slot);
    if (!timingSlot) return res.status(404).json({ message: "Timing slot not found" });
    timingSlot.status = "done";

    await patient.save();
    res.status(200).json({ message: "Reminder status updated", medication });
  }
    catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, name, age, gender} = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: "Patient not found" });  
    // Update fields if provided
    if (name) patient.name = name;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;
    await patient.save();

    res.status(200).json({ message: "Profile updated", patient });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updatemedications = async (req, res) => {
  try {
    const { email, diseaseId,status } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    const disease = patient.diseases.id(diseaseId);
    if (!disease) return res.status(404).json({ message: "Disease not found" });
     disease.status=status;
    await patient.save();

    res.status(200).json({ message: "Medication status updated", disease });
  }
    catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const Latest=async(req,res)=>{
  try{
    const {email}=req.query;
    const patient=await Patient.findOne({email});
    if(!patient) return res.status(404).json({message:"Patient not found"});
    const latestData=patient.latest;
    res.status(200).json({latest:latestData});
  }
  catch(err){
    res.status(500).json({message:err.message});
  }
}


export const verifyMedications = async (req, res) => {
  try {
    // ✅ Correct env check
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ API KEY");
    }

    const { medications } = req.body;

    if (!medications || medications.length === 0) {
      return res.status(400).json({ message: 'No medications provided' });
    }

    // ✅ Format medication list
    const medList = medications
      .map(
        (m, i) =>
          `${i + 1}. ${m.name} (${m.dose}) for ${m.disease}, duration: ${m.duration}`
      )
      .join('\n');

    // ✅ Prompt
    const prompt = `You are a medical safety assistant. A patient is currently taking the following medicationsOnly report interactions that are medically well-established.
Ignore weak or uncertain associations.:

${medList}

Please analyze:
1. Whether this combination of medications is safe.
2. Any harmful drug interactions.
3. Any dosage concerns.

Respond ONLY in valid JSON:
{
 "severity": "high | medium | low",
  "interactions": ["..."],
  "warnings": ["..."],
  "summary": "..."
}`;

    // ✅ API call (Groq)
    const grokResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0,
        }),
      }
    );

    // ✅ Handle API error
    if (!grokResponse.ok) {
      const errText = await grokResponse.text();
      console.error("Groq API Error:", errText);

      return res.status(502).json({
        message: "Groq API error",
        detail: errText,
      });
    }

    const grokData = await grokResponse.json();
    const rawContent = grokData.choices?.[0]?.message?.content ?? "";

    // ✅ Clean response
    const cleaned = rawContent.replace(/```json|```/g, "").trim();

    // ✅ Safe JSON parsing
    let analysis;
    try {
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = {
        safe: false,
        interactions: [],
        warnings: ["AI response parsing failed"],
        summary: cleaned,
      };
    }

    // ✅ Send response
    res.status(200).json({ analysis });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const healthAssistant = async (req, res) => {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("Missing GROQ API KEY");
    }

    const { prompt, email } = req.body;

    if (!prompt || !email) {
      return res.status(400).json({
        message: "Prompt and email are required",
      });
    }

    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    // ✅ TIME SLOT
    const hour = new Date().getHours();
    let currentSlot = "morning";
    if (hour >= 12 && hour < 17) currentSlot = "afternoon";
    else if (hour >= 17) currentSlot = "night";

    const slotsOrder = ["morning", "afternoon", "night"];
    const currentIndex = slotsOrder.indexOf(currentSlot);

    // ✅ Active diseases only
    const activeDiseases = patient.diseases?.filter(
      (d) => !["discontinued", "paused"].includes(d.status?.toLowerCase())
    );

    const diseases =
      activeDiseases?.map((d) => d.name).join(", ") || "None";

    // ✅ Medicines + Skipped + Missed
    let medicinesList = [];
    let skippedMeds = [];
    let currentMeds = [];
    let missedMeds = [];

    patient.diseases?.forEach((disease) => {
      const isDiseaseInactive = ["discontinued", "paused"].includes(
        disease.status?.toLowerCase()
      );

      disease.medications?.forEach((med) => {
        if (!med?.name) return;

        // ❌ skip inactive disease
        if (isDiseaseInactive) {
          skippedMeds.push(`${med.name} (via ${disease.name})`);
          return;
        }

        // ❌ skip inactive med
        if (["discontinued", "paused"].includes(med.status?.toLowerCase())) {
          skippedMeds.push(`${med.name} (${med.status})`);
          return;
        }

        const timings = med.timing || [];

        // ✅ FULL LIST
        const timingStr =
          timings.map((t) => t.slot).join(", ") || "No timing";

        medicinesList.push(
          `${med.name} (${med.dose || "N/A"}) - ${timingStr}`
        );

        timings.forEach((t) => {
          const slot = t.slot?.toLowerCase();
          const slotIndex = slotsOrder.indexOf(slot);

          // ✅ CURRENT MEDS
          if (slot === currentSlot) {
            currentMeds.push(`${med.name} (${med.dose || "N/A"})`);
          }

          // 🔥 MISSED MEDS
          if (slotIndex !== -1 && slotIndex < currentIndex) {
            if (t.status !== "done") {
              missedMeds.push(
                `${med.name} (${med.dose || "N/A"}) - ${t.slot}`
              );
            }
          }
        });
      });
    });

    const medicines =
      medicinesList.length > 0
        ? medicinesList.join(", ")
        : "No medicines available";

    // ✅ APPOINTMENTS
    let appointmentsList = [];

    activeDiseases?.forEach((disease) => {
      if (disease.nextAppointment) {
        const apptDate = new Date(disease.nextAppointment);

        if (!isNaN(apptDate.getTime()) && apptDate > new Date()) {
          appointmentsList.push(
            `${disease.name} | Dr: ${
              disease.assignedDoctor || "N/A"
            } | ${apptDate.toLocaleString("en-IN")}`
          );
        }
      }
    });

    const appointments =
      appointmentsList.length > 0
        ? appointmentsList.join("\n")
        : "No upcoming appointments";

    // ✅ CONTEXT (NEW FIELD ADDED)
    const context = `
Patient Info:
- Name: ${patient.name || "N/A"}
- Age: ${patient.age || "N/A"}
- Gender: ${patient.gender || "N/A"}

Active Diseases:
${diseases}

All Medicines:
${medicines}

Medicines to take NOW (${currentSlot}):
${currentMeds.join(", ") || "None scheduled"}

⚠️ Missed Medicines:
${missedMeds.join(", ") || "None"}

Discontinued/Paused Medicines:
${skippedMeds.join(", ") || "None"}

Upcoming Appointments:
${appointments}

Latest Health:
- BPM: ${patient.latest?.BPM ?? "N/A"}
- TEMP: ${patient.latest?.TEMP ?? "N/A"}
- ECG: ${patient.latest?.ECG ?? "N/A"}
- STATUS: ${patient.latest?.STATUS ?? "N/A"}
`.trim();

    // ✅ PROMPT
    const finalPrompt = `
You are a personal AI health assistant.

STRICT RULES:
- Use ONLY the data provided
- NEVER include discontinued/paused medicines
- If user asks "now" → use current medicines
- If user asks about missed → use "Missed Medicines"
- If none exist → clearly say so
- Be precise and helpful
-If user asks about paused/discontinued give ignored med list

${context}

User Question: ${prompt}

Respond ONLY in JSON:
{
  "reply": "clear answer",
  "severity": "low | medium | high",
  "advice": "next step"
}
`.trim();

    // ✅ GROQ CALL
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: finalPrompt }],
          temperature: 0.1,
        }),
      }
    );

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      return res.status(502).json({
        message: "Groq API error",
        detail: errText,
      });
    }

    const data = await groqResponse.json();
    let raw = data.choices?.[0]?.message?.content || "";

    raw = raw.replace(/```json|```/g, "").trim();

    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      result = {
        reply: raw,
        severity: "low",
        advice: "Parsing failed",
      };
    }

    res.status(200).json({ response: result });

  } catch (err) {
    console.error("healthAssistant error:", err);
    res.status(500).json({ message: err.message });
  }
};