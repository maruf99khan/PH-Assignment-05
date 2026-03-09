// sign in

const signInButton = document.getElementById("sign-in-button");
const loginPage = document.getElementById("login-page");
const mainPage = document.getElementById("main-page");

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
  });
});

// load cards

const loadIssues = () => {
    let allData = {};
  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then((res) => res.json())
    .then((json) => {
        displayIssues(json.data);
        allData = json.data;
    });

    console.log(allData)
};

const displayIssues = (issues) => {
  // get the container
  const issueContainer = document.getElementById("issues");
  issueContainer.innerHTML = "";
  // get into every issues
  for (let issue of issues) {
    // create element
    const newCard = document.createElement("div");
    newCard.innerHTML = `
        <div
        class="flex flex-col w-[250px] border-t-[5px] ${
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
          <p class="text-slate-500 text-xs font-medium">#1 by john_doe</p>
          <p class="text-slate-400 text-[11px]">1/15/2024</p>
        </div>
      </div>
        `;

    // add to the parent
    issueContainer.append(newCard);
  }
};

loadIssues();




function getPriority(x){
    if(x === "high")
        return "bg-[#feecec] text-[#ef4444]";
    else if(x === 'medium')
        return `bg-[#fff6d1] text-[#f59e0b]`;
    else return `bg-[#eeeff2] text-[#9ca3af]`;
}



function getLabelStyles(label) {
    //convert to lowercase to make sure it matches even if the data 
    const type = label.toLowerCase();

    const styles = {
        "bug": "bg-red-50 text-red-500 border-red-200",
        "help wanted": "bg-amber-50 text-amber-600 border-amber-200",
        "enhancement": "bg-blue-50 text-blue-600 border-blue-200",
        "good first issue": "bg-emerald-50 text-emerald-600 border-emerald-200",
        "documentation": "bg-slate-100 text-slate-600 border-slate-300"
    };
    return styles[type];
}

function getLabels(labels){
    let allLabels = ``;
    labels.forEach(label => {
        allLabels += `<span
              class="flex items-center gap-1.5 ${getLabelStyles(label)} text-[10px] font-semibold px-2.5 py-1 rounded-full"
            >${label}</span>`
    })
    return allLabels;
}