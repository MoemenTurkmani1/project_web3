<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stadium Reservation - Header & Footer</title>
    <link rel="stylesheet" href="../includes/style.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="nav-content">
                <!-- Logo -->
                <div class="logo-section">
                    <div class="logo-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <span class="logo-text">Mala3b</span>
                </div>

                <!-- Desktop Navigation -->
                <nav class="nav-desktop">
                <a href="/project_web3/pages/home.html" class="nav-link">Home</a>
                <a href="../pages/booking.html" class="nav-link">Find Stadiums</a>
                <a href="../pages/shop.html" class="nav-link">Shop</a>
                <a href="../pages/event.html" class="nav-link">Events</a>
                <a href="../pages/pricing.html" class="nav-link">Pricing</a>
                <a href="../pages/about.html" class="nav-link">About Us</a>
                <a href="../pages/Service.html" class="nav-link">Services</a>
                <a href="../pages/contact.html" class="nav-link">Contact</a>
                <?php if (isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'owner'): ?>
                    <a href="../pages/dashboard.html" class="nav-link">Dashboard</a>
                <?php endif; ?>
               
              </nav>
                <div class="auth-buttons">
    <?php if (isset($_SESSION['user_id'])): ?>
        <a href="../api/signout.php"><button class="btn btn-ghost">Log Out</button></a>
    <?php else: ?>
        <a href="../pages/SignIn.html"><button class="btn btn-ghost">Login</button></a>
        <a href="../pages/SignUp.html"><button class="btn btn-primary">Sign Up</button></a>
    <?php endif; ?>
</div>

                <!-- Mobile Menu Button -->
                <button class="mobile-menu-btn" id="mobileMenuBtn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            <!-- Mobile Navigation Menu -->
            <nav class="nav-mobile" id="mobileNav">
                <!-- Quick Access Button -->
                <div class="mobile-quick-access">
                    <button class="btn-show-pages" id="showPagesBtn">
                        <i class="fas fa-th-large"></i>
                        <span>Show All Pages</span>
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>

                <!-- Main Navigation Links -->
                <div class="mobile-nav-section">
                    <h4 class="mobile-section-title">Main Navigation</h4>
                    <a href="../pages/home.html" class="nav-link">
                        <i class="fas fa-home"></i>
                        <span>Home</span>
                    </a>
                    <a href="../pages/booking.html" class="nav-link">
                        <i class="fas fa-calendar-check"></i>
                        <span>Find Stadiums</span>
                    </a>
                    <a href="../pages/shop.html" class="nav-link">
                        <i class="fas fa-shopping-cart"></i>
                        <span>Shop</span>
                    </a>
                    <a href="../pages/event.html" class="nav-link">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Events</span>
                    </a>
                </div>

                <!-- Secondary Navigation Links -->
                <div class="mobile-nav-section">
                    <h4 class="mobile-section-title">More Info</h4>
                    <a href="../pages/pricing.html" class="nav-link">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Pricing</span>
                    </a>
                    <a href="../pages/about.html" class="nav-link">
                        <i class="fas fa-info-circle"></i>
                        <span>About Us</span>
                    </a>
                    <a href="../pages/Service.html" class="nav-link">
                        <i class="fas fa-concierge-bell"></i>
                        <span>Services</span>
                    </a>
                    <a href="../pages/contact.html" class="nav-link">
                        <i class="fas fa-envelope"></i>
                        <span>Contact</span>
                    </a>
                </div>

                <!-- Authentication Section -->
                <div class="mobile-auth">
    <h4 class="mobile-section-title">Account</h4>
    <?php if (isset($_SESSION['user_id'])): ?>
        <a href="../api/signout.php" class="btn btn-ghost">
            <i class="fas fa-sign-out-alt"></i>
            <span>Log Out</span>
        </a>
    <?php else: ?>
        <a href="../pages/SignIn.html" class="btn btn-ghost">
            <i class="fas fa-sign-in-alt"></i>
            <span>Login</span>
        </a>
        <a href="../pages/SignUp.html" class="btn btn-primary">
            <i class="fas fa-user-plus"></i>
            <span>Sign Up</span>
        </a>
    <?php endif; ?>
</div>
            </nav>

        </div>
    </header>

  <!-- Your page content goes here -->
  
</body>
</html>
