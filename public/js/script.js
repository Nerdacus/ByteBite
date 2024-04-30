// Define the Subject
class SearchBarSubject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers() {
    console.log("Subject: Notifying observers...");
    this.observers.forEach((observer) => observer.update());
  }

  // Method to trigger an event
  triggerEvent() {
    console.log("Subject: Triggering event...");
    this.notifyObservers();
  }
}

// Define the Observer
class SearchBarObserver {
  constructor(searchBar, searchInput, searchClose) {
    this.searchBar = searchBar;
    this.searchInput = searchInput;
    this.searchClose = searchClose;
  }

  update() {
    console.log("Observer: Updating...");
    // Toggle visibility and focus on input
    if (this.searchBar.classList.contains("open")) {
      this.searchBar.style.visibility = "hidden";
      this.searchBar.classList.remove("open");
      this.searchClose.setAttribute("aria-expanded", "false");
    } else {
      this.searchBar.style.visibility = "visible";
      this.searchBar.classList.add("open");
      this.searchClose.setAttribute("aria-expanded", "true");
      this.searchInput.focus();
    }
  }
}

// Create Subject instance
const searchBarSubject = new SearchBarSubject();

// Get DOM elements
const searchBar = document.querySelector(".searchBar");
const searchInput = document.getElementById("searchInput");
const searchClose = document.getElementById("searchClose");

// Create Observer instance
const searchBarObserver = new SearchBarObserver(searchBar, searchInput, searchClose);

// Add Observer to Subject
searchBarSubject.addObserver(searchBarObserver);

// Attach EventListeners using Observer pattern
document.addEventListener("DOMContentLoaded", function () {
  const allButtons = document.querySelectorAll(".searchBtn");

  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].addEventListener("click", function () {
      console.log("Button clicked.");
      // Trigger event when button is clicked
      searchBarSubject.triggerEvent();
    });
  }

  searchClose.addEventListener("click", function () {
    console.log("Close button clicked.");
    // Trigger event when close button is clicked
    searchBarSubject.triggerEvent();
  });
});
