import Navbar from "@/components/Navbar";
import OnboardingWizard from "@/components/auth/OnboardingWizard";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-brand-slate selection:bg-brand-yellow selection:text-brand-dark flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center p-4">
         <OnboardingWizard />
      </div>
      
      {/* Background Decor */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-yellow/5 blur-[100px] rounded-full pointer-events-none" />
    </main>
  );
}
