export function getMockData() {



    const MOCK_SKILLS = [
        // Row 1
        { id: "javascript", name: "JavaScript", description: "yeeting code into the DOM since '95, no cap!" },
        { id: "typescript", name: "TypeScript", description: "JavaScript but with trust issues and fewer runtime errors." },
        { id: "html", name: "HTML5", description: "The skeleton of the web. Not a programming language, don't @ me." },
        { id: "css", name: "CSS3", description: "Making things pretty and centering divs since forever." },
        { id: "react", name: "React", description: "Components, hooks, virtual DOM. It's just JavaScript, right?" },
        { id: "vue", name: "Vue.js", description: "The progressive framework. Like React but with better separation of concerns." },

        // Row 2
        { id: "nextjs", name: "Next.js", description: "React on steroids. SSR, ISR, and all the acronyms you need." },
        { id: "tailwind", name: "Tailwind CSS", description: "Inline styles with extra steps (and we love it)." },
        { id: "node", name: "Node.js", description: "JavaScript on the server? Yes please. Async all the way." },
        { id: "express", name: "Express.js", description: "Minimalist web framework. Use it before you switch to NestJS." },
        { id: "database", name: "PostgreSQL", description: "The world's most advanced open source relational database." },
        { id: "mongodb", name: "MongoDB", description: "flexin' with that NoSQL drip, respectfully!" },

        // Row 3
        { id: "git", name: "Git", description: "Saving your code (and your sanity) one commit at a time." },
        { id: "github", name: "GitHub", description: "Where code lives, and where green squares give use dopamine." },
        { id: "prettier", name: "Prettier", description: "Because arguing about code formatting is a waste of time." },
        { id: "npm", name: "NPM", description: "Installing half the internet into your node_modules folder." },
        { id: "openai", name: "OpenAI API", description: "Making your apps smarter than you are (scary stuff)." },
        { id: "langchain", name: "LangChain", description: "Chaining LLMs like a boss. RAG to riches." },

        // Row 4
        { id: "linux", name: "Linux", description: "I use Arch, btw. (Just kidding, probably Ubuntu or Debian)." },
        { id: "docker", name: "Docker", description: "It works on my machine... and now on yours too." },
        { id: "nginx", name: "Nginx", description: "Reverse proxying like a pro. Load balancing for days." },
        { id: "aws", name: "AWS", description: "Amazon's way of taking all your money for cloud services." },
        { id: "tensorflow", name: "TensorFlow", description: "Machine learning for when you have too much data." },
        { id: "vercel", name: "Vercel", description: "Deploying sites faster than you can say 'serverless'." }
    ];

    return {
        MOCK_SKILLS
    };
}
