document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    const loginForm = document.getElementById("login-form");
    const logoutButton = document.getElementById("logout-button");
    const viewMoreButton = document.getElementById("view-more-button");

    // Function to update navigation links based on user login status
    function updateNavLinks() {
        const navLinks = document.getElementById("nav-links");
        const username = localStorage.getItem("username");

        if (username) {
            navLinks.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="games.html">Games</a></li>
                <li><a href="profile.html">Profile</a></li>
                <li><a href="#" id="logout-link">Logout</a></li>
            `;
            document.getElementById("logout-link").addEventListener("click", () => {
                localStorage.removeItem("username");
                updateNavLinks();
                window.location.href = "login.html";
            });
        } else {
            navLinks.innerHTML = `
                <li><a href="index.html">Home</a></li>
                <li><a href="games.html">Games</a></li>
                <li><a href="login.html">Login</a></li>
                <li><a href="signup.html">Signup</a></li>
            `;
        }
    }

    // Initial call to set navigation links
    updateNavLinks();

    if (signupForm) {
        signupForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("new-username").value;
            const email = document.getElementById("new-email").value;
            const password = document.getElementById("new-password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {
                document.getElementById("signup-message").textContent = "Passwords do not match.";
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];

            if (users.some(user => user.username === username)) {
                document.getElementById("signup-message").textContent = "Username already exists.";
                return;
            }

            users.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem("username", username); // Log the user in
            window.location.href = "index.html"; // Redirect to index

            document.getElementById("signup-message").textContent = "Signup successful!";
        });

        // Email validation
        document.getElementById("new-email").addEventListener("input", (event) => {
            const emailInput = event.target;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailPattern.test(emailInput.value)) {
                emailInput.setCustomValidity("");
            } else {
                emailInput.setCustomValidity("Invalid email address");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                localStorage.setItem("username", username);
                window.location.href = "index.html";
            } else {
                document.getElementById("login-message").textContent = "Invalid username or password.";
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("username");
            window.location.href = "login.html";
        });
    }

    const username = localStorage.getItem("username");
    if (username) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username);

        const welcomeMessage = document.getElementById("welcome-message");
        const profileWelcomeMessage = document.getElementById("profile-welcome-message");
        const profileName = document.getElementById("profile-name");
        const profileEmail = document.getElementById("profile-email");
        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome, ${username}!`;
        }
        if (profileWelcomeMessage) {
            profileWelcomeMessage.textContent = `Welcome to your profile, ${username}!`;
        }
        if (profileName) {
            profileName.textContent = `Username: ${user.username}`;
        }
        if (profileEmail) {
            profileEmail.textContent = `Email: ${user.email}`;
        }
    }

    if (viewMoreButton) {
        viewMoreButton.addEventListener("click", () => {
            window.location.href = "games.html";
        });
    }

    function displayFeaturedGames(games) {
        const featuredGamesContainer = document.getElementById("featured-games");
        featuredGamesContainer.innerHTML = ''; // Clear any existing games
        const featuredGames = games.slice(0, 3); // Get the first 3 games

        featuredGames.forEach(game => {
            const gameItem = document.createElement("div");
            gameItem.className = "game-item";
            gameItem.innerHTML = `
                <img src="${game.image}" alt="${game.name}" class="game-image">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
            `;
            featuredGamesContainer.appendChild(gameItem);
        });
    }

    if (document.getElementById("featured-games")) {
        fetch('games.json')
            .then(response => response.json())
            .then(games => {
                displayFeaturedGames(games);
            });
    }

    function displayGames(games) {
        const gamesList = document.getElementById("game-list");
        gamesList.innerHTML = ''; // Clear any existing games
        games.forEach(game => {
            const gameItem = document.createElement("div");
            gameItem.className = "game-item";
            gameItem.innerHTML = `
                <img src="${game.image}" alt="${game.name}" class="game-image">
                <h3>${game.name}</h3>
                <p>${game.description}</p>
                <button onclick="rentGame(${game.id})">Rent</button>
            `;
            gamesList.appendChild(gameItem);
        });
    }

    if (document.getElementById("game-list")) {
        fetch('games.json')
            .then(response => response.json())
            .then(games => {
                displayGames(games);

                $('#searchInput').on('keyup', function() {
                    const searchTerm = $(this).val().toLowerCase();
                    $('.game-item').each(function() {
                        const gameName = $(this).find('h3').text().toLowerCase();
                        if (gameName.includes(searchTerm)) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    });
                });
            });
    }

    const gameDetailsSection = document.getElementById("game-details");
    if (gameDetailsSection) {
        const params = new URLSearchParams(window.location.search);
        const gameId = params.get('id');

        fetch('games.json')
            .then(response => response.json())
            .then(games => {
                const game = games.find(g => g.id == gameId);
                if (game) {
                    document.getElementById("game-name").textContent = game.name;
                    document.getElementById("game-description").textContent = game.description;
                    document.getElementById("game-details-text").textContent = game.details;
                    document.getElementById("game-price").textContent = `Price: $${game.price}`;
                    const gameImage = document.getElementById("game-image");
                    gameImage.src = game.image;
                    gameImage.alt = game.name;

                    document.getElementById('rent-form').style.display = 'block';
                }
            });
    }

    // Rent form handling
    const rentForm = document.getElementById('rent-game-form');
    if (rentForm) {
        rentForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const name = document.getElementById('rent-name').value;
            const startDate = document.getElementById('rent-start-date').value;
            const endDate = document.getElementById('rent-end-date').value;
            const comment = document.getElementById('rent-comment').value;
            const gameId = new URLSearchParams(window.location.search).get('id');
            const username = localStorage.getItem('username');

            // Assuming we have the user's email stored in localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(user => user.username === username);
            const userEmail = user ? user.email : 'unknown';

            // Send the email
            const emailContent = `Name: ${name}\nStart Date: ${startDate}\nEnd Date: ${endDate}\nComment: ${comment}\nGame ID: ${gameId}`;
            const mailtoLink = `mailto:example@gmail.com?subject=Rent Game Order&body=${encodeURIComponent(emailContent)}`;
            window.location.href = mailtoLink;

            // Update game status
            fetch('games.json')
                .then(response => response.json())
                .then(games => {
                    const gameIndex = games.findIndex(game => game.id == gameId);
                    if (gameIndex !== -1) {
                        games[gameIndex].status = 'rented';
                        // TO DO: implement UPDATE status
                        window.location.href = 'games.html'; 
                    }
                });
        });
    }
    
});

function rentGame(gameId) {
    const username = localStorage.getItem("username");
    if (!username) {
        window.location.href = "login.html";
        return;
    }
    window.location.href = `game-details.html?id=${gameId}`;
}

// Modal functionality using jQuery
$('#game-image').on('click', function() {
    const modal = $('#myModal');
    const modalImg = $('#img01');
    const captionText = $('#caption');

    modal.show();
    modalImg.attr('src', $(this).attr('src'));
    captionText.text($(this).attr('alt'));
});

$('.close').on('click', function() {
    $('#myModal').hide();
});

$(window).on('click', function(event) {
    if ($(event.target).is('#myModal')) {
        $('#myModal').hide();
    }
});
