# 100x AI Study Mentor

An AI-powered personal study assistant built to help students master the **100x Engineers** Generative AI curriculum. This application uses the **Gemini API** for RAG (Retrieval-Augmented Generation), quiz generation, and code review.

## 🚀 Features

- **Topic-wise Study Lessons**: Generates structured lessons (Overview, Key Concepts, Code Examples) using RAG on course materials.
- **Interactive Quizzes**: dynamically generates MCQs based on the specific week's context.
- **AI Doubt Clearing**: A chat interface that answers questions using the "100x Engineers" curriculum as ground truth.
- **Assignment Helper**: specific feedback and structural guidance on student code/drafts (without giving the full solution).
- **Progress Tracking**: Visual dashboard of mastery levels across all 8 weeks.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI Model**: Google Gemini 1.5 Flash (via `@google/genai` SDK)
- **Icons**: Lucide React
- **Charts**: Recharts

## 📚 Curriculum Covered

1. **Week 1**: GenAI Foundations (Transformers, Tokenization)
2. **Week 2**: Embeddings & Vector Databases
3. **Week 3**: RAG Pipeline Implementation
4. **Week 4**: Advanced RAG (Hybrid Search, Reranking, Evaluation)
5. **Week 5**: Agents & Tool Use
6. **Week 6**: Multi-Agent Orchestration (LangGraph)
7. **Week 7**: Fine-Tuning (PEFT, LoRA)
8. **Week 8**: Deployment & Production (vLLM, Quantization)

## ⚡ Setup & Usage

### Prerequisites
- A Google AI Studio API Key.

### Running Locally
This project uses a modern ES Module structure that can be served directly or built.

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/100x-ai-study-mentor.git
   cd 100x-ai-study-mentor
   ```

2. **Install Dependencies** (Optional, for type checking/local dev)
   ```bash
   npm install
   ```

3. **Set API Key**
   Create a `.env` file in the root (if using a build process) or ensure your environment provides `process.env.API_KEY`.
   
   *Note: For the browser-based version provided here, the API key is expected to be injected into the environment or replaced in the code for local testing.*

4. **Run**
   You can use any static file server:
   ```bash
   npx serve .
   ```

## 🛡️ License

This project is for educational purposes. Course content references belong to 100x Engineers.
