# Report configuration reference

The PDF output is completely controlled by `backend/src/config/reportConfig.js`. No application code changes are necessary when you:

- Introduce a new assessment type
- Reorder sections or rename headers
- Map values from different parts of the assessment payload
- Update classification ranges or badges

## File structure

```js
module.exports = {
  outputDir: '/absolute/path/to/backend/reports',
  classifications: { /* shared value ranges */ },
  assessments: {
    [assessmentId]: {
      title: 'Visible on the PDF',
      summary: 'Optional subtitle',
      sections: [ /* Section descriptors */ ]
    }
  }
};
```

### Classifications

Reusable value classifications live inside the `classifications` object. Each entry defines an array of ranges with inclusive `min` / `max` boundaries, a human-readable `label`, and a background `color` that is rendered as a badge in the PDF.

```js
classifications: {
  healthScore: [
    { min: 0, max: 49.99, label: 'Needs Attention', color: '#dc2626' },
    { min: 50, max: 74.99, label: 'Average', color: '#f97316' },
    { min: 75, max: 89.99, label: 'Good', color: '#16a34a' },
    { min: 90, max: Infinity, label: 'Excellent', color: '#15803d' }
  ]
}
```

### Sections & fields

Every assessment contains an ordered array of `sections`. A section descriptor accepts the following properties:

| Property | Type | Description |
| --- | --- | --- |
| `title` | `string` | Heading displayed in the PDF |
| `layout` | `'table' \| 'grid' \| 'list'` | Controls how the section is rendered |
| `columns` | `number` | Only for `grid` layout – number of columns |
| `fields` | `FieldConfig[]` | Field definitions within the section |

`FieldConfig` properties:

| Property | Type | Description |
| --- | --- | --- |
| `label` | `string` | Visible field label |
| `path` | `string` | JSON path resolver (see below) |
| `unit` | `string` | Optional unit suffix |
| `decimals` | `number` | Round numeric values to a fixed number of decimals |
| `classification` | `string` | Key of a classification in the shared map |
| `type` | `'list'` | Render values as bullet points (only for list sections) |
| `defaultValue` | `string` | Override the default fallback of `N/A` |

### JSON path syntax

The `path` property uses a lightweight JSON path dialect that supports:

- Dot notation for nested fields (`vitalsMap.vitals.heart_rate`)
- Array index access (`setList[0].time`)
- Array filtering by property (`exercises[id=235].setList[0].time`)
- Array filtering by nested property (`additionalFields[fieldName=Distance].fieldValue`)
- Resetting to the root object with `$root` when composing relative paths

The resolver automatically coerces numeric strings to numbers, enabling accurate classification matching without additional code.

### Adding a new assessment type

1. Duplicate an existing assessment block inside `assessments`.
2. Update the `title`, `summary`, and `sections` to match your layout.
3. For each field, map `path` to the source data key.
4. Optionally reference existing `classification` keys, or define new ranges at the top of the file.
5. Save the configuration. No restarts are required when running in watch mode; the next report request will use the updated definition.

### Updating sample data

The API reads from `backend/data/assessments.js`. Add or modify records in this file to expose new sessions that can be referenced via `session_id`.

### Troubleshooting tips

- Ensure the JSON path resolves to a value. Non-existent keys fall back to `N/A`.
- Classification badges only appear for numeric values and when a matching range is found.
- When Puppeteer runs in headless environments, keep the `--no-sandbox` flag in the generator to avoid permissions issues.
