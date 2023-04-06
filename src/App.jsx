import { useState, useEffect } from 'react';

function App() {
  const [ message, setMessage ] = useState("");
  const [ value, setValue ] = useState("");
  const [ previousChats, setPreviousChats ] = useState([])
  const [ currentTitle, setCurrentTitle ] = useState(null)

  const getMessage = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify ({
        message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try{
      const response = await fetch('http://localhost:8000/completions', options);
      const data = await response.json();
      setMessage(data.choices[0].message)
    } catch (e){
      console.error(e);
    }
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
    setMessage(null);
    setValue("");
  }

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  }

  useEffect(() => {
    if(!currentTitle && value && message)
      setCurrentTitle(value);

    if(currentTitle && value && message){
      setPreviousChats(prevChats => (
        [...prevChats, 
          {
            title: currentTitle,
            role: "User",
            content: value
          },
          {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }
    
  }, [message, currentTitle])

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

  return(
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => 
            <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>
          )}
        </ul>
        <nav>
          <p>Made by Leandro</p>
        </nav>
      </section>
      <section className="chat">
        {!currentTitle && <h1>LeandroGPT</h1>}
        <ul className="feed"> 
          {currentChat?.map((chatMessage, index) => <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <div className="input-space">
              <input value={value} onChange={e => setValue(e.target.value)} />
            </div>
            <div id="submit" onClick={getMessage}>➢</div>
          </div>
          <p className="info">
            Chat GPT mar 14 version. Free Research Preview
            Our goal is to make AI systems more natural and safe to interact with
            Your feedback will help us improve
          </p>
        </div>
      </section>
    </div>
  )
}

export default App
