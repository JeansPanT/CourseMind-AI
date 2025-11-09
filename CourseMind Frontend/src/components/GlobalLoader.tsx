import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";

export default function GlobalLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000); // 👈 simulate brief delay (optional)
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-slate-900 z-[9999] transition-all duration-500">
        <DotLoader color="#0ea5e9" size={80} />
        <p className="mt-6 text-slate-600 dark:text-slate-300 text-lg font-semibold animate-pulse">
          Loading CourseMind AI...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
