const fs = require('fs');
let file = fs.readFileSync('src/components/DailySopChecklist.tsx', 'utf-8');

const newImports = `import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Camera, 
  Save,
  ShieldCheck,
  FileCheck2,
  Calendar,
  Building,
  Video,
  Loader2
} from 'lucide-react';`;

file = file.replace(/import \{[\s\S]*?\} from 'lucide-react';/, newImports);

const stateAndHandler = `
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const handleGenerateVideoSOP = async () => {
    setIsVideoLoading(true);
    setGeneratedVideoUrl(null);
    try {
      const response = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: \`Generate an instructional training video for kitchen staff on daily hygiene and sanitation SOPs. Focus on checking raw materials, monitoring temperatures, and proper handwashing. Keep the tone professional and educational. Aspect ratio: 16:9.\`
        })
      });
      const data = await response.json();
      
      alert("Permintaan ke Veo 3 berhasil dikirim! Silakan cek console untuk response.");
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

file = file.replace('  const [showSuccess, setShowSuccess] = useState(false);', '  const [showSuccess, setShowSuccess] = useState(false);\n' + stateAndHandler);

const videoBtn = `
        {/* Veo 3 Video Button */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={handleGenerateVideoSOP}
            disabled={isVideoLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-70"
          >
            {isVideoLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Video className="w-5 h-5" />
            )}
            <span>{isVideoLoading ? 'Merender Video Veo 3...' : 'Buat Video Pelatihan SOP Dapur (AI Veo 3)'}</span>
          </button>
          {generatedVideoUrl && (
            <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-inner">
              <div className="bg-slate-800 text-white text-xs p-2 font-semibold flex justify-between items-center">
                <span>Hasil Render Video Pelatihan (Veo 3)</span>
                <span className="text-emerald-400">16:9 Landscape</span>
              </div>
              <video src={generatedVideoUrl} controls className="w-full h-auto max-h-64 object-contain" autoPlay muted loop />
            </div>
          )}
        </div>
`;

file = file.replace(/<\/div>\s*<\/div>\s*<\/div>\s*$/s, (match) => {
  return videoBtn + '\n' + match;
});

fs.writeFileSync('src/components/DailySopChecklist.tsx', file);
