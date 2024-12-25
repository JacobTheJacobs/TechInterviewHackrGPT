# TechInterviewGPT 🎙️💡

A real-time technical interview assistant powered by Groq's Whisper and LLM APIs. Simply hold the spacebar, ask your technical question, and get instant, concise answers with code examples.

## Features ✨

- **Voice-to-Text**: Uses Groq's Whisper-large-v3 model for accurate speech recognition
- **Real-time Responses**: Powered by Groq's Mixtral-8x7b model
- **Push-to-Talk**: Simple spacebar interface for voice input
- **Code Highlighting**: Automatic syntax highlighting for code examples
- **Visual Feedback**: Real-time audio visualization and recording status
- **Keyword Highlighting**: Important technical terms are automatically highlighted

## Tech Stack 🛠️

- **Frontend**: HTML5, JavaScript (Vanilla), Web Audio API
- **Backend**: Node.js, Express
- **APIs**: 
  - Groq Whisper API for speech-to-text
  - Groq Chat API for responses
- **Audio**: Web Audio API for recording and visualization
## Installation 🚀

1. Clone the repository:
```bash
git clone https://github.com/yourusername/TechInterviewGPT.git
cd TechInterviewGPT
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your Groq API key to `.env`:
```
GROQ_API_KEY=your_groq_api_key_here
```

5. Start the server:
```bash
npm start
```

6. Open `http://localhost:3000` in your browser

## Usage 💻

1. Allow microphone access when prompted
2. Hold the spacebar to record your question
3. Release the spacebar to get your answer
4. The answer will include:
   - Concise explanation with highlighted key terms
   - Code examples when relevant
   - Practical implementation tips

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📝

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments 🙏

- Groq for their amazing APIs
- The open-source community for inspiration and tools
