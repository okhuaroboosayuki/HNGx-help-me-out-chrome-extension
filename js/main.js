document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.querySelector("#btn");
    const stopBtn = document.querySelector("#stopbtn")

    startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "get_recording"}, function(response){
                if(!chrome.runtime.lastError){
                    console.log(response);
                } else{
                    console.log(chrome.runtime.lastError);
                }
            })
        })
    })

    stopBtn.addEventListener("click", (e)=>{
        e.preventDefault();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "stop_recording"},  function(response){
                if(!chrome.runtime.lastError){
                    console.log(response)
                } else{
                    console.log(chrome.runtime.lastError)
                }
            })
        } )
    })
})