import Patient from '../models/user.model.js';

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