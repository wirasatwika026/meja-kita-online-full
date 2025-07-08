// Main JavaScript file for Meja Kita Online

document.addEventListener("DOMContentLoaded", function () {
  // Add fade-in animation to main content
  document.querySelector("main").classList.add("fade-in");

  // Auto-hide alerts after 5 seconds
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.style.opacity = "0";
      setTimeout(() => {
        alert.remove();
      }, 300);
    }, 5000);
  });

  // Form validation helpers
  const forms = document.querySelectorAll("form");
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading me-2"></span>Processing...';
      }
    });
  });

  // Confirm dialogs for delete actions
  const deleteButtons = document.querySelectorAll("[data-confirm]");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const message = this.getAttribute("data-confirm") || "Are you sure?";
      if (!confirm(message)) {
        e.preventDefault();
      }
    });
  });

  // Auto-update time for relative timestamps
  updateTimeStamps();
  setInterval(updateTimeStamps, 60000); // Update every minute

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Table search functionality
  const searchInput = document.querySelector("#tableSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const filter = this.value.toLowerCase();
      const rows = document.querySelectorAll("tbody tr");

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
      });
    });
  }
});

// Function to update relative timestamps
function updateTimeStamps() {
  const timeElements = document.querySelectorAll("[data-timestamp]");
  timeElements.forEach((element) => {
    const timestamp = parseInt(element.getAttribute("data-timestamp"));
    const now = Date.now();
    const diff = now - timestamp;

    element.textContent = formatRelativeTime(diff);
  });
}

// Function to format relative time
function formatRelativeTime(diff) {
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "Just now";
}

// Function to show loading state
function showLoading(element) {
  element.disabled = true;
  element.innerHTML = '<span class="loading me-2"></span>Loading...';
}

// Function to hide loading state
function hideLoading(element, originalText) {
  element.disabled = false;
  element.innerHTML = originalText;
}

// Function to show toast notification
function showToast(message, type = "info") {
  const toastContainer =
    document.querySelector(".toast-container") || createToastContainer();

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

  toastContainer.appendChild(toast);

  const bsToast = new bootstrap.Toast(toast);
  bsToast.show();

  // Remove toast element after it's hidden
  toast.addEventListener("hidden.bs.toast", () => {
    toast.remove();
  });
}

// Function to create toast container if it doesn't exist
function createToastContainer() {
  const container = document.createElement("div");
  container.className = "toast-container position-fixed bottom-0 end-0 p-3";
  document.body.appendChild(container);
  return container;
}

// Export functions for use in other scripts
window.MejaKitaOnline = {
  showLoading,
  hideLoading,
  showToast,
  formatRelativeTime,
};
