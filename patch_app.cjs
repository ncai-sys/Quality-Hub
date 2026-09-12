const fs = require('fs');
let file = fs.readFileSync('src/App.tsx', 'utf-8');

if (!file.includes('SupervisorChatbot')) {
  file = file.replace(
    "import { StorageService } from './services/storageService';",
    "import { StorageService } from './services/storageService';\nimport { SupervisorChatbot } from './components/SupervisorChatbot';"
  );
  
  file = file.replace(
    "    </div>\n  );\n}\n",
    "      {/* Syafina Chatbot Widget */}\n      <SupervisorChatbot />\n    </div>\n  );\n}\n"
  );

  fs.writeFileSync('src/App.tsx', file);
}
