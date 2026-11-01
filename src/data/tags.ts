/**
 * The tag taxonomy. A project's `tags` are validated against these slugs at
 * build time, so a new tag has to be added here on purpose. That is what keeps
 * near-duplicates like `system-design` / `systems-design` from creeping back.
 */
export const TAG_LABELS = {
	// Languages
	python: "Python",
	cpp: "C++",
	csharp: "C#",
	typescript: "TypeScript",
	javascript: "JavaScript",

	// Machine learning
	"machine-learning": "Machine Learning",
	"deep-learning": "Deep Learning",
	"computer-vision": "Computer Vision",
	"image-processing": "Image Processing",
	nlp: "NLP",
	llm: "LLMs",
	rag: "RAG",
	"generative-ai": "Generative AI",
	"unsupervised-learning": "Unsupervised Learning",
	"evolutionary-algorithms": "Evolutionary Algorithms",
	"recommender-systems": "Recommender Systems",
	quantization: "Quantization",
	"data-science": "Data Science",
	"data-engineering": "Data Engineering",

	// ML and data libraries
	pytorch: "PyTorch",
	keras: "Keras",
	"scikit-learn": "scikit-learn",
	transformers: "Transformers",
	pandas: "Pandas",
	numpy: "NumPy",
	openai: "OpenAI",

	// Domains
	"medical-ai": "Medical AI",
	fhir: "HL7 FHIR",
	fintech: "Fintech",
	blockchain: "Blockchain",
	"remote-sensing": "Remote Sensing",
	"augmented-reality": "Augmented Reality",
	simulation: "Simulation",
	"game-development": "Game Development",

	// Systems and hardware
	backend: "Backend",
	"system-design": "System Design",
	"ui-development": "UI Development",
	testing: "Testing",
	"performance-optimization": "Performance Optimization",
	"gpu-programming": "GPU Programming",
	cuda: "CUDA",
	fpga: "FPGA",

	// Frameworks and platforms
	react: "React",
	"react-native": "React Native",
	nextjs: "Next.js",
	fastapi: "FastAPI",
	flask: "Flask",
	dotnet: ".NET",
	unity: "Unity",
	godot: "Godot",
	postgresql: "PostgreSQL",
	mongodb: "MongoDB",
	firebase: "Firebase",
	docker: "Docker",
	"google-cloud": "Google Cloud",
	auth0: "Auth0",
} as const;

export type TagSlug = keyof typeof TAG_LABELS;

export const TAG_SLUGS = Object.keys(TAG_LABELS) as [TagSlug, ...TagSlug[]];
