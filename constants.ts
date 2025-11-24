import { Topic, UserProgress } from './types';

export const APP_NAME = "100x AI Study Mentor";

// Simulated "RAG" Database - Aligned with 100x Engineers Curriculum
export const TOPICS: Topic[] = [
  {
    id: 'week1-foundations',
    title: 'Week 1: GenAI & LLM Foundations',
    category: 'Foundation',
    description: 'Mastering the Transformer architecture, Tokenization, and Prompt Engineering strategies (Zero-shot, Few-shot, CoT).',
    contextData: `
      **Generative AI & LLMs**: 
      - **Transformers**: The backbone of modern LLMs (GPT, Gemini, Llama). Key mechanism is "Self-Attention" (weighing the importance of different words in a sequence).
      - **Architecture**: Most LLMs are "Decoder-only" transformers (like GPT), predicting the next token. BERT is "Encoder-only" (good for classification). T5 is "Encoder-Decoder".
      
      **Tokenization**: 
      - LLMs process text as tokens, not words. ~0.75 words per token.
      - **BPE (Byte Pair Encoding)**: Common algorithm used by OpenAI/Anthropic.
      - **Context Window**: The limit of tokens a model can process (e.g., 128k for GPT-4, 1M+ for Gemini).

      **Prompt Engineering Strategies**:
      1. **Zero-shot**: Asking directly without examples.
      2. **Few-shot**: Providing 1-3 input-output examples to guide the pattern.
      3. **Chain of Thought (CoT)**: Asking the model to "think step-by-step" to improve reasoning capabilities on math/logic tasks.
      4. **System Prompts**: Setting the persona and constraints at the system level.
      
      **Parameters**:
      - **Temperature**: Controls creativity (0.0 = deterministic, 1.0 = creative).
      - **Top-P (Nucleus)**: Samples from the top P% cumulative probability.
    `
  },
  {
    id: 'week2-embeddings',
    title: 'Week 2: Embeddings & Vector DBs',
    category: 'Foundation',
    description: 'Understanding semantic search, vector embeddings, and setting up Vector Databases (Pinecone, Chroma).',
    contextData: `
      **Embeddings**:
      - Converting text/images into dense vector lists of numbers (float arrays).
      - **Semantic Meaning**: Concepts with similar meaning are close in vector space (e.g., "King" and "Queen").
      - **Models**: OpenAI text-embedding-3-small/large, Google text-embedding-004, Cohere Embed v3.

      **Vector Search**:
      - Finding the "Nearest Neighbors" (ANN - Approximate Nearest Neighbors).
      - **Distance Metrics**: 
        - **Cosine Similarity**: Measures the angle (most common for text).
        - **Euclidean Distance (L2)**: Measures straight-line distance.
        - **Dot Product**: Magnitude aware.
      - **Algorithms**: HNSW (Hierarchical Navigable Small World) is the industry standard for fast, accurate search.

      **Vector Databases**:
      - **Pinecone**: Managed, serverless, easy to scale.
      - **Weaviate**: Open-source, supports hybrid search well.
      - **Chroma**: Local, open-source, great for prototyping.
      - **Qdrant**: Rust-based, high performance.
      - **pgvector**: Vector extension for PostgreSQL.
    `
  },
  {
    id: 'week3-rag-basics',
    title: 'Week 3: RAG Pipeline Implementation',
    category: 'RAG',
    description: 'Building end-to-end Retrieval Augmented Generation: Ingestion, Chunking, Retrieval, and Synthesis.',
    contextData: `
      **RAG (Retrieval-Augmented Generation)**:
      - Solves LLM limitations: Hallucinations and Knowledge Cutoffs.
      - **Flow**: User Query -> Retrieve Context -> Augment Prompt -> Generate Answer.

      **The Pipeline Steps**:
      1. **Ingestion**: Loading data (PDFs via unstructured, Web via Cheerio/Firecrawl).
      2. **Chunking/Splitting**:
         - **RecursiveCharacterTextSplitter**: Splits by paragraphs, then sentences. Best default.
         - **Fixed Size**: Hard cuts (bad for context).
         - **Semantic Chunking**: Splits based on embedding similarity changes.
         - **Overlap**: Keeping 10-20% overlap between chunks to preserve context at edges.
      3. **Embedding**: Vectorizing the chunks.
      4. **Storage**: Upserting to Vector DB with metadata.
      5. **Retrieval**: Querying the DB.
      6. **Generation**: "Given the context below, answer the question...".

      **Frameworks**:
      - **LangChain**: The most popular orchestration framework.
      - **LlamaIndex**: Specialized for data ingestion and advanced retrieval strategies.
    `
  },
  {
    id: 'week4-advanced-rag',
    title: 'Week 4: Advanced RAG & Evaluation',
    category: 'RAG',
    description: 'Optimizing retrieval with Hybrid Search, Re-ranking (Cohere), GraphRAG, and evaluating with Ragas/DeepEval.',
    contextData: `
      **Advanced Retrieval Techniques**:
      1. **Hybrid Search**: Combining Keyword Search (BM25/Sparse) + Semantic Search (Dense).
         - BM25 finds exact matches (product codes, names).
         - Semantic finds concepts.
         - **Reciprocal Rank Fusion (RRF)**: Algorithm to merge the two result lists.
      
      2. **Re-ranking**:
         - Two-stage retrieval: Retrieve top 50 chunks (cheap) -> Re-rank with a Cross-Encoder (expensive but accurate) -> Pass top 5 to LLM.
         - **Tools**: Cohere Rerank, BGE-Reranker.

      3. **Query Transformations**:
         - **Multi-Query**: Generating 3 variations of the user question to cast a wider net.
         - **HyDE (Hypothetical Document Embeddings)**: Hallucinating an answer, embedding that, and searching for similar content.

      4. **GraphRAG**:
         - Combining Knowledge Graphs with Vector Search to capture relationships between entities that vector similarity might miss.

      **RAG Evaluation**:
      - **Ragas Framework**:
         - **Faithfulness**: Is the answer derived from the context?
         - **Answer Relevance**: Does it answer the query?
         - **Context Precision**: Did we retrieve the right signal?
         - **Context Recall**: Did we miss anything important?
    `
  },
  {
    id: 'week5-agents',
    title: 'Week 5: Agents & Function Calling',
    category: 'Agents',
    description: 'Building reasoning engines using Tool Use (Function Calling), ReAct pattern, and OpenAI Assistants.',
    contextData: `
      **Agents vs RAG**: RAG is for "Knowing", Agents are for "Doing".
      
      **Core Concepts**:
      1. **Function Calling (Tool Use)**:
         - LLMs can output JSON structured to call a function (e.g., \`{ "function": "get_weather", "args": { "city": "London" } }\`).
         - The runtime executes the code and returns the output to the LLM.
      
      2. **ReAct Pattern (Reasoning + Acting)**:
         - The loop: Thought -> Action -> Observation -> Thought...
         - Allows the agent to "think" before doing.
      
      3. **Router Architecture**:
         - Using an LLM to classify intent and route to the correct tool or RAG pipeline.
      
      **Frameworks**:
      - **LangChain Agents**: initialized with \`AgentExecutor\`.
      - **OpenAI Assistants API**: Stateful, hosted threads, built-in Code Interpreter and Retrieval.
    `
  },
  {
    id: 'week6-multi-agent',
    title: 'Week 6: Multi-Agent Orchestration',
    category: 'Agents',
    description: 'Orchestrating complex workflows with LangGraph and CrewAI. State management and cycles.',
    contextData: `
      **Multi-Agent Systems**:
      - Breaking complex tasks into sub-tasks handled by specialized "personas" (e.g., Researcher, Writer, Editor).

      **Architectures**:
      1. **Sequential**: Agent A -> Agent B -> Output.
      2. **Hierarchical**: A "Manager" agent delegates tasks to workers and aggregates results.
      3. **Asynchronous**: Agents working in parallel.

      **LangGraph**:
      - A library for building stateful, multi-actor applications with LLMs.
      - **Nodes**: Functions or Agents.
      - **Edges**: Control flow (conditional jumps).
      - **State**: A shared dictionary (schema) passed between nodes.
      - **Cyclic Graphs**: Unlike standard DAGs, LangGraph supports loops (essential for agentic retry logic).

      **CrewAI**:
      - Higher-level framework focused on Role-Playing. 
      - Define \`Agent\` (Role, Goal, Backstory), \`Task\`, and \`Process\`.
    `
  },
  {
    id: 'week7-finetuning',
    title: 'Week 7: Fine-Tuning LLMs',
    category: 'Deployment',
    description: 'Customizing Open Source models (Llama 3, Mistral) using PEFT, LoRA, and QLoRA techniques.',
    contextData: `
      **Fine-Tuning**:
      - Taking a pre-trained base model and training it further on your specific dataset.
      - **Use Cases**: Style transfer, specific formats (JSON, SQL), niche medical/legal knowledge.

      **Techniques**:
      1. **Full Fine-Tuning**: Updating all weights. Very expensive (requires massive VRAM).
      2. **PEFT (Parameter-Efficient Fine-Tuning)**: Freezing most weights and training only adapters.
      3. **LoRA (Low-Rank Adaptation)**:
         - Injects small rank decomposition matrices into the transformer layers.
         - Reduces trainable parameters by ~99%.
      4. **QLoRA**: Quantized LoRA. Fine-tuning a 4-bit loaded model. Allows fine-tuning Llama-3-70b on a single GPU (A100/H100 or even consumer 4090s for smaller models).

      **Data Format**:
      - Usually "Instruction format": \`{ "instruction": "...", "input": "...", "output": "..." }\`.
    `
  },
  {
    id: 'week8-deployment',
    title: 'Week 8: Serving & Production',
    category: 'Deployment',
    description: 'Deploying LLMs using vLLM, Docker, quantization, and managing inference latency/costs.',
    contextData: `
      **Serving LLMs**:
      - **vLLM**: The state-of-the-art inference engine. Uses **PagedAttention** to optimize KV-cache memory, increasing throughput by 24x.
      - **TGI (Text Generation Inference)**: By HuggingFace.

      **Quantization**:
      - Reducing precision from FP16 (16-bit) to INT8 or INT4.
      - **GGUF**: Format for CPU/Apple Silicon (used with Ollama/Llama.cpp).
      - **AWQ / GPTQ**: Formats for GPU inference.

      **Cost & Optimization**:
      - **Prompt Caching**: (Gemini/Anthropic) Caching the system prompt/context to save tokens and reduce latency.
      - **Batching**: Grouping requests to maximize GPU utilization.

      **Containerization**:
      - Using **Docker** to package the model server and dependencies.
      - Deploying to **Google Cloud Run** (for small models/APIs) or **GKE / Run with GPU** (for large models).
    `
  }
];

export const INITIAL_PROGRESS: UserProgress = {
  completedTopics: [],
  quizScores: {},
  recentActivity: []
};

export const SYSTEM_INSTRUCTION_MENTOR = `
You are an expert AI Study Mentor for the '100x Engineers' course. 
Your primary goal is to help the student (Abhishai) catch up on missed topics.
You are strict but encouraging.
You MUST prioritize the provided CONTEXT data (RAG) over your internal knowledge if they conflict, but generally combine them.
When explaining, break things down into: Concept, Technical Details, and Practical Application.
ALWAYS cite sources if context is provided.
If the user asks for assignment help, DO NOT provide the full solution code. Provide pseudocode, logic breakdowns, or correct specific errors in their draft.
`;
