document.addEventListener("DOMContentLoaded", function () {
  const header = document.createElement("header");
  header.innerHTML = `<div class="container">
      <div class="profile-section">
        <a href="#profile" class="profile-link">
          <div class="avatar">
            <img
              src="https://i.pinimg.com/736x/a4/6f/7f/a46f7f6064eef49616cf7c1ef00e9b96.jpg"
              alt="Avatar"
              onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM3NzciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIvPjwvc3ZnPg=='"
            />
          </div>
          <div class="greeting-text">
            <span class="greeting">
              <img src="https://cdn.jsdelivr.net/gh/free-whiteboard-online/Free-Erasorio-Alternative-for-Collaborative-Design@48414511af747abe8b338932e61ad96695a9674c/uploads/2025-11-27T04-42-35-160Z-nbyn2hggg.png" alt="Logo" width="24" />
              <h4>Hello!</h4>
            </span>
            <h3 class="adminName">User</h3>
          </div>
        </a>
      </div>

      <nav>
        <button class="mobile-menu-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-menu">
          <li><a href="/src/pages/user/home.html" class="nav-link">Home</a></li>
          <li><a href="/src/pages/user/features.html" class="nav-link">Features</a></li>
          <li><a href="#" class="nav-link">About Us</a></li>
          <li><a href="#" class="nav-link">Contact Us</a></li>
          <li>
            <a id="logoutBtn" class="button-logout" href="#">
              <button class="css-button-logout">LogOut</button>
            </a>
          </li>
        </ul>
      </nav>
    </div>`;

  const style = document.createElement("style");
  style.textContent = ` 
  header {
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 15px 0;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  
  header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
  }
  
  .profile-section > a {
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: transform 0.2s ease;
  }
  
  .profile-section > a:hover {
    transform: translateY(-2px);
  }
  
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff9f89 0%, #e9969f 100%);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .greeting-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .greeting {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 2px;
  }
  
  .greeting h4 {
    font-size: 12px;
    color: #777;
    font-weight: 500;
    margin: 0;
  }
  
  .greeting-text h3 {
    font-size: 16px;
    color: #ff9f89;
    font-weight: 700;
    margin: 0;
    transition: color 0.3s ease;
  }
  
  .profile-link:hover .greeting-text h3 {
    color: #e9969f;
  }
  
  nav {
    position: relative;
  }
  
  .mobile-menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: space-around;
    width: 30px;
    height: 25px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 10;
  }
  
  .mobile-menu-toggle span {
    width: 100%;
    height: 3px;
    background-color: #333;
    border-radius: 5px;
    transition: all 0.3s linear;
    transform-origin: center;
  }
  
  .nav-menu {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 28px;
    margin: 0;
    padding: 0;
  }
  
  .nav-link {
    display: inline-block;
    text-decoration: none;
    color: #333;
    font-weight: 600;
    font-size: 15px;
    position: relative;
    padding: 8px 0;
    transition: all 0.3s ease;
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #ff9f89 0%, #e9969f 100%);
    transition: width 0.3s ease;
  }
  
  .nav-link:hover {
    color: #ff9f89;
  }
  
  .nav-link:hover::after {
    width: 100%;
  }
  
  
  
  @media (max-width: 900px) {
    header .container {
      padding: 0 15px;
    }
    
    .mobile-menu-toggle {
      display: flex;
    }
    
    .nav-menu {
      position: fixed;
      flex-direction: column;
      background: white;
      top: 0;
      right: -100%;
      width: 70%;
      height: 100%;
      box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
      padding: 80px 20px 20px;
      gap: 20px;
      transition: right 0.4s ease;
      z-index: 5;
      
    }
    
    .nav-menu.active {
      right: 0;
    }
    
    .nav-link {
      font-size: 18px;
      padding: 12px 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    
    .mobile-menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    
    .mobile-menu-toggle.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
  
  @media (max-width: 600px) {
    .greeting-text h3 {
      font-size: 14px;
    }
    
    .greeting h4 {
      font-size: 11px;
    }
    
    .avatar {
      width: 45px;
      height: 45px;
    }
  }`;

  document.head.appendChild(style);
  document.body.prepend(header);

  // Add functionality for mobile menu toggle
  setTimeout(() => {
    const toggleButton = document.querySelector(".mobile-menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (toggleButton && navMenu) {
      toggleButton.addEventListener("click", function () {
        this.classList.toggle("active");
        navMenu.classList.toggle("active");
        toggleButton.style.position = "relative";
        toggleButton.style.zIndex = "1001";
      });
    }

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        toggleButton.classList.remove("active");
        navMenu.classList.remove("active");
        toggleButton.style.zIndex = "initial";
      });
    });
  }, 100);
});
