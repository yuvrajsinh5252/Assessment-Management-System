const path = require("path");

const outputDir = path.join(__dirname, "../../reports");

const classifications = {
  healthScore: [
    { min: 0, max: 12, label: "Needs Attention", color: "#dc2626" },
    { min: 12, max: 74.99, label: "Average", color: "#f97316" },
    { min: 75, max: 89.99, label: "Good", color: "#16a34a" },
    { min: 90, max: Infinity, label: "Excellent", color: "#15803d" },
  ],
  heartRate: [
    { min: 0, max: 59, label: "Below Normal", color: "#2563eb" },
    { min: 60, max: 100, label: "Normal", color: "#16a34a" },
    { min: 101, max: Infinity, label: "Elevated", color: "#dc2626" },
  ],
  bloodPressureSys: [
    { min: 0, max: 89, label: "Low", color: "#2563eb" },
    { min: 90, max: 120, label: "Ideal", color: "#16a34a" },
    { min: 121, max: 139, label: "Elevated", color: "#f97316" },
    { min: 140, max: Infinity, label: "Hypertension", color: "#dc2626" },
  ],
  bloodPressureDia: [
    { min: 0, max: 59, label: "Low", color: "#2563eb" },
    { min: 60, max: 80, label: "Ideal", color: "#16a34a" },
    { min: 81, max: 90, label: "Elevated", color: "#f97316" },
    { min: 91, max: Infinity, label: "Hypertension", color: "#dc2626" },
  ],
  vo2Max: [
    { min: 0, max: 30, label: "Low", color: "#dc2626" },
    { min: 31, max: 45, label: "Average", color: "#f97316" },
    { min: 46, max: 60, label: "Good", color: "#16a34a" },
    { min: 61, max: Infinity, label: "Excellent", color: "#15803d" },
  ],
  bmi: [
    { min: 0, max: 18.4, label: "Underweight", color: "#2563eb" },
    { min: 18.5, max: 24.9, label: "Healthy", color: "#16a34a" },
    { min: 25, max: 29.9, label: "Overweight", color: "#f97316" },
    { min: 30, max: Infinity, label: "Obese", color: "#dc2626" },
  ],
};

const reportConfig = {
  outputDir,
  classifications,
  assessments: {
    as_hr_02: {
      title: "Health & Fitness Assessment",
      summary:
        "Comprehensive overview of body vitals, posture, and conditioning indicators.",
      sections: [
        {
          title: "Overall Snapshot",
          layout: "table",
          columns: 2,
          fields: [
            {
              label: "Overall Health Score",
              path: "accuracy",
              unit: "%",
              decimals: 0,
              classification: "healthScore",
            },
            {
              label: "Wellness Score",
              path: "vitalsMap.wellness_score",
              classification: "healthScore",
            },
            {
              label: "Gender",
              path: "gender",
            },
            {
              label: "Height",
              path: "height",
              unit: "cm",
            },
            {
              label: "Weight",
              path: "weight",
              unit: "kg",
            },
            {
              label: "Health Risk Score",
              path: "vitalsMap.health_risk_score",
              classification: "healthScore",
            },
          ],
        },
        {
          title: "Key Body Vitals",
          layout: "table",
          fields: [
            {
              label: "Heart Rate",
              path: "vitalsMap.vitals.heart_rate",
              unit: "bpm",
              classification: "heartRate",
            },
            {
              label: "Respiratory Rate",
              path: "vitalsMap.vitals.resp_rate",
              unit: "breaths/min",
            },
            {
              label: "Oxygen Saturation",
              path: "vitalsMap.vitals.oxy_sat_prcnt",
              unit: "%",
            },
            {
              label: "Blood Pressure (SYS)",
              path: "vitalsMap.vitals.bp_sys",
              unit: "mmHg",
              classification: "bloodPressureSys",
            },
            {
              label: "Blood Pressure (DIA)",
              path: "vitalsMap.vitals.bp_dia",
              unit: "mmHg",
              classification: "bloodPressureDia",
            },
          ],
        },
        {
          title: "Heart Health",
          layout: "table",
          fields: [
            {
              label: "HR Max",
              path: "vitalsMap.metadata.heart_scores.HRMax",
              unit: "bpm",
            },
            {
              label: "Heart Rate Reserve",
              path: "vitalsMap.metadata.heart_scores.HRR",
            },
            {
              label: "Target HR Range",
              path: "vitalsMap.metadata.heart_scores.THRR",
            },
            {
              label: "Heart Utilization",
              path: "vitalsMap.metadata.heart_scores.heart_utilized",
              unit: "%",
            },
            {
              label: "Stress Index",
              path: "vitalsMap.metadata.heart_scores.stress_index",
            },
          ],
        },
        {
          title: "Stress & Recovery",
          layout: "table",
          fields: [
            {
              label: "pNN50 %",
              path: "vitalsMap.metadata.heart_scores.pNN50_per",
              unit: "%",
            },
            {
              label: "RMSSD",
              path: "vitalsMap.metadata.heart_scores.rmssd",
            },
            {
              label: "SDNN",
              path: "vitalsMap.metadata.heart_scores.sdnn",
            },
            {
              label: "Zone",
              path: "vitalsMap.metadata.heart_scores.zone_details.zone",
            },
          ],
        },
        {
          title: "Fitness Levels",
          layout: "table",
          fields: [
            {
              label: "Jog Test Time",
              path: "exercises[id=235].setList[0].time",
              unit: "sec",
            },
            {
              label: "Squat Repetitions",
              path: "exercises[id=259].setList[0].totalReps",
              unit: "reps",
            },
            {
              label: "Stand & Reach Distance",
              path: "exercises[id=281].setList[0].additionalFields[fieldName=Distance].fieldValue",
              unit: "cm",
            },
          ],
        },
        {
          title: "Body Composition",
          layout: "table",
          fields: [
            {
              label: "BMI",
              path: "bodyCompositionData.BMI",
              classification: "bmi",
            },
            {
              label: "Body Fat %",
              path: "bodyCompositionData.BFC",
              unit: "%",
            },
            {
              label: "Lean Mass",
              path: "bodyCompositionData.LM",
              unit: "kg",
            },
            {
              label: "Fat Mass",
              path: "bodyCompositionData.FM",
              unit: "kg",
            },
          ],
        },
        {
          title: "Posture Analysis",
          layout: "list",
          fields: [
            {
              label: "Frontal View Observations",
              path: "exercises[id=73].analysisList",
              type: "list",
            },
            {
              label: "Side View Observations",
              path: "exercises[id=74].analysisList",
              type: "list",
            },
          ],
        },
        {
          title: "Coaching Tips",
          layout: "list",
          fields: [
            {
              label: "Frontal View Tips",
              path: "exercises[id=73].tipsList",
              type: "list",
            },
            {
              label: "Side View Tips",
              path: "exercises[id=74].tipsList",
              type: "list",
            },
          ],
        },
      ],
    },
    as_card_01: {
      title: "Cardiac Assessment",
      summary:
        "Targeted summary of cardiovascular vitals and body composition.",
      sections: [
        {
          title: "Overall Snapshot",
          layout: "grid",
          columns: 2,
          fields: [
            {
              label: "Overall Health Score",
              path: "accuracy",
              unit: "%",
              decimals: 0,
              classification: "healthScore",
            },
            {
              label: "Wellness Score",
              path: "vitalsMap.wellness_score",
              classification: "healthScore",
            },
            {
              label: "Heart Risk Score",
              path: "vitalsMap.health_risk_score",
              classification: "healthScore",
            },
            {
              label: "Posture During Scan",
              path: "vitalsMap.posture",
            },
          ],
        },
        {
          title: "Key Body Vitals",
          layout: "table",
          fields: [
            {
              label: "Heart Rate",
              path: "vitalsMap.vitals.heart_rate",
              unit: "bpm",
              classification: "heartRate",
            },
            {
              label: "Oxygen Saturation",
              path: "vitalsMap.vitals.oxy_sat_prcnt",
              unit: "%",
            },
            {
              label: "Respiratory Rate",
              path: "vitalsMap.vitals.resp_rate",
              unit: "breaths/min",
            },
            {
              label: "Blood Pressure (SYS)",
              path: "vitalsMap.vitals.bp_sys",
              unit: "mmHg",
              classification: "bloodPressureSys",
            },
            {
              label: "Blood Pressure (DIA)",
              path: "vitalsMap.vitals.bp_dia",
              unit: "mmHg",
              classification: "bloodPressureDia",
            },
          ],
        },
        {
          title: "Cardiovascular Endurance",
          layout: "table",
          fields: [
            {
              label: "Jog Test Time",
              path: "exercises[id=235].setList[0].time",
              unit: "sec",
            },
            {
              label: "Target HR Range",
              path: "vitalsMap.metadata.heart_scores.THRR",
            },
            {
              label: "Cardiac Output",
              path: "vitalsMap.metadata.cardiovascular.cardiac_out",
              unit: "L/min",
            },
            {
              label: "VO2 Max",
              path: "vitalsMap.metadata.physiological_scores.vo2max",
              classification: "vo2Max",
            },
          ],
        },
        {
          title: "Body Composition",
          layout: "table",
          fields: [
            {
              label: "BMI",
              path: "bodyCompositionData.BMI",
              classification: "bmi",
            },
            {
              label: "Body Fat %",
              path: "bodyCompositionData.BFC",
              unit: "%",
            },
            {
              label: "Lean Mass",
              path: "bodyCompositionData.LM",
              unit: "kg",
            },
            {
              label: "Fat Mass",
              path: "bodyCompositionData.FM",
              unit: "kg",
            },
          ],
        },
      ],
    },
  },
};

module.exports = reportConfig;
