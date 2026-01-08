import { Code, Layout, Smartphone, Github } from "lucide-react";

export const projects = [
    {
        title: "AI Portfolio",
        description: "A futuristic 3D portfolio with AI integration.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100" />,
        icon: <Code className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "E-Commerce Platform",
        description: "Full-stack shopping experience with Stripe payments.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100" />,
        icon: <Layout className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Mobile Weather App",
        description: "Real-time weather tracking with location services.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100" />,
        icon: <Smartphone className="h-4 w-4 text-neutral-500" />,
    },
    {
        title: "Open Source Contrib",
        description: "Contributions to major React libraries.",
        header: <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100" />,
        icon: <Github className="h-4 w-4 text-neutral-500" />,
    },
];
