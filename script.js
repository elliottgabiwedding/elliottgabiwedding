      // NAV scroll
      const nav = document.getElementById("mainNav");
      window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 60);
      });

      // Hamburger
      document.getElementById("hamburger").addEventListener("click", () => {
        document.getElementById("mobileMenu").classList.add("open");
      });
      document.getElementById("mobileClose").addEventListener("click", () => {
        document.getElementById("mobileMenu").classList.remove("open");
      });
      document.querySelectorAll(".mob-link").forEach((a) => {
        a.addEventListener("click", () => {
          document.getElementById("mobileMenu").classList.remove("open");
        });
      });

      // Countdown
      function updateCountdown() {
        const target = new Date("2026-10-03T12:00:00");
        const now = new Date();
        const diff = target - now;
        if (diff <= 0) {
          document.getElementById("cd-days").textContent = "000";
          return;
        }
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        document.getElementById("cd-days").textContent = String(days).padStart(
          3,
          "0",
        );
        document.getElementById("cd-hours").textContent = String(
          hours,
        ).padStart(2, "0");
        document.getElementById("cd-mins").textContent = String(mins).padStart(
          2,
          "0",
        );
        document.getElementById("cd-secs").textContent = String(secs).padStart(
          2,
          "0",
        );
      }
      updateCountdown();
      setInterval(updateCountdown, 1000);


      // Lightbox
      function openLightbox(src) {
        document.getElementById("lb-img").src = src;
        document.getElementById("lightbox").classList.add("open");
        document.body.style.overflow = "hidden";
      }
      function closeLightbox() {
        document.getElementById("lightbox").classList.remove("open");
        document.body.style.overflow = "";
      }
      document
        .getElementById("lightbox")
        .addEventListener("click", function (e) {
          if (e.target === this) closeLightbox();
        });

      // Guestbook
      const messages = [];
      function submitMessage(e) {
        e.preventDefault();
        const name = document.getElementById("gb-name").value.trim();
        const relation = document.getElementById("gb-relation").value.trim();
        const msg = document.getElementById("gb-message").value.trim();
        if (!name || !msg) return;
        const url = SHEET_URL + "?type=guestbook&name=" + encodeURIComponent(name) + "&relation=" + encodeURIComponent(relation) + "&message=" + encodeURIComponent(msg);
        fetch(url, { method: "GET", mode: "no-cors" }).catch(() => {});
        messages.unshift({
          name,
          relation,
          msg,
          date: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        });
        renderMessages();
        document.getElementById("gbForm").reset();
      }
      function renderMessages() {
        const container = document.getElementById("gbMessages");
        container.innerHTML = messages
          .map(
            (m) => `
      <div class="gb-msg">
        <p class="gb-msg-text">${m.msg}</p>
        <span class="gb-msg-meta">${m.name}${m.relation ? " · " + m.relation : ""} &nbsp;·&nbsp; ${m.date}</span>
      </div>
    `,
          )
          .join("");
      }

      // RSVP
      const SHEET_URL =
        "https://script.google.com/macros/s/AKfycbwx2-5EBOCTAZInGZg6688YBtwzsZnPoRc_Uw1GUCzxEktQyfNjj4SXGtnw2VYGONLc/exec";
      let rsvpAttendance = null;

      function selectAttendance(value) {
        rsvpAttendance = value;
        document.getElementById("btn-yes").className =
          "rsvp-btn" + (value === "yes" ? " selected-yes" : "");
        document.getElementById("btn-no").className =
          "rsvp-btn" + (value === "no" ? " selected-no" : "");
        document.getElementById("rsvpSubmit").disabled = false;
      }

      function submitRsvp(e) {
        e.preventDefault();
        const name = document.getElementById("rsvp-name").value.trim();
        if (!name || !rsvpAttendance) return;
        const btn = document.getElementById("rsvpSubmit");
        btn.disabled = true;
        btn.textContent = "Sending…";
        const status = rsvpAttendance === "yes" ? "Attending" : "Not Attending";
        const url = SHEET_URL + "?type=rsvp&name=" + encodeURIComponent(name) + "&status=" + encodeURIComponent(status);
        fetch(url, { method: "GET", mode: "no-cors" })
          .catch(() => {})
          .finally(() => {
            document.getElementById("rsvpForm").style.display = "none";
            document.getElementById("rsvpSuccessMsg").textContent =
              rsvpAttendance === "yes"
                ? `Thank you, ${name} — we can't wait to celebrate with you.`
                : `Thank you, ${name} — you'll be missed on the day.`;
            document.getElementById("rsvpSuccess").style.display = "block";
          });
      }
