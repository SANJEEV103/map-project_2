import "./style2.css"
// Define the HTML for the navbar
const navbarHTML = `
<nav class="navbar">
    <div class="logo">
        <img src="your-logo.png" alt="Election Commission of India Logo">
        <span>भारत निर्वाचन आयोग</span>
        <span>Election Commission of India</span>
    </div>
    <div class="nav-links">
        <a href="/home"><i class="fas fa-home"></i> Home</a>
        <a href="/hindi"><i class="fas fa-globe-asia"></i> Hindi</a>
        <a href="/refresh"><i class="fas fa-sync-alt"></i> Refresh</a>
    </div>
</nav>
`;

// Function to add the navbar to a specific element
function addNavbar(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
        target.innerHTML += navbarHTML;
    } else {
        console.error("Navbar target element not found");
    }
}
