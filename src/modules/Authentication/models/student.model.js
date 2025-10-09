import mongoose from "mongoose";

const { Schema, model } = mongoose;

const DegreeEnum = ["Bachelor", "Master", "Engineer"];

const studentSchema = new Schema({
  cin: { type: String, unique: true, required: true },
  student_id_card_img: { type: String, required: true },
  company_name: { type: String, required: true },
  degree: { type: String, enum: DegreeEnum, required: true },
  degree_type: { 
    type: String, 
    required: true,
    validate: {
      validator: function(value) {
        if (this.degree === "Engineer") {
          return ["INLOG", "INREV"].includes(value);
        } else if (this.degree === "Master") {
          return ["Pro IM", "Pro DCA", "Pro PAR", "R DISR", "R TMAC"].includes(value);
        } else if (this.degree === "Bachelor") {
          return ["AV", "CMM", "IMM", "BD", "MIME", "Coco-JV", "Coco-3D"].includes(value);
        }
        return false; // Invalid degree
      },
      message: function(props) {
        if (props.path === "degree_type") {
          if (this.degree === "Engineer") {
            return "degree_type must be either 'INLOG' or 'INREV'";
          } else if (this.degree === "Master") {
            return "degree_type must be one of: 'Pro IM', 'Pro DCA', 'Pro PAR', 'R DISR', 'R TMAC'";
          } else if (this.degree === "Bachelor") {
            return "degree_type must be one of: 'AV', 'CMM', 'IMM', 'BD', 'MIME', 'Coco-JV', 'Coco-3D'";
          }
        }
        return "Invalid degree_type for the specified degree";
      }
    }
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  project: { type: Schema.Types.ObjectId, ref: "Project" },
  meetings: [{ type: Schema.Types.ObjectId, ref: "Meeting" }]
}, { timestamps: true });

export default model("Student", studentSchema);