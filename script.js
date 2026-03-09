// sign in

const signInButton = document.getElementById("sign-in-button");
const loginPage = document.getElementById("login-page");
const mainPage = document.getElementById("main-page");

let currentTab = "All";
signInButton.addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const pass = document.getElementById("pass").value;

  if (username === "admin" && pass === "admin123") {
    loginPage.classList.add("hidden");
    mainPage.classList.remove("hidden");
  } else {
    alert("WRONG CREDENTIALS");
  }
});

// tab sorting

const tabs = document.querySelectorAll("#tabs button");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("bg-[#4A00FF]");
      t.classList.add("text-black");
    });

    tab.classList.remove("text-black");
    tab.classList.add("bg-[#4A00FF]", "text-white");
    showCurrentTab(tab);
  });
});

// tab switching
function showCurrentTab(tab) {
  tabs.forEach((t) => {
    t.setAttribute("status", "inactive");
  });
  tab.setAttribute("status", "active");
  currentTab = tab.innerText;
  loadIssues();
}

// load cards by the type

const loader = document.getElementById("loader");

const loadIssues = async () => {
  loader.classList.remove("hidden");

  try {
    const response = await fetch(
      "https://phi-lab-server.vercel.app/api/v1/lab/issues",
    );
    const json = await response.json();

    displayIssues(json.data);
  } catch (err) {
    console.error("Error fetching issues:", err);
  } finally {
    loader.classList.add("hidden");
  }
};

loadIssues();

const displayIssues = (issues) => {
  count = 0;
  // get the container
  const issueContainer = document.getElementById("issues");
  issueContainer.innerHTML = "";

  // get into every issues
  for (let issue of issues) {
    // console.log(currentTab, " ", issue.status);
    if (currentTab === "Open" && issue.status != "open") {
      continue;
    } else if (currentTab === "Closed" && issue.status != "closed") {
      continue;
    }

    count++;
    issueContainer.innerHTML += `
        <div
        class="issues flex flex-col w-[250px] border-t-[5px] ${
          issue.status === "open"
            ? "border-t-emerald-500"
            : "border-t-violet-500"
        }  border border-gray-200 rounded-xl shadow-sm bg-white overflow-hidden h-[320px]"
      >
        <div class="p-5 flex-1">
          <div class="flex justify-between items-start mb-4">
            <div class="shrink-0">
              <img
                class="w-8 h-8 rounded-full p-1 object-contain"
                src="./assets/${issue.status === "open" ? "open" : "closed"}.png"
                alt="Status"
              />
            </div>

            <span
              class="${getPriority(issue.priority)} text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide"
            >
              ${issue.priority}
            </span>
          </div>

          <h2 class="text-base font-bold text-slate-800 leading-tight mb-2">
            ${issue.title}
          </h2>

          <p class="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-3">
            ${issue.description}
          </p>

          <div class="flex flex-wrap gap-2">
            ${getLabels(issue.labels)}
          </div>
        </div>

        <div class="border-t border-gray-100 p-4 bg-slate-50/50">
          <p class="text-slate-500 text-xs font-medium">#${issue.id} by ${issue.author}</p>
          <p class="text-slate-400 text-[11px]">${issue.createdAt.split("T")[0]}</p>
        </div>
      </div>
        `;
  }
  document.getElementById("total-count").innerText = count;
  showIndividual(issues);
  search(issues);
};

function getPriority(x) {
  if (x === "high") return "bg-[#feecec] text-[#ef4444]";
  else if (x === "medium") return `bg-[#fff6d1] text-[#f59e0b]`;
  else return `bg-[#eeeff2] text-[#9ca3af]`;
}

function getLabelStyles(label) {
  //convert to lowercase to make sure it matches even if the data
  const type = label.toLowerCase();

  const styles = {
    bug: "bg-red-50 text-red-500 border-red-200",
    "help wanted": "bg-amber-50 text-amber-600 border-amber-200",
    enhancement: "bg-blue-50 text-blue-600 border-blue-200",
    "good first issue": "bg-emerald-50 text-emerald-600 border-emerald-200",
    documentation: "bg-slate-100 text-slate-600 border-slate-300",
  };
  return styles[type];
}

function getLabels(labels) {
  let allLabels = ``;
  labels.forEach((label) => {
    allLabels += `<span
              class="flex items-center gap-1.5 ${getLabelStyles(label)} text-[10px] font-semibold px-2.5 py-1 rounded-full"
            >${label}</span>`;
  });
  return allLabels;
}

// show individual issue

function showIndividual(issues) {
  let temp = document.querySelectorAll('#focused-issue>div');
  document.getElementById('issues').addEventListener('click', (event) => {
    const parent = event.target.parentElement.parentElement;
    
    for(let issue of issues){
      if(issue.title === parent.querySelector('h2').innerText){
        document.getElementById('focused-issue').innerHTML = `<div 
        class="flex items-center justify-center min-h-screen bg-gray-500 bg-opacity-80 p-6 fixed z-50 inset-0"
      >
        <div
          class="max-w-3xl w-full bg-white rounded-xl shadow-lg p-8 flex flex-col gap-5"
        >
          <div>
            <h1 class="text-3xl font-bold text-slate-900">
              ${issue.title}
            </h1>
            <div class="flex items-center gap-2 mt-2 text-slate-500 text-sm">
              <span
                class="${
                  issue.status === "open" ? "bg-emerald-500" : "bg-violet-500"
                } text-white px-3 py-1 rounded-full font-semibold flex items-center gap-1.5"
              >
                ${issue.status}
              </span>
              <span>•</span>
              <span>Opened by ${issue.author}</span>
              <span>•</span>
              <span>${issue.createdAt.split("T")[0]}</span>
            </div>
          </div>
 
          <div class="flex gap-2">
            ${getLabels(issue.labels)}
          </div>
 
          <p class="text-slate-600 leading-relaxed text-lg">
            ${issue.description}
          </p>
 
          <div
            class="flex flex-col sm:flex-row justify-between items-end gap-4 mt-2"
          >
            <div
              class="grid grid-cols-2 gap-8  p-5 rounded-xl flex-grow w-full sm:w-auto"
            >
              <div class="flex flex-col gap-1">
                <span class="text-slate-400 text-sm">Assignee:</span>
                <span class="font-bold text-slate-800">${issue.assignee === "" ? "none" : issue.assignee}</span>
              </div>
              <div class="flex flex-col gap-2">
                <span class="text-slate-400 text-sm">Priority:</span>
                <span
                  class="${getPriority(issue.priority)} text-white text-[10px] px-3 py-1 rounded-full font-bold w-fit uppercase"
                  >${issue.priority}</span
                >
              </div>
            </div>
 
            <button id="close-btn" onclick="closeIndividual()"
              class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>`
      }
    }
    document.getElementById('focused-issue').classList.remove('hidden');
  })
}

function closeIndividual() {
  document.getElementById("focused-issue").classList.add("hidden");
}







// search 


const searchValue = document.getElementById('search');


function search(issues){
  searchValue.addEventListener('input', (event) => {
    const lookingFor = event.target.value;

})
}
