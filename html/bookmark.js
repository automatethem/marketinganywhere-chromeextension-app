let linkList = [];

// Function to dynamically create buttons for each link
const createLinks = (links) => {
  const linkList = document.querySelector("#link-list");
  while (linkList.firstChild) {
    linkList.removeChild(linkList.firstChild);
  }
  links.forEach((link, index) => {
    const aTag = document.createElement("a");
    aTag.innerHTML = link.name; // Set the button name to link's name
    //aTag.setAttribute("href", "#");
    aTag.style.cssText = `
          margin: 2px;
          color: blue;                /* 파란색 글자 */
          text-decoration: underline; /* 기본적으로 언더라인 표시 */
          cursor: pointer;            /* 호버 시 손 모양 커서 */
        `;

    aTag.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "openLinkTab", url: link.url });
    });
    linkList.appendChild(aTag); // Add button to the container

    // Add '|' between links except the last one
    if (index < links.length - 1) {
      linkList.append(" | ");
    }
  });
};

const fetchLinks = async () => {
  let { userId } = await chrome.storage.local.get(["userId"]);
  userId = userId ? userId : "";
  if (userId) {
    // Select the element
    const linkSection = document.getElementById('bookmark-section');
    // Method 1: Show by updating the style
    linkSection.style.display = 'block';

    let languageCode = chrome.i18n.getUILanguage();
    //console.log(languageCode); //en //ko //en-US 
    if (languageCode.includes("-")) {
      languageCode = languageCode.split("-")[0]
    }
    const url = `https://www.marketinganywhere.ai/api/link?userId=${userId}&languageCode=${languageCode}`;
    try {
      const response = await fetch(url);
      linkList = await response.json(); // Get the list of links
      createLinks(linkList); // Dynamically create buttons based on the linkList
    } catch (error) {
      console.error(error);
    }
  } else {
    const linkList = document.querySelector("#link-list");
    while (linkList.firstChild) {
      linkList.removeChild(linkList.firstChild);
    }

    const linkSection = document.getElementById('bookmark-section');
    linkSection.style.display = 'none';
  }
};

(async () => {
  // Initialize the fetch and render process
  await fetchLinks();
})();
