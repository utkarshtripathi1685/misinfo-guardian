# Verity AI - Project Report

## 1. Introduction

Verity AI is a web-based application designed to combat the spread of misinformation. It serves as an intelligent tool for users to critically evaluate the credibility of digital content. In an age where information (and misinformation) spreads rapidly online, Verity AI provides a first line of defense, helping users distinguish between reliable information and potentially manipulative or false content. The application analyzes user-submitted text and images, providing a nuanced assessment of credibility, highlighting suspicious claims, and educating users on common misinformation tactics. The project is built on a modern web stack and leverages generative AI for its core analysis capabilities.

## 2. Project Objective

The primary objective of Verity AI is to empower end-users to navigate the digital landscape with more confidence and skepticism. The project aims to deliver a user-friendly tool that:

*   **Analyzes Content:** Accepts text or images as input and uses AI to perform a comprehensive analysis.
*   **Provides Risk Assessment:** Generates a clear, understandable credibility score (e.g., High Credibility, Potentially Misleading, Low Credibility) for the submitted content.
*   **Offers Actionable Evidence:** Extracts specific claims from the content and allows users to trigger a live web search to find verifying or contradicting evidence from credible sources.
*   **Educates Users:** Explains *why* content was flagged, highlights manipulative language, and offers a learning section with general tips on spotting fake news, scams, and other forms of misinformation.
*   **Ensures Transparency:** Operates with a clear disclaimer that the AI's assessment is guidance, not absolute truth, and respects user privacy by not storing submitted content long-term.

## 3. Feasibility Study

A feasibility study assesses the practicality of the project.

*   **Technical Feasibility:** The project is technically feasible. The chosen technology stack (Next.js, React, Genkit) is modern, well-supported, and suitable for building robust, AI-powered web applications. Genkit provides a streamlined way to interact with powerful Large Language Models (LLMs) like Google's Gemini, which is capable of the required text analysis, OCR, and fact-checking logic.
*   **Operational Feasibility:** The application is designed to be straightforward for the end-user. The three-panel layout (Assessment, Evidence, Learn) creates an intuitive workflow. The core process of pasting text or uploading an image is a standard user pattern, requiring minimal training.
*   **Economic Feasibility:** As a prototype, the primary costs are related to API usage for the AI models. For a production-scale application, these costs would need to be managed, but for a prototype, they are well within acceptable limits. The development itself relies on open-source frameworks, minimizing software costs.
*   **Schedule Feasibility:** The project timeline is defined as follows:
    *   **Start Date:** 16-Aug-2025
    *   **End Date:** 20-Nov-2025

    **Project Schedule (Gantt Chart Representation)**
    *   **Phase 1: Core Scaffolding & UI (Weeks 1-3):**
        *   Setup Next.js project.
        *   Implement the three-panel UI layout (Assessment, Evidence, Learn).
        *   Develop basic components (header, footer, input forms).
    *   **Phase 2: AI Flow - Text Analysis (Weeks 3-5):**
        *   Develop Genkit flow for text analysis.
        *   Implement credibility scoring and explanation generation.
        *   Integrate the flow with the frontend.
    *   **Phase 3: AI Flow - Image Analysis & OCR (Weeks 5-7):**
        *   Develop Genkit flow for image OCR.
        *   Connect OCR output to the text analysis flow.
        *   Enable and test the image upload feature.
    *   **Phase 4: Evidence & Fact-Checking (Weeks 7-10):**
        *   Develop the live web search tool.
        *   Create the fact-checking flow that uses the search tool.
        *   Build the UI for the "Evidence" tab to display fact-check results.
    *   **Phase 5: User Education & Finalization (Weeks 10-12):**
        *   Populate the "Learn" panel with educational content.
        *   Add user feedback mechanisms and disclaimers.
        *   Refine UI/UX, perform testing, and prepare for final review.
    *   **Phase 6: Project Completion & Documentation (Week 13):**
        *   Final testing and bug fixes.
        *   Complete project documentation.
        *   Project sign-off.

## 4. Methodology/ Planning of work

The project follows an iterative development methodology.

1.  **Foundation:** Establish the basic Next.js application structure and the core UI layout with the three panels.
2.  **Core AI Integration:** Develop the primary AI flow for text analysis. This is the central feature. The UI will be connected to this flow to provide the initial end-to-end user experience.
3.  **Feature Expansion:** Incrementally add new features. First, image analysis (OCR) is added as an alternative input method. Next, the fact-checking and evidence-gathering functionality is built on top of the initial analysis.
4.  **Content & UX Refinement:** With the core functional pieces in place, the focus shifts to improving the user experience, populating the educational content, and adding important elements like disclaimers and feedback options.
5.  **Testing & Deployment:** Continuous testing is performed throughout the lifecycle.

**Architecture Diagram (High-Level):**

```
[User's Browser (React/Next.js Frontend)]
       |
       | 1. User submits text or image
       V
[Next.js Server Actions]
       |
       | 2. Calls the appropriate AI flow
       V
[Genkit AI Flows (Server-side)] --- 3. Interacts with --> [Google AI (Gemini)]
       |         (e.g., analyze, ocr, fact-check)          |
       |                                                    | 4. (For Fact-Check)
       |<--------------------------------------------------|   Uses Search Tool
       |                                                    |
       V                                                    V
[Analysis / Fact-Check Result]                      [Live Web Search API]
       |
       | 5. Result is returned to Server Action
       V
[Next.js Server Actions]
       |
       | 6. Data is sent back to the client
       V
[User's Browser (React/Next.js Frontend)]
       |
       | 7. UI is updated to display results
       V
[Assessment | Evidence | Learn Panels]
```

## 5. Tools/Technology Used

### 5.1 Minimum Hardware Requirements

*   **CPU:** Dual-core processor or better
*   **RAM:** 8 GB
*   **GPU:** Not required for development
*   **HDD:** 20 GB of free space

### 5.2 Minimum Software Requirements

*   **OS:** Windows 10/11, macOS, or a modern Linux distribution.
*   **Node.js:** v18.x or later
*   **npm/yarn:** Latest versions
*   **IDE:** Visual Studio Code (recommended)
*   **Web Browser:** Chrome, Firefox, or Edge (latest versions)
*   **Core Frameworks:**
    *   **Next.js:** v15+ (React framework)
    *   **React:** v18+ (UI library)
    *   **Genkit:** v1+ (AI framework)
    *   **TypeScript:** v5+

## 6. References

*   *Genkit Documentation.* (2024). Google Developers. Retrieved from https://firebase.google.com/docs/genkit
*   *Next.js Documentation.* (2024). Vercel. Retrieved from https://nextjs.org/docs
*   *ShadCN UI Components.* (2024). Retrieved from https://ui.shadcn.com/
*   Weaver, S. (2023). *A-Z of AI.* O'Reilly Media.
*   Russell, S., & Norvig, P. (2020). *Artificial Intelligence: A Modern Approach.* Pearson.
