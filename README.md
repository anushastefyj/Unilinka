# UNILINKA — Student Frontend Revamp

This document summarizes the comprehensive redesign and feature expansion of the UNILINKA Student Dashboard completed on August 26, 2026.

## 🎨 Design System
The entire platform has been unified under a new, premium aesthetic designed to feel welcoming, warm, and distinctly academic:
- **Backgrounds:** Warm off-white/cream `#FAF7F0` (pages) and `#FFFFFF` (cards).
- **Primary Accents:** Deep forest green `#1F4D3A` (active states, buttons, headers) with a lighter hover state `#2E6B4F`.
- **Secondary Accents:** Soft beige/tan `#EFE7D8` (tag chips, subtle panels).
- **Typography:** Serif display fonts for headings to convey academic rigor; clean sans-serif for readable body text.
- **Illustration Style:** Minimal, flat, rounded illustrations (using `AppIcon` abstractions) for empty states and onboarding.

## 🏗️ Core Architecture (Student-Facing)
**Core Rule:** Students are Viewers/Downloaders only. All upload UI has been stripped from the student views to streamline the experience.

### 1. Auth Flow (`/login`, `/signup`)
- Completely restyled with the new cream/green design system.
- Two-column layout with engaging, custom-styled feature highlights.

### 2. The Drill-Down Dashboard
The dashboard uses a structured, drill-down taxonomy to keep thousands of resources organized without overwhelming the user:
- **Hierarchy:** `Year → Branch → Semester → Subject → Resource`
- **Two Core Views:**
  - **Question Papers:** Dedicated view for previous year exams.
  - **Curriculum:** Dedicated view for syllabus topics, notes, and case studies.

### 3. Profile & Settings (`/profile`, `/settings`)
- **Identity Card:** A polished, read-only ID card displaying the student's branch, year, roll number, and status.
- **Downloads Library:** Locally tracked history (`unilinka_downloads` in `localStorage`) displaying the last 10 resources the student downloaded.
- **Settings:** A clean control panel for Account, Notification, and Appearance preferences.

---

## ✨ Advanced Features Built

### 1. Subject Merge (Smart Querying)
- **Problem:** "Engineering Mathematics-I" was siloed between CSE, ECE, and ME branches, fracturing the resource pool.
- **Solution:** Implemented `COMMON_SUBJECT_MAPPINGS` in `src/config/curriculum.js`. When a student clicks a shared subject, the Supabase query automatically bundles resources from all equivalent branches, massively enriching the data pool.

### 2. PDF Text Indexing & Smart Search (Mocked UI)
- The global search bar now highlights matching text snippets *inside* the PDF content, simulating deep text extraction.

### 3. Inline PDF Preview
- Built `ResourcePreviewModal.jsx`. Instead of forcing a download, students can click "Preview" to read the PDF directly in a beautiful, full-screen overlay using a browser-native iframe.

### 4. AI Subject Summary (`SubjectAISummary.jsx`)
- Added a widget to the Question Papers view that generates a "Smart Summary" of the subject, analyzing historical paper trends to tell students what to focus on. *(Currently mocked on frontend).*

### 5. Frequently Asked Topics (`FrequentlyAskedPanel.jsx`)
- Automatically parses subject data to highlight the top 3 most repeated questions/topics across previous years, displaying them in a sleek, color-coded panel.

### 6. Syllabus Progress Tracking
- Built into the `CurriculumList.jsx` view. Students can check off syllabus topics as they study them. Progress is visualized in a progress bar and saved persistently in `localStorage` (`unilinka_progress`).

### 7. Issue Reporting (`ReportIssueModal.jsx`)
- Added a "Flag" icon to every single resource card.
- Allows students to report broken links, poor scan quality, or wrong files.
- Also added to "Empty States" so students can request missing resources.

### 8. Bulk Download (ZIP)
- Integrated `jszip`.
- Added a **"Download All"** button inside expanded subjects. It fetches all file blobs, compresses them in the browser, and delivers a single `.zip` file containing the entire subject's curriculum or question papers.

### 9. Gamification (Study Streak)
- Added a flame icon to the global header (`StudentLayout.jsx`) that tracks consecutive daily logins (stored in `localStorage`), encouraging consistent study habits.

---

## 🚀 Next Steps (Admin / Backend Phase)
To bring these frontend features to life in production, the following backend tasks remain:
1. **Admin Upload Portal:** Build the UI for faculty/admins to upload resources and tag them with Year/Branch/Semester/Subject.
2. **Text Extraction Pipeline:** Hook up a Python backend or Edge Function to extract raw text from PDFs on upload for the deep search indexing.
3. **OpenAI Integration:** Replace the mocked AI summaries and Frequently Asked topics with live API calls to an LLM, feeding it the extracted text.
4. **Issue Queue:** Connect the `ReportIssueModal` submissions to an admin-facing ticketing table in Supabase.
