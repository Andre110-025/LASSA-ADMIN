// Set the date we're counting down to
let countdownDate = new Date("Dec 31, 2024 23:59:59").getTime();

// Update the countdown every 1 second
let x = setInterval(function() {

  // Get the current date and time
  let now = new Date().getTime();

  // Calculate the distance between now and the countdown date
  let distance = countdownDate - now;

  // Time calculations for days, hours, minutes, and seconds
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the elements with corresponding IDs
  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
  document.getElementById("seconds").innerText = seconds;

  // If the countdown is over, display a message
  if (distance < 0) {
    clearInterval(x);
    document.querySelector(".countdown").innerHTML = "<h2>We are live now!</h2>";
  }
}, 1000);

// Form submission event
document.getElementById("notify-form").addEventListener("submit", function(e) {
    e.preventDefault();
    alert("Thank you! You'll be notified when we launch.");
});
