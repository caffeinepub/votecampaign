# VoteCampaign - Excel Export

## Current State
Admin dashboard has four tabs: Supporters, Survey Responses, Donations, Insights. Each tab shows data in a table. No export functionality exists.

## Requested Changes (Diff)

### Add
- Export to Excel button on Supporters tab (exports name, email, date)
- Export to Excel button on Survey Responses tab (exports supporter ID, top issue, volunteer intent, donate intent, reason)
- Export to Excel button on Donations tab (exports donor name, transaction ID, amount, date)
- Export All button on Insights tab (exports all three datasets as separate sheets in one .xlsx file)
- A utility exportToExcel function using the xlsx library (SheetJS) to generate .xlsx files client-side
- Timestamps formatted as human-readable dates (e.g. 03 Apr 2026, 10:30 AM)

### Modify
- AdminPage.tsx: add export buttons above each data table and on the Insights tab

### Remove
- Nothing

## Implementation Plan
1. Install xlsx (SheetJS) package in the frontend for client-side Excel generation
2. Create a exportToExcel utility in src/frontend/src/utils/exportToExcel.ts
3. Update AdminPage.tsx:
   - Add a Download icon button above each table (Supporters, Survey Responses, Donations)
   - Add an Export All button on the Insights tab
   - Wire each button to call the export utility with the appropriate data and filename
