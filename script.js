const generateForm  = document.querySelector('.generate-form')
const imageGallery = document.querySelector('.image-gallery')
const OPENAI_API_KEY = "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"

let isImageGenerating = false


const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imageObject, index) => {
      const imgCard = imageGallery.querySelectorAll(".image-card")[index];
      const downloadBtn = imgCard.querySelector('.download-btn')
      if (imgCard) { 
        const imgElement = imgCard.querySelector("img");
        if (imgElement) { 
            const aiGeneratedImg = `data:image/jpeg;base64,${imageObject.b64_json}`;
            imgElement.src = aiGeneratedImg;
  
          imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute('href',aiGeneratedImg);
            downloadBtn.setAttribute('download',`${new Date().getTime()}.jpg`)
          };
        }
      }
    });
  };
  

const generateAiImages = async(userPrompt,userImgQuantity) =>{
    try{
        const response = await fetch("https://api.openai.com/v1/images/generations",{
            method: "POST",
            headers : {
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body : JSON.stringify({
                prompt : userPrompt,
                n :parseInt(userImgQuantity),
                size : "512x512",
                response_format : "b64_json"
             })
        });

        if(!response.ok) throw new Error("Failed to generate images! Please try Again.")
        const {data} = await response.json()
        updateImageCard([...data])
    }catch(error){
        alert(error.message)
    }finally{
        isImageGenerating = false
    }
}

handleFormSubmission = (response)=>{
    response.preventDefault();
    if(isImageGenerating)return
    isImageGenerating = true

    const userPrompt = response.srcElement[0].value
    const userImgQuantity = response.srcElement[1].value


    const imageCardMarkUp = Array.from({length:userImgQuantity},()=>
        `<div class="image-card loading" >
        <img src="ai-image-generator-website-images/images/loader.svg" alt="">
        <a href="#" class="download-btn">
            <img src="ai-image-generator-website-images/images/download.svg" alt="">
        </a>
    </div>`
    ).join("");

    imageGallery.innerHTML = imageCardMarkUp;

    generateAiImages(userPrompt,userImgQuantity)

}

generateForm.addEventListener("submit",handleFormSubmission)