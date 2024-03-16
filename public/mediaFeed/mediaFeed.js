function fetchUserData() {
    const idToken = localStorage.getItem('idToken'); // Retrieve the token
    if (!idToken) {
        window.location.href = '/signin'; // Redirect if not found
        return;
    }

    fetch('/api/user-data', {
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
        console.log("User data fetched successfully:", data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getPosts(){
    fetch('/api/posts')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        return response.json();
    })
    .then(posts => {
        console.log("Posts fetched successfully:", posts);
    })
}

function addComment(){
    
}

function toggleLike(){

}

function editPost(){

}

function deletePost(){
    
}

function createPost(){
    //Taseen's form data:

    /*
    const newPost = {

    }


    */
}