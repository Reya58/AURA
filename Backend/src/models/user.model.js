import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dose: { type: String, required: true },
  timing: [
    {
      slot: { type: String, required: true },
      status: { type: String, default: 'pending' },
    },
  ],
  duration: { type: String, required: true },
  status: { type: String, default: 'pending' },
});

const diseaseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  summary: { type: String, required: true },
  medications: [medicationSchema],
  assignedDoctor: { type: String },
  nextAppointment: { type: Date },
  status: { type: String, default: 'ongoing' },
});

const latestSchema = new mongoose.Schema({
  ECG: { type: Number},
  BPM: { type: Number},
  TEMP: { type: Number},
  STATUS: { type: String},
  timestamp: { type: Date},
}); 

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  diseases: [diseaseSchema],
  latest:latestSchema// single object with default
});


const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
