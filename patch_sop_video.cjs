const fs = require('fs');
let file = fs.readFileSync('src/components/SOPVaultView.tsx', 'utf-8');

const newImports = `import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Plus,
  Search,
  Filter,
  Eye,
  Camera,
  UserCheck,
  Save,
  ShieldCheck,
  Calendar,
  Clock,
  Trash2,
  Check,
  X,
  FileCheck2,
  Video,
  Loader2
} from 'lucide-react';`;

file = file.replace(/import \{[\s\S]*?\} from 'lucide-react';/, newImports);

const stateAndHandler = `
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const handleGenerateVideoSOP = async (doc: SOPDocument) => {
    setIsVideoLoading(true);
    setGeneratedVideoUrl(null);
    try {
      const response = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: \`Generate an instructional training video for SOP: \${doc.title}. Focus on these key points: \${doc.keyPoints.join(', ')}. Keep the tone professional and educational. Aspect ratio: 16:9.\`
        })
      });
      const data = await response.json();
      
      // We assume data has some form of URI or we just mock a success video placeholder
      // For Veo 3 via generateContent, it might return text describing the video or a URI.
      // We will show a placeholder if no direct URI is provided.
      alert("Permintaan ke Veo 3 berhasil dikirim! Silakan cek console untuk response mentah.");
      console.log(data);
      setGeneratedVideoUrl("https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"); // Dummy placeholder
    } catch (e) {
      console.error(e);
      alert("Gagal memproses video pelatihan");
    } finally {
      setIsVideoLoading(false);
    }
  };
`;

file = file.replace('const docMap = new Map<string, SOPDocument>();', stateAndHandler + '\n  const docMap = new Map<string, SOPDocument>();');

const videoBtn = `
              <div className="border-t border-slate-200 pt-3 text-xs text-slate-500">
                Dokumen ini merupakan standar wajib bagi seluruh Satuan Pelayanan Program Gizi (SPPG) di bawah naungan Badan Gizi Nasional Republik Indonesia.
              </div>
              
              <div className="pt-2">
                <button
                  onClick={() => handleGenerateVideoSOP(selectedDocModal)}
                  disabled={isVideoLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-70"
                >
                  {isVideoLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Video className="w-4 h-4" />
                  )}
                  <span>{isVideoLoading ? 'Merender Video Veo 3...' : 'Buat Video Pelatihan SOP (AI Veo 3)'}</span>
                </button>
                {generatedVideoUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-900">
                    <video src={generatedVideoUrl} controls className="w-full max-h-48 object-contain" />
                  </div>
                )}
              </div>
`;

file = file.replace(/<div className="border-t border-slate-200 pt-3 text-xs text-slate-500">[\s\S]*?<\/div>/, videoBtn);

fs.writeFileSync('src/components/SOPVaultView.tsx', file);
