document.addEventListener("DOMContentLoaded", function() {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");

  const easyProgressCircle = document.querySelector(".easy-progress");

  const mediumProgressCircle = document.querySelector(".medium-progress"); 
  
  const hardProgressCircle = document.querySelector(".hard-progress");

  const easyLabel = document.getElementById("easy-label");
  
  const mediumLabel = document.getElementById("medium-label");

  const hardLabel = document.getElementById("hard-label");

  const cardStatsConatiner = document.querySelector(".stats-cards");


  // return true or false based on the regex
  function validateUsername(username){
    if (username.trim() === ""){
      alert("Username should not be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if(!isMatching){
      alert("Invalid Username");
    }
    return isMatching;
  }

  // api call
  async function fetchUserDetails(username) {

    try {
      searchButton.textContent = "Searching....";
      searchButton.disabled = true;
      searchButton.style.cssText = "background-color:grey; border-color:grey;  color:black";
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = 'https://leetcode.com/graphql/';
      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");
      const graphql = JSON.stringify({
        query: "query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}",
      variables: {"username": `${username}`}})
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: graphql,
      redirect: "follow"
    };

    const response = await fetch(proxyUrl+targetUrl, requestOptions);
      if(!response.ok) {
        throw new Error("Unable to fetch the User details");
      }
      const parsedData = await response.json();
      console.log("Logging data: ", parsedData);

      displayUserData(parsedData); 
    }
    catch(error){
      statsContainer.innerHTML = `<p>No Data Found!!!!</p>`
    }
    finally{
      searchButton.textContent = "Search";
      searchButton.disabled = false;
      searchButton.style.cssText = "  background-color: #ED127C;border-color: #ED127C;color: #12ed91;"
    }
  }

  // progress label and circle
  function updateProgess(solved, total, label, circle){
    const progressDegree = (solved/total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;

  }
  
  // progress data
  function displayUserData(parsedData){
    const totalQues = parsedData.data.allQuestionsCount[0].count;
    const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
    const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
    const totalHardQues = parsedData.data.allQuestionsCount[3].count;

    const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
    const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
    const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
    const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;

    updateProgess(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
    updateProgess(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
    updateProgess(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);
  }

  // search btn
  searchButton.addEventListener('click', function() {
    const username = usernameInput.value;
    console.log("logging username: ", username);
    if(validateUsername(username)) {
      fetchUserDetails(username);
    }

  })


})