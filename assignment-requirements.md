# Full Stack Developer Assignment: Assessment Management System

## Overview

Build a web application with user authentication and a PDF report generation system. The system must generate different types of reports from pre-existing assessment data **without requiring code modifications for new assessment types**.

## What You Need to Build

### 1. User Authentication System

**Required functionality:**
- User registration (signup) with proper validation
- User login with secure authentication
- Backend API endpoints for authentication operations
- Frontend forms for user registration and login

### 2. PDF Report Generation System

**Important: What You DON'T Need to Handle**
- ❌ Building assessment interfaces or forms
- ❌ Handling user assessment interactions
- ❌ Storing assessment data to database
- ❌ Automatic event triggering on assessment completion

**What You DO Need to Handle**
- ✅ Reading existing assessment data from your data file
- ✅ Creating an API endpoint for report generation
- ✅ Converting assessment data to formatted PDF reports
- ✅ Handling different assessment types with different report formats

### 3. How the System Works

**Data Flow:**
1. Assessment data is already available in your `data.js/data.ts` file (examples will be provided).
2. Each stored record has a unique `session_id`.
3. Your API endpoint receives a `session_id` parameter.
4. Your system reads the assessment data for that session.
5. System determines report type based on `assessment_id` in the data.
6. System generates the appropriate PDF report.
7. PDF is saved to the local filesystem.

**API Endpoint Required:**
```
POST/GET /generate-report
Parameters: session_id
Response: Success/failure status
Action: Generate PDF and save locally
```

### 4. The Core Challenge: Maximum Flexibility Required

**The Problem:**
Different assessments require completely different report formats and the system must be designed to handle new assessment types **without any code modifications**. Your solution must be completely configuration-driven where adding new assessment types, changing data sources, modifying sections, or updating classification ranges should **only** require configuration changes, **not code changes**.

**Critical Requirements:**
- **Section Configuration**: Which sections to display per `assessment_id`
- **Field Mapping**: Dynamic JSON path mapping for each field
- **Value Classification**: Configurable ranges for field values
- **Template Flexibility**: Support different assessment types without code modification

## 5. Technical Implementation

### Data Storage
- Use a `data.js` or `data.ts` file as your database.
- No external database setup required.
- Store all sample assessment data in this file.

### Backend Requirements
- TypeScript or JavaScript with Node.js
- Use **Puppeteer** to convert HTML templates to PDF
- Save generated PDFs to a local filesystem folder

### Frontend Requirements
- React.js with Tailwind CSS
- Authentication UI (login/signup forms)
- Simple interface to test report generation (optional)

## Submission Requirements

### 1. Code Repository
- Complete codebase pushed to a Git repository
- Setup and installation instructions
- Documentation explaining your configuration system design

### 2. Data Setup
- Include all sample data provided below in your `data.js/data.ts` file
- Structure your data to support `session_id`-based queries

### 3. Configuration System Documentation
- Explain how to add new assessment types
- Show how to modify data field mappings
- Demonstrate how to update classification ranges
- Provide examples of configuration files/structures

### 4. Demonstration Video
Record a screen capture showing:
- User registration and login process
- API call to your report generation endpoint with a `session_id`
- Generated PDF file appearing in local filesystem
- Opening and viewing the generated PDF report
- **Bonus**: Show how easy it is to modify configuration for different assessment types

### 5. Testing with Provided Data
- Use the exact sample datasets provided below
- Demonstrate your system working with different `assessment_id` values
- Show how your configuration system handles different assessment types

## Success Criteria

### Functional Requirements
- Working user authentication system
- API endpoint that successfully generates PDFs from session data
- Proper file storage in local filesystem
- Correct handling of provided sample data

### Flexibility Requirements
- System must handle different assessment types through configuration only
- Data field mappings must be configurable without code changes
- Classification ranges must be configurable without code changes
- New assessment types should be addable through configuration alone

### Demonstration Requirements
- Clear video walkthrough showing complete functionality
- Evidence of successful PDF generation from provided sample data
- Proof that the system's flexibility works as designed

## Sample Assessment Data and Analysis

**IMPORTANT**: Sample assessment reports can be accessed from the `reportLink` field provided in the example datasets below.

### Sample Dataset 1: Health & Fitness Assessment (as_hr_02)

```json
{
  "session_id": "session_001",
  "accuracy": 80,
  "assessmentResultId": "-OK76ANqAq9pvKSl3ZoN",
  "assessment_id": "as_hr_02",
  "bodyCompositionData": {
    "AGR": "1.687",
    "Age": "43",
    "BFC": "29.754",
    "BMI": "33.145",
    "BMR": "2054.217",
    "FM": "33.027",
    "FMI": "9.862",
    "HeightM": "184.091",
    "LM": "77.973",
    "LMI": "23.283",
    "M_Age": "48",
    "WHGR": "0.564",
    "WHR": "0.926"
  },
  "exercises": [
    {
      "analysisList": [
        "Shoulders slightly uneven, affecting posture balance.",
        "Head alignment slightly off-center.",
        "Feet aligned properly under shoulders.",
        "Arms hang naturally by the sides."
      ],
      "analysisScore": 75,
      "assignReps": 1,
      "correctReps": 1,
      "id": 73,
      "name": "Frontal body view",
      "setList": [
        {
          "additionalFields": [
            {
              "fieldName": "accuracy",
              "fieldText": "Score",
              "fieldUnit": "%",
              "fieldValue": "0.0",
              "shouldDisplay": false
            }
          ],
          "correctReps": 1,
          "incorrectReps": 0,
          "isSkipped": false,
          "time": 10,
          "totalReps": 1
        }
      ],
      "side": "left",
      "tipsList": [
        "Practice shoulder alignment exercises daily.",
        "Focus on maintaining head center alignment."
      ],
      "totalReps": 1,
      "totalSets": 1,
      "variationId": "",
      "variationName": ""
    },
    {
      "analysisList": [
        "Head leans slightly forward.",
        "Spine shows slight curvature at neck.",
        "Hips aligned over ankles correctly.",
        "Knees are slightly bent, affecting stance."
      ],
      "analysisScore": 70,
      "assignReps": 1,
      "correctReps": 1,
      "id": 74,
      "name": "Side body view",
      "setList": [
        {
          "additionalFields": [
            {
              "fieldName": "accuracy",
              "fieldText": "Score",
              "fieldUnit": "%",
              "fieldValue": "0.0",
              "shouldDisplay": false
            }
          ],
          "correctReps": 1,
          "incorrectReps": 0,
          "isSkipped": false,
          "time": 22,
          "totalReps": 1
        }
      ],
      "side": "left",
      "tipsList": [
        "Engage in neck strengthening exercises.",
        "Consciously practice standing with straight knees."
      ],
      "totalReps": 1,
      "totalSets": 1,
      "variationId": "",
      "variationName": ""
    },
    {
      "assignReps": 10,
      "correctReps": 1,
      "id": 235,
      "name": "Jog test",
      "setList": [
        {
          "additionalFields": [
            {
              "fieldName": "accuracy",
              "fieldText": "Score",
              "fieldUnit": "%",
              "fieldValue": "99.17062",
              "shouldDisplay": false
            }
          ],
          "correctReps": 1,
          "incorrectReps": 0,
          "isSkipped": false,
          "time": 61,
          "totalReps": 1
        }
      ],
      "side": "left",
      "totalReps": 1,
      "totalSets": 1,
      "variationId": "",
      "variationName": ""
    },
    {
      "assignReps": 45,
      "correctReps": 42,
      "id": 259,
      "name": "Squat",
      "setList": [
        {
          "additionalFields": [
            {
              "fieldName": "accuracy",
              "fieldText": "Score",
              "fieldUnit": "%",
              "fieldValue": "93.333336",
              "shouldDisplay": false
            },
            {
              "fieldName": "reps",
              "fieldText": "Reps",
              "fieldUnit": "reps",
              "fieldValue": "42",
              "shouldDisplay": true
            }
          ],
          "correctReps": 42,
          "incorrectReps": 0,
          "isSkipped": false,
          "time": 90,
          "totalReps": 42
        }
      ],
      "side": "left",
      "totalReps": 42,
      "totalSets": 1,
      "variationId": "",
      "variationName": ""
    },
    {
      "assignReps": 1,
      "correctReps": 1,
      "id": 281,
      "name": "Stand and reach",
      "setList": [
        {
          "additionalFields": [
            {
              "fieldName": "accuracy",
              "fieldText": "Score",
              "fieldUnit": "%",
              "fieldValue": "75.11575",
              "shouldDisplay": false
            },
            {
              "fieldName": "Distance",
              "fieldText": "Distance",
              "fieldUnit": "CM",
              "fieldValue": "45.538174",
              "shouldDisplay": false
            }
          ],
          "correctReps": 1,
          "incorrectReps": 0,
          "isSkipped": false,
          "time": 10,
          "totalReps": 1
        }
      ],
      "side": "left",
      "totalReps": 1,
      "totalSets": 1,
      "variationId": "",
      "variationName": ""
    }
  ],
  "finalPainScore": "pending",
  "gender": "male",
  "height": 183,
  "initialPainScore": 0,
  "initialVAS": 0,
  "isLandmarksUploaded": false,
  "laterPainScore": "pending",
  "reportLink": "https://storage.googleapis.com/allycareprod.appspot.com/fWOr2t8S94e0BIIlcUKkh7m629d2/GthcXa9eHlfnU2BGIIerrAoDZMH2/-OK76AihRKe9xdHFWjuY.pdf?GoogleAccessId=firebase-adminsdk-y618w%40allycareprod.iam.gserviceaccount.com&Expires=16447017600&Signature=pPula7IsDbCSgkrgINHibG7dtPcToWZ%2BmzLfi82QUnbwIYMIeycm%2BFdSB1IrLv%2FLgra3X2HaGT3OcvmEm0PyTNQ%2Ft%2FYjZWWKEwVAGPBcdibR1irczpl47UdFpFGxLWLswKPooopFj2EHrvvnU88Umgr2vWjk2JIHVr6IMgtaIkTCC9nWXCJ3Zw2NqlIN8bbr4s%2BQk8KIov8vWEplb5neT56%2F%2FGC8W66bThKW5otWsTMC4GB9SFrnFheivFu8rPbGnnTJOilpY9dtKj6pOPr6K%2F50oF7y2pfjCuQILFX9JzCMiVZwam6EcWHileYEPzZdqeE%2FspOYBzwN9%2FC3RE6%2BJQ%3D%3D",
  "reportsDataId": "-OK76BS5l9VB-QMbIOEo",
  "timeElapsed": 193,
  "timestamp": 1740671597044,
  "vitalsMap": {
    "api_key": "CNCPg45zbVxGlB7r74xb",
    "employee_id": "SCAN_USER",
    "entry_time": "2025-02-27 15:53:11.840940+00:00",
    "health_risk_score": 16,
    "metadata": {
      "cardiovascular": {
        "cardiac_out": 6.3,
        "map": 96,
        "prq": 3.57
      },
      "fps": 114,
      "glucose_info": {
        "diabetes_control_score": 57.5,
        "hba1c": 5.2,
        "status": "beta"
      },
      "heart_scores": {
        "HRMax": 191,
        "HRR": "116",
        "THRR": "145 - 191",
        "heart_utilized": "40",
        "pNN50_per": 47.37,
        "rmssd": 23.64,
        "sdnn": 45.88,
        "stress_index": 1.4,
        "zone_details": {
          "highZoneRange": 94,
          "lowZoneRange": "--",
          "zone": "Rest"
        }
      },
      "physiological_scores": {
        "bloodvolume": "6354.9",
        "bmi": "33.15",
        "bodyfat": "33.36",
        "cal_carb": "93.51",
        "cal_fat": "6.49",
        "dob": "1999-06-05",
        "gender": "male",
        "height": "183.0",
        "intensity": "Hard",
        "tbw": "57.13",
        "tbwp": "51.47",
        "vo2max": "79.83",
        "weight": "111.0"
      }
    },
    "posture": "exercising",
    "scan_completion_time": "2025-02-27T15:53:16.002564+00:00",
    "scan_id": "069da947-4efd-4c31-8169-c02e4de8f639",
    "statusCode": 200,
    "vitals": {
      "bp_dia": 82,
      "bp_sys": 124,
      "heart_rate": 75,
      "oxy_sat_prcnt": 96,
      "resp_rate": 21
    },
    "wellness_score": 84
  },
  "weight": 111
}
```

### Sample Dataset 2: Cardiac Assessment (as_card_01)

```json
{
  "session_id": "session_002",
  "accuracy": 17,
  "assessmentResultId": "-OTafA4SqUgE6Y5xrqiI",
  "assessment_id": "as_card_01",
  "bodyCompositionData": {
    "AGR": "0.90",
    "BFC": "-0.90",
    "BMI": "9.51",
    "BMR": "995.39",
    "FM": "-0.18",
    "FMI": "-0.09",
    "LM": "20.18",
    "LMI": "9.60",
    "M_Age": "15",
    "WHGR": "0.37",
    "WHR": "1.01"
  },
  "exercises": [
    {
      "assignReps": 1,
      "correctReps": 1,
      "id": 73,
      "name": "Frontal body view",
      "setList": [
        {
          "additionalFields": [
            {
              "fieldName": "accuracy",
              "fieldText": "Score",
              "fieldUnit": "%",
              "fieldValue": "0",
              "shouldDisplay": false
            }
          ],
          "correctReps": 1,
          "incorrectReps": 0,
          "isSkipped": false,
          "time": 10,
          "totalReps": 1
        }
      ],
      "side": "left",
      "totalReps": 1,
      "totalSets": 1,
      "variationId": "\"\"",
      "variationName": "\"\""
    },
    {
      "assignReps": 1,
      "correctReps": 1,
      "id": 74,
      "name": "Side body view",
      "setList": [
        {
          "additionalFields": [
            {
              "fieldName": "accuracy",
              "fieldText": "Score",
              "fieldUnit": "%",
              "fieldValue": "0",
              "shouldDisplay": false
            }
          ],
          "correctReps": 1,
          "incorrectReps": 0,
          "isSkipped": false,
          "time": 10,
          "totalReps": 1
        }
      ],
      "side": "left",
      "totalReps": 1,
      "totalSets": 1,
      "variationId": "\"\"",
      "variationName": "\"\""
    },
    {
      "assignReps": 10,
      "correctReps": 0,
      "id": 235,
      "name": "Jog test",
      "setList": [
        {
          "additionalFields": [
            {
              "fieldName": "accuracy",
              "fieldText": "Score",
              "fieldUnit": "%",
              "fieldValue": "15.164222764530614",
              "shouldDisplay": false
            }
          ],
          "correctReps": 0,
          "incorrectReps": 0,
          "isSkipped": false,
          "time": 47,
          "totalReps": 0
        }
      ],
      "side": "left",
      "totalReps": 0,
      "totalSets": 1,
      "variationId": "\"\"",
      "variationName": "\"\""
    }
  ],
  "finalPainScore": "pending",
  "gender": "male",
  "height": 145,
  "initialPainScore": 0,
  "initialVAS": 0,
  "isLandmarksUploaded": false,
  "laterPainScore": "pending",
  "reportLink": "https://firebasestorage.googleapis.com/v0/b/rootallyai.appspot.com/o/reports%2FW2g8IThefhPc3SNAv46x2TT3hOB3%2FzHSezoe7w3exoakaC4dGGMneB0u2%2Fgugh_7713.pdf?alt=media&token=388e74f0-616b-43b5-8d14-0424b123d5c8",
  "timeElapsed": 67,
  "timestamp": 1750848025493,
  "vitalsMap": {
    "api_key": "CNCPg45zbVxGlB7r74xb",
    "employee_id": "SCAN_USER",
    "entry_time": "2024-09-26 07:26:15.188795+00:00",
    "health_risk_score": 16,
    "metadata": {
      "cardiovascular": {
        "cardiac_out": 5.68,
        "map": 95.33,
        "prq": 3.47
      },
      "fps": 114,
      "glucose_info": {
        "diabetes_control_score": 77.5,
        "hba1c": 5.2,
        "status": "beta"
      },
      "heart_scores": {
        "HRMax": 191,
        "HRR": "125",
        "THRR": "< 90",
        "heart_utilized": "45",
        "pNN50_per": 37.66,
        "rmssd": 27.12,
        "sdnn": 50.81,
        "stress_index": 1.6,
        "zone_details": {
          "highZoneRange": 94,
          "lowZoneRange": "--",
          "zone": "Rest"
        }
      },
      "physiological_scores": {
        "bloodvolume": "5414.04",
        "bmi": "26.23",
        "bodyfat": "23.4",
        "cal_carb": "--",
        "cal_fat": "--",
        "dob": "1999-06-05",
        "gender": "male",
        "height": "180.0",
        "intensity": "Very Light",
        "tbw": "48.07",
        "tbwp": "56.55",
        "vo2max": "44.08",
        "weight": "85.0"
      }
    },
    "posture": "resting",
    "scan_completion_time": "2024-09-26T07:26:16.821174+00:00",
    "scan_id": "ce310698-d79a-4cd2-9df7-60de836d2786",
    "statusCode": 200,
    "user_id": "1abc0416-e7bd-47b3-9098-696d35f79408",
    "vitals": {
      "bp_dia": 75,
      "bp_sys": 110,
      "heart_rate": 66,
      "oxy_sat_prcnt": 95,
      "resp_rate": 19
    },
    "wellness_score": 84
  },
  "weight": 20
}
```

## Understanding the Flexibility Requirements

### Assessment Type Configuration

- **For assessment_id: "as_hr_02" (Health & Fitness Assessment)**: Shows sections like 'Key Body Vitals', 'Heart Health', 'Stress Level', 'Fitness Levels', 'Posture', 'Body Composition'.

- **For assessment_id: "as_card_01" (Cardiac Assessment)**: Shows only 'Key Body Vitals', 'Cardiovascular Endurance', 'Body Composition'.

### Dynamic Data Field Mapping Examples

- **Overall Health Score**: Shows the `accuracy` field from the top level of the JSON data.
- **Heart Rate (in Key Body Vitals)**: Shows `vitalsMap.vitals.heart_rate`.
- **Cardiovascular Endurance (in Fitness Levels)**: Shows the `time` field from `setList` of exercise with `id: 235` in the `exercises` array.
- **BMI (in Body Composition)**: Shows `bodyCompositionData.BMI`.
- **Blood Pressure Systolic**: Shows `vitalsMap.vitals.bp_sys`.
- **Blood Pressure Diastolic**: Shows `vitalsMap.vitals.bp_dia`.

**This flexibility must be achieved through configuration, not code changes.**