# MentorAI: The Elite Multimodal Study Assistant

**Transforming static content into interactive mastery paths.**

MentorAI is a production-grade educational platform designed to bridge the gap between passive reading and active mastery. It leverages the cutting-edge reasoning capabilities of Google Gemini 3 to turn static study materials—like PDFs, lecture recordings, and complex diagrams—into dynamic, gamified learning experiences.

---

## 🚀 Project Description

MentorAI acts as a personal AI tutor that doesn't just give answers but fosters deep understanding. By integrating Multimodal Retrieval-Augmented Generation (RAG), the system "reads" your documents and "listens" to your lectures, providing a context-aware conversation partner. It features a unique "Reasoning Trace" UI that exposes the model's internal chain-of-thought, teaching students the logic behind every solution.

## ✨ Key Features

- **🧠 Multimodal RAG Engine:** Upload PDFs, images, or audio files. MentorAI indexes this content, allowing you to "chat" with your textbook or lecture.
- **⚙️ Deep Reasoning Visualization:** A dedicated UI block parses and displays the model's internal step-by-step logic, promoting metacognition and deeper learning.
- **🎴 Gamified Active Recall:** 
  - **3D Mastery Cards:** Interactive flashcard grid optimized for side-by-side comparison and quick recall.
  - **Adaptive Quiz Agent:** Full-screen, viewport-optimized quizzes with instant feedback and pedagogical explanations.
- **🗺️ Interactive Study Planner:** Generates structured milestones and task lists based on your specific study materials.
- **🌓 Adaptive Theme Management:** Seamless transition between Glassmorphism Dark and Light modes for comfortable late-night study sessions.
- **📱 Responsive Elite UI:** Designed for high-density information display without cognitive overload.

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (Advanced Glassmorphism & Custom Animations)
- **AI Orchestration:** Google GenAI SDK (`@google/genai`)
- **Icons:** Font Awesome 6 Pro
- **State Management:** React Context & LocalStorage Persistence

## 🤖 Why Gemini?

We utilized a hybrid model architecture to achieve the perfect balance of intelligence and performance:

1.  **Gemini 3 Pro (The Reasoning Engine):**
    - Used for the **Chat and Logic Solver**.
    - Leveraged the `thinkingConfig` to expose the model's step-by-step trace.
    - Utilized its massive context window to "pin" entire documents for high-fidelity RAG.
2.  **Gemini 3 Flash (The Speed Engine):**
    - Powering the **Flashcard Generator, Quiz Agent, and Study Planner**.
    - Relied on its low latency and strict `responseSchema` adherence to generate complex JSON data structures instantly.

## 🌟 Impact & Purpose

### Why this project?
Education is shifting from "what you know" to "how you think." Most AI study tools are simple wrappers that provide flat answers. MentorAI was chosen to demonstrate how multimodal LLMs can be used to build a **pedagogical tool** rather than just a lookup tool. It solves the problem of "Information Overload" by distilling huge documents into actionable, testable units.

### The Impact
- **Reduces Cognitive Load:** By organizing information into milestones.
- **Increases Retention:** Through active recall (Quizzes/Flashcards) rather than passive reading.
- **Builds Confidence:** By showing the "Reasoning Trace," students learn the *how*, not just the *what*, reducing academic anxiety in STEM subjects.

---

*Built for the Maximally Vibe-a-thon 2025.*
