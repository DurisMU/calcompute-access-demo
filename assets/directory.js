(function () {
  "use strict";

  var listEl = document.getElementById("programList");
  var countEl = document.getElementById("dirCount");
  var emptyEl = document.getElementById("dirEmpty");
  var searchEl = document.getElementById("dirSearch");
  var activeEl = document.getElementById("dirActive");
  var state = { serves: "", offers: "", region: "", q: "" };
  var programs = [];
  var searchTimer = null;

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escAttr(value) {
    return esc(value).replace(/`/g, "&#96;");
  }

  function readParams() {
    var parts = [];
    if (window.location.search) parts.push(window.location.search.slice(1));
    if (window.location.hash) parts.push(window.location.hash.slice(1));
    var params = new URLSearchParams(parts.join("&"));
    state.serves = params.get("serves") || "";
    state.offers = params.get("offers") || "";
    state.region = params.get("region") || "";
    state.q = params.get("q") || "";
    if (searchEl) searchEl.value = state.q;
  }

  function writeParams() {
    var params = new URLSearchParams();
    if (state.serves) params.set("serves", state.serves);
    if (state.offers) params.set("offers", state.offers);
    if (state.region) params.set("region", state.region);
    if (state.q) params.set("q", state.q);
    var next = params.toString();
    var url = window.location.pathname + (next ? "#" + next : "");
    try {
      window.history.replaceState(null, "", url);
    } catch (e) {
      /* ignore */
    }
  }

  function syncPills() {
    document.querySelectorAll(".dir-pills").forEach(function (group) {
      var key = group.getAttribute("data-group");
      group.querySelectorAll(".pill").forEach(function (btn) {
        var value = btn.getAttribute("data-value") || "";
        btn.classList.toggle("active", value === state[key]);
      });
    });
  }

  function matches(program) {
    if (state.serves && program.serves.indexOf(state.serves) === -1) return false;
    if (state.offers && program.offers.indexOf(state.offers) === -1) return false;
    if (state.region && program.regions.indexOf(state.region) === -1) return false;
    if (state.q) {
      var haystack = (
        (program.name || "") + " " +
        (program.meta || "") + " " +
        (program.who || "") + " " +
        (program.what || "") + " " +
        (program.cost || "") + " " +
        (program.how || "") + " " +
        (program.text || "")
      ).toLowerCase();
      if (haystack.indexOf(state.q.toLowerCase()) === -1) return false;
    }
    return true;
  }

  function cardHTML(p) {
    var title = esc(p.name);
    if (p.link) {
      title = '<a href="' + escAttr(p.link) + '" target="_blank" rel="noopener">' +
        esc(p.name) + '<span class="arrow" aria-hidden="true">↗</span>' +
        '<span class="visually-hidden"> (opens its website)</span></a>';
    }

    var facts = [
      ["Who can use it", p.who],
      ["What you get", p.what],
      ["Cost", p.cost],
      ["How to get access", p.how],
    ].filter(function (item) { return item[1]; });

    var factsHTML = facts.map(function (item) {
      return '<div class="program-fact"><dt>' + esc(item[0]) + '</dt><dd>' + esc(item[1]) + '</dd></div>';
    }).join("");

    var sources = (p.sources || []).filter(function (s) { return s && s.url; });
    var sourcesHTML = "";
    if (sources.length) {
      sourcesHTML = '<details class="program-sources"><summary>Links and sources (' + sources.length + ')</summary><ul>' +
        sources.map(function (s) {
          return '<li><a href="' + escAttr(s.url) + '" target="_blank" rel="noopener">' + esc(s.title || s.url) + '</a></li>';
        }).join("") +
        '</ul></details>';
    }

    return '<article class="program-card">' +
      '<h3 class="program-name">' + title + '</h3>' +
      '<p class="program-meta">' + esc(p.meta || "") + '</p>' +
      '<dl class="program-facts">' + factsHTML + '</dl>' +
      sourcesHTML +
      '</article>';
  }

  function activeLabel(key) {
    var labels = {
      serves: "I am",
      offers: "I need",
      region: "Where",
      q: "Search",
    };
    return labels[key] || key;
  }

  function render() {
    var filtered = programs.filter(matches);
    if (countEl) {
      countEl.textContent = filtered.length + (filtered.length === 1 ? " program" : " programs");
    }
    if (listEl) {
      listEl.innerHTML = filtered.map(cardHTML).join("");
    }
    if (emptyEl) emptyEl.hidden = filtered.length !== 0;

    var active = [];
    ["serves", "offers", "region", "q"].forEach(function (key) {
      if (state[key]) active.push(activeLabel(key) + ": " + state[key]);
    });
    if (activeEl) {
      if (active.length) {
        activeEl.hidden = false;
        activeEl.innerHTML = active.map(esc).join(" · ") + ' <button type="button" class="pill" id="clearFilters" style="margin-left:8px;">Clear all</button>';
        var clear = document.getElementById("clearFilters");
        if (clear) {
          clear.addEventListener("click", function () {
            state = { serves: "", offers: "", region: "", q: "" };
            if (searchEl) searchEl.value = "";
            syncPills();
            writeParams();
            render();
          });
        }
      } else {
        activeEl.hidden = true;
        activeEl.innerHTML = "";
      }
    }
  }

  function bindPills() {
    document.querySelectorAll(".dir-pills").forEach(function (group) {
      var key = group.getAttribute("data-group");
      group.addEventListener("click", function (event) {
        var btn = event.target.closest(".pill");
        if (!btn) return;
        state[key] = btn.getAttribute("data-value") || "";
        syncPills();
        writeParams();
        render();
      });
    });
  }

  if (searchEl) {
    searchEl.addEventListener("input", function () {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(function () {
        state.q = searchEl.value.trim();
        writeParams();
        render();
      }, 160);
    });
  }

  readParams();
  syncPills();
  bindPills();

  fetch("data/calcompute_directory.json")
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(function (data) {
      programs = Array.isArray(data) ? data : [];
      render();
    })
    .catch(function () {
      if (countEl) countEl.textContent = "Directory data could not load";
      if (listEl) listEl.innerHTML = '<div class="dir-empty"><strong>The directory data could not load.</strong><p>Open this page through a local server or GitHub Pages.</p></div>';
    });
})();
