export {}
import { useState, useEffect } from "react"

function IndexPopup() {
  const [chatInput, setData] = useState("");
  const [chatResponse, setResponse] = useState("hi there!");
  const [currentTab, setCurrentTab] = useState("");
  const [wineData, setWineData] = useState({});
  const getData = async (url) => {
    try{
      console.log(`getting the data for ${url}`)
      const sanitizedTab = encodeURIComponent(url);
      const resp = await fetch(`https://tubechat-text.onrender.com/get-text/${sanitizedTab}`); // this should get the vidId and put the text in cloud storage via vidId/text.txt. this vidId will be the source in invoke function in tubechat-ai
      const json = await resp.json();
      // call ai server with vidId
      setWineData(json);
    }
    catch(error) {
      console.error("Error fetching data:", error);
    }
    
  }

  useEffect(
    () => {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        function (tabs) {
          const tab = tabs[0];
          if (tab.url) {
            getData(tab.url);
          }
        },
      )
      
    },
    [chrome],
  );
  
  console.log(wineData);
  return (
    <div
      style={{
        padding: 16
      }}>
      <h1>{currentTab}</h1>
      <h2>
        heeellooo Welcome to your
        <a href="https://www.plasmo.com" target="_blank">
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <input onChange={(e) => setData(e.target.value)} value={chatInput} />
      <button onClick={() => {
        // data is chat
        if(wineData.message !== "not valid youtube"){
          console.log("valid");
          fetch(`https://tubechat-ai.onrender.com/invoke/${wineData.video_id}/${chatInput}`)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            setResponse(data.chatResponse);
          })
          .catch(error => {
            console.error("Error sending data:", error);
          });
        }
        console.log("Hi");
        
      }}>send</button>
      <p>{chatResponse}</p>
    </div>
  )
}

export default IndexPopup
