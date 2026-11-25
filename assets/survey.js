(function () {
  const questions = [
    {
      id: "q1", dim: "resource",
      title: "How limited is your access to computing resources?",
      anchors: ["Not limited", "Slightly", "Somewhat", "Moderately", "Very", "Severely"],
    },
    {
      id: "q2", dim: "resource",
      title: "How difficult is it to afford the computing resources you need?",
      anchors: ["Not difficult", "Slightly", "Somewhat", "Moderately", "Very", "Impossible"],
    },
    {
      id: "q3", dim: "resource",
      title: "How insufficient are your current computing resources for your project?",
      anchors: ["Fully sufficient", "Mostly", "Somewhat", "Mixed", "Insufficient", "Completely"],
    },
    {
      id: "q4", dim: "support",
      title: "How much support do you need to use AI computing resources?",
      anchors: ["None", "A little", "Some", "Moderate", "A lot", "Extensive"],
    },
    {
      id: "q5", dim: "support",
      title: "How limited is the technical support available to you?",
      anchors: ["Not limited", "Slightly", "Somewhat", "Moderately", "Very", "Very limited"],
    },
    {
      id: "q6", dim: "support",
      title: "How much additional training or technical support would you need to use CalCompute?",
      anchors: ["None", "A little", "Some", "Moderate", "A lot", "Extensive"],
    },
    {
      id: "q7", dim: "info",
      title: "How unclear is it which computing resources are available to you?",
      anchors: ["Very clear", "Clear", "Somewhat", "Mixed", "Unclear", "Very unclear"],
    },
    {
      id: "q8", dim: "info",
      title: "How unclear is it which computing resources you qualify for?",
      anchors: ["Very clear", "Clear", "Somewhat", "Mixed", "Unclear", "Very unclear"],
    },
    {
      id: "q9", dim: "info",
      title: "How limited is your access to guidance on how to apply for computing resources?",
      anchors: ["Not limited", "Slightly", "Somewhat", "Moderately", "Very", "Very limited"],
    },
    {
      id: "q10", dim: "benefit",
      title: "To what extent does your project address a public need or societal challenge?",
      anchors: ["Not at all", "Slightly", "Somewhat", "Moderately", "Substantially", "A great deal"],
    },
    {
      id: "q11", dim: "benefit",
      title: "How many people do you believe would benefit from your project?",
      anchors: ["None", "Very few", "Few", "Some", "Many", "Very many"],
    },
    {
      id: "q12", dim: "benefit",
      title: "How immediate do you think the impact of your project will be?",
      anchors: ["Not immediate", "Slightly", "Somewhat", "Moderately", "Substantially", "Very immediate"],
    },
  ];

  const bands = {
    priority: {
      label: "Priority review",
      className: "band-priority",
      title: "Your profile suggests a strong case for priority review.",
      sub: "High need, high public benefit. A human reviewer would look at the project and support needs before any allocation.",
      next: "<strong>What happens next:</strong> A human reviewer would look at your project, public benefit, and support needs. This prototype does not grant access or make a final decision.",
    },
    support: {
      label: "Eligible with support",
      className: "band-support",
      title: "Your profile suggests eligibility, with support.",
      sub: "Your need is meaningful, but training, technical help, or more information may be needed before compute allocation.",
      next: "<strong>What happens next:</strong> You would be routed to a supported onboarding track: training, office hours, and technical help before a compute allocation.",
    },
    signpost: {
      label: "Signpost",
      className: "band-signpost",
      title: "This profile is not a priority for a small public compute pilot.",
      sub: "Other resources may fit better right now. The result is a signpost, not a judgment about your project.",
      next: "<strong>What happens next:</strong> We would signpost you to other programs: NAIRR, campus clusters, cloud credits, or digital-inclusion support.",
    },
  };

  const form = document.getElementById("surveyForm");
  const intro = document.getElementById("introCard");
  const result = document.getElementById("resultCard");
  const startBtn = document.getElementById("startBtn");
  const submitBtn = document.getElementById("submitBtn");
  const errorBox = document.getElementById("formError");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const matrixSvg = document.getElementById("matrix");
  const downloadBtn = document.getElementById("downloadBtn");
  const retakeBtn = document.getElementById("retakeBtn");

  let lastPayload = null;

  function renderQuestions() {
    const containers = {
      resource: document.getElementById("questions-resource"),
      support: document.getElementById("questions-support"),
      info: document.getElementById("questions-info"),
      benefit: document.getElementById("questions-benefit"),
    };

    questions.forEach(function (q) {
      const wrap = document.createElement("div");
      wrap.className = "question";
      wrap.dataset.qid = q.id;

      const title = document.createElement("p");
      title.className = "q-title";
      title.textContent = q.title;
      wrap.appendChild(title);

      const likert = document.createElement("div");
      likert.className = "likert";
      likert.setAttribute("role", "radiogroup");
      likert.setAttribute("aria-label", q.title);

      q.anchors.forEach(function (anchor, value) {
        const input = document.createElement("input");
        input.type = "radio";
        input.name = q.id;
        input.id = q.id + "_" + value;
        input.value = String(value);

        const label = document.createElement("label");
        label.setAttribute("for", input.id);

        const num = document.createElement("span");
        num.className = "num";
        num.textContent = String(value);

        const lbl = document.createElement("span");
        lbl.className = "lbl";
        lbl.textContent = anchor;

        label.appendChild(num);
        label.appendChild(lbl);
        likert.appendChild(input);
        likert.appendChild(label);
      });

      wrap.appendChild(likert);
      containers[q.dim].appendChild(wrap);
    });
  }

  function answeredCount() {
    return questions.filter(function (q) {
      return form.querySelector('input[name="' + q.id + '"]:checked');
    }).length;
  }

  function updateProgress() {
    const n = answeredCount();
    progressText.textContent = n + " of 12";
    progressFill.style.width = ((n / 12) * 100).toFixed(1) + "%";
  }

  function valueOf(id) {
    const checked = form.querySelector('input[name="' + id + '"]:checked');
    return checked ? Number(checked.value) : null;
  }

  function sum(ids) {
    return ids.reduce(function (acc, id) {
      return acc + (valueOf(id) || 0);
    }, 0);
  }

  function showResult() {
    const access = sum(["q1", "q2", "q3"]);
    const support = sum(["q4", "q5", "q6"]);
    const info = sum(["q7", "q8", "q9"]);
    const benefit = sum(["q10", "q11", "q12"]);
    const need = access + info;
    const priority = need + benefit;

    let band = "signpost";
    if (priority >= 32) band = "priority";
    else if (priority >= 18) band = "support";

    const meta = bands[band];

    document.getElementById("resultBand").textContent = meta.label;
    document.getElementById("resultBand").className = "result-band " + meta.className;
    document.getElementById("resultTitle").textContent = meta.title;
    document.getElementById("resultSub").textContent = meta.sub;

    document.getElementById("scoreAccess").textContent = access;
    document.getElementById("scoreInfo").textContent = info;
    document.getElementById("scoreSupport").textContent = support;
    document.getElementById("scoreBenefit").textContent = benefit;

    document.getElementById("barAccess").style.width = (access / 15) * 100 + "%";
    document.getElementById("barInfo").style.width = (info / 15) * 100 + "%";
    document.getElementById("barSupport").style.width = (support / 15) * 100 + "%";
    document.getElementById("barBenefit").style.width = (benefit / 15) * 100 + "%";
    document.getElementById("barAccessVal").textContent = access + "/15";
    document.getElementById("barInfoVal").textContent = info + "/15";
    document.getElementById("barSupportVal").textContent = support + "/15";
    document.getElementById("barBenefitVal").textContent = benefit + "/15";

    let next = meta.next;
    if (support >= 9) {
      next += "<br><br><strong>Support flag:</strong> Your answers suggest you may need additional training or technical support. That is an onboarding need, not a disqualification.";
    }
    document.getElementById("nextBox").innerHTML = next;

    window.renderAccessMatrix(matrixSvg, {
      need: need,
      benefit: benefit,
      support: support,
      band: band,
    });

    lastPayload = {
      timestamp: new Date().toISOString(),
      scores: {
        resourceAccess: access,
        information: info,
        support: support,
        publicBenefit: benefit,
        need: need,
        priority: priority,
      },
      band: band,
      context: {
        role: document.getElementById("role").value,
        orgType: document.getElementById("orgType").value,
        region: document.getElementById("region").value,
        stage: document.getElementById("stage").value,
        lookingFor: document.getElementById("lookingFor").value,
      },
      answers: questions.reduce(function (acc, q) {
        acc[q.id] = valueOf(q.id);
        return acc;
      }, {}),
    };

    form.style.display = "none";
    result.classList.add("show");
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function reset() {
    form.reset();
    form.querySelectorAll("input[type=radio]").forEach(function (input) {
      input.checked = false;
    });
    updateProgress();
    errorBox.classList.remove("show");
    result.classList.remove("show");
    form.style.display = "none";
    intro.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  startBtn && startBtn.addEventListener("click", function () {
    intro.style.display = "none";
    form.style.display = "block";
    form.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.addEventListener("change", function (event) {
    if (event.target && event.target.type === "radio") {
      updateProgress();
      errorBox.classList.remove("show");
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const missing = questions.filter(function (q) {
      return !form.querySelector('input[name="' + q.id + '"]:checked');
    });

    if (missing.length > 0) {
      errorBox.classList.add("show");
      const first = form.querySelector('[data-qid="' + missing[0].id + '"]');
      if (first) first.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    errorBox.classList.remove("show");
    showResult();
  });

  downloadBtn && downloadBtn.addEventListener("click", function () {
    if (!lastPayload) return;
    const blob = new Blob([JSON.stringify(lastPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calcompute-access-result.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  retakeBtn && retakeBtn.addEventListener("click", reset);

  renderQuestions();
  updateProgress();

  // Demo helpers for screenshots / Miro.
  const params = new URLSearchParams(window.location.search);
  if (params.get("start") === "1") {
    intro.style.display = "none";
    form.style.display = "block";
  }
  if (params.get("demo") === "result") {
    intro.style.display = "none";
    form.style.display = "block";
    const demo = { q1: 4, q2: 4, q3: 4, q4: 4, q5: 3, q6: 3, q7: 4, q8: 3, q9: 3, q10: 4, q11: 4, q12: 4 };
    Object.keys(demo).forEach(function (id) {
      const input = document.getElementById(id + "_" + demo[id]);
      if (input) input.checked = true;
    });
    document.getElementById("role").value = "Community college instructor";
    document.getElementById("orgType").value = "Community college";
    document.getElementById("region").value = "Bay Area";
    document.getElementById("stage").value = "Pilot";
    document.getElementById("lookingFor").value = "GPU hours for a classroom module and student projects.";
    updateProgress();
    showResult();
    result.style.animation = "none";
    result.style.opacity = "1";
    window.scrollTo(0, 0);
  }
})();
