let userData = null;
let userIdToUsernameMap = {};

// Utility function to create a post element
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'post';

    const likedByUser = post.likes.includes(userData.userId);
    const heartIcon = likedByUser ? '❤️' : '🤍';

    const eventInfo = post.isEvent ? `
        <p class='description'>Date: ${new Date(post.date).toLocaleDateString()}</p>
        <p class='description'>Location: ${post.location}</p>
    ` : '';

    postElement.innerHTML = `
        <div class='item mb-2 wider'>
        <h2>${post.title}</h2>
        <img src="${post.image}" class='image-post' alt="${post.title}"><br>
        <div class='icon-post'>
        <a><i class='fa fa-user'></i></a>
        <span>@${userIdToUsernameMap[post.user]}</span>
        </div>
        <p class='description'>${post.textBody}</p>
        ${eventInfo}
        <button class="like-btn" data-liked="${likedByUser}" data-postid="${post.postId}">
            <p class="heart-icon">${heartIcon}</p>
            <p class="like-count">${post.likes.length}</p>
        </button>
        <a href="#" class="toggle-comments">Show Comments</a>
        <div class="comments-section" style="display: none;"></div>
        <form class="comment-form" data-postid="${post.postId}">
            <input type="text" class="comment-input" placeholder="Add a comment..." />
            <div class='main-button nospace'>
            <button type="submit">Post Comment</button>
            </div>
        </form>
        </div>
    `;

    // Add event listener for like button
    postElement.querySelector('.like-btn').addEventListener('click', function() {
        const postId = this.getAttribute('data-postid');
        const liked = this.getAttribute('data-liked') === 'true';
        const likesCounter = this.parentNode.querySelector('.like-count'); // Adjust based on your HTML structure
        if (liked) {
            unlikePost(postId, this, likesCounter);
        } else {
            likePost(postId, this, likesCounter);
        }
    });

    // Toggle comments section
    const commentsToggle = postElement.querySelector('.toggle-comments');
    const commentsSection = postElement.querySelector('.comments-section');
    commentsToggle.addEventListener('click', function(event) {
        event.preventDefault();
        const isDisplayed = commentsSection.style.display === 'block';
        commentsSection.style.display = isDisplayed ? 'none' : 'block';
        commentsToggle.textContent = isDisplayed ? 'Show Comments' : 'Hide Comments';
        // Populate comments if not already displayed
        if (!isDisplayed) {
            commentsSection.innerHTML = post.comments.map(comment => `<p class='comment'><span class='bolder'>${userIdToUsernameMap[comment.user]}:</span> ${comment.comment}</p>`).join('');
        }
    });

    // Event listener for adding a comment
    const commentForm = postElement.querySelector('.comment-form');
    commentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const commentInput = postElement.querySelector('.comment-input');
        const commentText = commentInput.value.trim();
        if (commentText) {
            const comment = { user: userData.userId, comment: commentText };
            addComment(post.postId, comment, commentsSection);
            commentInput.value = '';
        }
    });

    return postElement;
}

// Function to render posts in the DOM
function renderPosts(posts) {
    // const container = document.getElementById('posts-container');
    const container1 = document.getElementById('posts-container-column1');
    const container2 = document.getElementById('posts-container-column2');
    if (!posts || posts.length === 0) {
        container.innerHTML = '<p>No posts available.</p>';
        return;
    }

    posts.forEach((post, index) => {
        const postElement = createPostElement(post);
        // container.appendChild(postElement);
        if (index % 2 === 0) {
            container1.appendChild(postElement);
        } else {
            container2.appendChild(postElement);
        }

    });
}

// Main function to fetch and display posts
function displayPosts() {
    getPosts().then(renderPosts).catch(error => {
        console.error('Error populating posts:', error);
        document.getElementById('p-container').innerHTML = '<p>Error fetching posts. Please try again later.</p>';
    });
}

// Fetches posts from the server
function getPosts() {
    return fetch('http://localhost:3000/api/posts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            return response.json();
        })
        .then(posts => {
            console.log("Posts fetched successfully:", posts);
            return posts;
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            throw error;
        });
}

// Fetches user data, handling authentication
function fetchUserData() {
    const idToken = localStorage.getItem('idToken');
    if (!idToken) {
        window.location.href = '/signin';
        return Promise.reject('No idToken found');
    }

    return fetch('http://localhost:3000/api/user-data', {
        headers: {
            'Authorization': `Bearer ${idToken}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        return response.json();
    })
    .then(data => {
        userData = data;
        console.log("User data fetched successfully:", data);
        return data; // Make sure to return data for further chaining if needed
    })
    .catch(error => {
        console.error('Error:', error);
        throw error; // Ensure the error is propagated
    });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchUserData()
    .then(() => fetchAllUsers())
    .then(() => {
        displayPosts(); // Call displayPosts only after userData and userIdToUsernameMap are set
    }).catch(error => {
        console.error('Initialization error:', error);
    });
});

function returnArray(){

}

function addComment(postId, comment, commentsSection) {
    fetch('http://localhost:3000/api/posts/addComment', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, comment })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const newCommentElement = document.createElement('p');
            newCommentElement.classList.add('comment'); // Add the 'comment' class
            newCommentElement.innerHTML = `<span class='bolder'>${userIdToUsernameMap[comment.user]}:</span> ${comment.comment}`;
            commentsSection.appendChild(newCommentElement);
            commentsSection.style.display = 'block';
        }
    })
    .catch(error => console.error('Error adding comment:', error));
}

function toggleHeartIcon(likeButton, liked) {
    const heartIcon = likeButton.querySelector('.heart-icon');
    heartIcon.textContent = liked ? '❤️' : '🤍';
}

function likePost(postId, likeButton, likesCounter) {
    fetch('http://localhost:3000/api/posts/like', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            postId: postId,
            userId: userData.userId
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        const likes = parseInt(likesCounter.textContent) + 1;
        likesCounter.textContent = likes.toString();
        toggleHeartIcon(likeButton, true);
        likeButton.setAttribute('data-liked', 'true');
    })
    .catch(error => console.error('Error liking post:', error));
}

function unlikePost(postId, likeButton, likesCounter) {
    fetch('http://localhost:3000/api/posts/unlike', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            postId: postId,
            userId: userData.userId
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        const likes = parseInt(likesCounter.textContent) - 1;
        likesCounter.textContent = likes.toString();
        toggleHeartIcon(likeButton, false);
        likeButton.setAttribute('data-liked', 'false');
    })
    .catch(error => console.error('Error unliking post:', error));
}

function fetchAllUsers() {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3000/api/users/')
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch users');
                return response.json();
            })
            .then(usersList => {
                // Create a mapping of user IDs to usernames
                userIdToUsernameMap = usersList.reduce((acc, user) => {
                    acc[user.id] = user.username; // Use 'id' field as key
                    return acc;
                }, {});
                console.log('User ID to Username Map:', userIdToUsernameMap);
                resolve(userIdToUsernameMap);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
                reject(error);
            });
    });
}

function editPost(){

}

function deletePost(){
    
}

function createPost(){

}