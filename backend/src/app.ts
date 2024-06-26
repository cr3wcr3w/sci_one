import express from 'express';
import multer from "multer"
import cors from 'cors'
import pdf from 'pdf-parse'
import fs from 'fs'
import { addResume } from './utils/supabase';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
const port = process.env.PORT;


const app = express();


app.use(cors());

// Middleware to parse json bodies
app.use(express.json());

// multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({ storage })

// keywords
const keywords = ['javascript', 'typescript', 'supabase', 'next.js', 'mantine', 'express.js', 'docker']
function findKeywords(text: string, keywords: string[]) {
  const foundKeywords = [] as string[] ;

  // Convert text to lowercase for case-insensitive search
  const lowerCaseText = text.toLowerCase();

  // Check each keyword
  keywords.forEach((keyword: string) => {
    const lowerCaseKeyword = keyword.toLowerCase();
    // Check if keyword is found in text
    if (lowerCaseText.includes(lowerCaseKeyword)) {
      foundKeywords.push(keyword);
    }
  });

  return foundKeywords;
}

app.post('/api/upload', upload.single('resume'), async(req, res) => {
  try {
    
    if (!req.file) {
      throw new Error('error');
    }

    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer)

    const foundKeywords = findKeywords(pdfData.text, keywords);

    // // store the filepath and keywords into supabase
    addResume({foundKeywords, filePath})


    res.send('Upload successful');
  } catch(error){
    console.error('Upload error:', error);
    res.status(500).send('Upload failed');
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
