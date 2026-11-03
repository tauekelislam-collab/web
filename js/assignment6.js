"use strict";
$(document).ready(function () {
  console.log("jQuery is ready!");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let toastTimer;
  function notify(message) {
    clearTimeout(toastTimer);
    $("#store-toast").stop(true, true).prop("hidden", false).text(message).show();
    toastTimer = setTimeout(function () {
      $("#store-toast").fadeOut(reducedMotion ? 0 : 300);
    }, 3000);
  }

  // Tasks 1–3: the existing catalog filter uses jQuery; suggestions use the same cards.
  const search = $("#sneaker-search");
  if (search.length) {
    const titles = $("#catalog-products h2");
    const names = titles.map(function () { return $(this).text().trim(); }).get();
    const suggestions = $('<div id="search-suggestions" aria-label="Search suggestions" hidden></div>');
    search.after(suggestions).attr({ autocomplete: "off", "aria-controls": "search-suggestions", "aria-expanded": "false" });
    function closeSuggestions() {
      suggestions.prop("hidden", true);
      search.attr("aria-expanded", "false");
    }
    function highlight() {
      const query = search.val().trim();
      titles.each(function (index) {
        // Build text nodes and marks instead of interpreting the search as HTML/regex.
        const title = $(this).empty();
        const name = names[index];
        let start = 0;
        let match = query ? name.toLowerCase().indexOf(query.toLowerCase()) : -1;
        while (match !== -1) {
          title.append(document.createTextNode(name.slice(start, match)));
          title.append($("<mark>").text(name.slice(match, match + query.length)));
          start = match + query.length;
          match = name.toLowerCase().indexOf(query.toLowerCase(), start);
        }
        title.append(document.createTextNode(name.slice(start)));
      });
    }
    search.on("input focus", function () {
      const query = search.val().trim().toLowerCase();
      suggestions.empty();
      if (query) {
        names.filter(name => name.toLowerCase().includes(query)).forEach(function (name) {
          $("<button>", { type: "button", text: name }).on("click", function () {
            search.val(name).trigger("input");
            search.trigger("focus");
            closeSuggestions();
          }).appendTo(suggestions);
        });
      }
      const open = suggestions.children().length > 0;
      suggestions.prop("hidden", !open);
      search.attr("aria-expanded", String(open));
      highlight();
    });
    search.on("keydown", function (event) {
      if (event.key === "ArrowDown" && !suggestions.prop("hidden")) {
        event.preventDefault(); suggestions.find("button").first().trigger("focus");
      }
      if (event.key === "Escape") closeSuggestions();
    });
    suggestions.on("keydown", "button", function (event) {
      if (event.key === "Escape") { search.trigger("focus"); closeSuggestions(); }
      if (event.key === "ArrowDown") { event.preventDefault(); $(this).next().trigger("focus"); }
      if (event.key === "ArrowUp") { event.preventDefault(); $(this).prev().trigger("focus"); }
    });
    $(document).on("click", function (event) {
      if (!$(event.target).closest("#search-suggestions, #sneaker-search").length) closeSuggestions();
    });
    $("#catalog-filters").on("reset", function () { closeSuggestions(); highlight(); });
  }

  // Task 6: only called after the multi-step form's existing validation succeeds.
  window.submitDemo = function (form, button, complete) {
    if ($(form).attr("aria-busy") === "true") return;
    const controls = $(form).find("input, select, textarea, button").filter(":enabled");
    const label = $(button).html();
    $(form).attr("aria-busy", "true");
    controls.prop("disabled", true);
    $(button).empty().append('<span class="submit-spinner" aria-hidden="true"></span>', document.createTextNode(" Please wait…"));
    setTimeout(function () {
      controls.prop("disabled", false);
      $(button).html(label);
      $(form).attr("aria-busy", "false");
      complete();
      notify("Demo request checked successfully. No order was sent.");
    }, 1200);
  };

  // Task 8: clipboard failures never produce a false success indication.
  let copyTimer;
  $("#copy-catalog").on("click", async function () {
    const button = $(this);
    try {
      await navigator.clipboard.writeText($("#catalog-link").text());
      clearTimeout(copyTimer);
      button.find(".copy-icon").text("✓");
      button.attr("title", "Copied to clipboard!");
      $("#copy-feedback").text("Copied to clipboard!");
      notify("Catalog link copied to clipboard!");
      copyTimer = setTimeout(function () {
        button.find(".copy-icon").text("⧉");
        button.removeAttr("title");
        $("#copy-feedback").text("");
      }, 3000);
    } catch (error) {
      $("#copy-feedback").text("Copy unavailable. Select and copy the link above manually.");
    }
  });

  // Tasks 4, 5 and 9: one scroll handler updates progress, counters and lazy images.
  function updateViewport() {
    const top = $(window).scrollTop();
    const bottom = top + $(window).height();
    const distance = $(document).height() - $(window).height();
    const progress = distance > 0 ? Math.min(100, top / distance * 100) : 100;
    $("#scroll-progress").css("width", progress + "%").attr("aria-valuenow", Math.round(progress));
    $(".number-counter").each(function () {
      const counter = $(this);
      if (counter.data("started") || counter.offset().top >= bottom) return;
      counter.data("started", true);
      const target = Number(counter.attr("data-target"));
      $({ value: 0 }).animate({ value: target }, {
        duration: reducedMotion ? 0 : 1400,
        step: function (value) { counter.text(Math.floor(value)); },
        complete: function () { counter.text(target); }
      });
    });
    $("img[data-src]").each(function () {
      const img = $(this);
      if (img.offset().top < bottom && img.offset().top + img.height() >= top) {
        img.attr("src", img.attr("data-src")).removeAttr("data-src");
      }
    });
  }
  $(window).on("scroll resize load", updateViewport);
  updateViewport();
});
