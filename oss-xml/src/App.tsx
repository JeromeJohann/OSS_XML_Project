import { Button } from '@mui/material'
import './App.css'
import { useState } from 'react';

function App() {
  const [xmlDoc, setXmlDoc] = useState<Document | null>(null);

  async function handleFileChange (e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const parser: DOMParser = new DOMParser();
      setXmlDoc(parser.parseFromString(await e.target.files[0].text(),"text/xml"));
    }
  };

  const handleExport = () => {
    console.log(xmlDoc);
    const quizElement = xmlDoc?.getElementsByTagName('quiz')[0];
    console.log(quizElement);
    const questions = quizElement?.getElementsByTagName('question');
    console.log(questions);
    if (questions) {
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        console.log(question);
        const nameElement = question.getElementsByTagName('name')[0];
        if (nameElement) {
          const name = nameElement.textContent;
          console.log(name);
        }
      }
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleExport}>Export</Button>
      <div className="input-group">
      <label htmlFor="input">Import XML</label>
      <input id='input' type="file" onChange={handleFileChange} />
      {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" value={xmlDoc}/> */}
      </div>
      <p>Hello World</p>
    </>
  )
}

export default App
