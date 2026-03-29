import mongoose from "mongoose";

const { Schema, model } = mongoose;

const DegreeEnum = ["Bachelor", "Master", "Engineer"];
const DegreeTypes = {
  Engineer: ["INLOG", "INREV"],
  Master: ["Pro_IM", "Pro_DCA", "Pro_PAR", "R_DISR", "R_TMAC"],
  Bachelor: ["AV", "CMM", "IMM", "BD", "MIME", "Coco_JV", "Coco_3D"]
};

const studentSchema = new Schema({
  cin: { type: String, unique: true, required: true },
  studentIdCardIMG: { type: String, required: true },
  companyName: { type: String, required: true },
  degree: { type: String, enum: DegreeEnum, required: true },
  degreeType: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value) {
        const validTypes = DegreeTypes[this.degree];
        return validTypes && validTypes.includes(value);
      },
      message: "Invalid degree type for the specified degree"
    }
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  compSupervisorId: { type: Schema.Types.ObjectId, ref: "CompSupervisor", required: true },
  uniSupervisorId: { type: Schema.Types.ObjectId, ref: "UniSupervisor", required: true },
  project: { type: Schema.Types.ObjectId, ref: "Project" },
  meetings: [{ type: Schema.Types.ObjectId, ref: "Meeting" }]
}, { timestamps: true });

export default model("Student", studentSchema);