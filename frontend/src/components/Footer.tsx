import { ShieldCheck, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8 font-sans mt-auto">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-600/20">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">ShramShield</span>
            </a>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
              AI-driven parametric income protection for the modern gig economy workforce.
            </p>
            <div className="flex gap-4">
              <a target="_blank" rel="noopener noreferrer" href="https://twitter.com" className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Twitter className="w-4 h-4" /></a>
              <a target="_blank" rel="noopener noreferrer" href="https://linkedin.com" className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Linkedin className="w-4 h-4" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-6 tracking-wide">Product</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><a href="/pricing" className="hover:text-blue-600 transition-colors">Pricing Options</a></li>
              <li><a href="/how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a></li>
              <li><a href="/#platforms" className="hover:text-blue-600 transition-colors">Coverage Profiles</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 tracking-wide">Support</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
               <li><a href="/support" className="hover:text-blue-600 transition-colors">Help Center</a></li>
               <li><a href="/portal" className="hover:text-blue-600 transition-colors">API Documentation</a></li>
               <li><a href="/dashboard" className="hover:text-blue-600 transition-colors">System Status</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm font-medium">© {new Date().getFullYear()} ShramShield Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
             <a href="/?ref=terms" className="hover:text-slate-600">Terms of Service</a>
             <a href="/?ref=privacy" className="hover:text-slate-600">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
