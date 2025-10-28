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

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  diseases: [diseaseSchema],
  password:{type:String,required:true},
  gender: { type: String },
  age: { type: Number }
});




const Patient = mongoose.model('Patient', patientSchema);
export default Patient;
