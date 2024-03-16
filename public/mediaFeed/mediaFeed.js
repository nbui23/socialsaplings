/*
{
  profilePicture: 'default-image-url',
  CO2Absorbed: 0,
  TreesPlanted: 0,
  username: 'normanbui',  
  userId: "m6rADXvLnFVSSASkSdF9Fq8TshT2",
  joinedDate: Timestamp { _seconds: 1710474379, _nanoseconds: 542000000 }
}

*/

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
       // console.log("Posts fetched successfully:", posts);
        return posts;

    });
}

function returnArray(){

}

// function getPostById(paramPostId){
//     //fetch post by id in the URL
//     fetch('api/posts/' + paramPostId, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Failed to fetch post');
//         }
//         return response.json();
//     });
// }

function addComment(){
    
}

async function toggleLike(postId){
    posts = await getPosts();
    console.log(posts)
    // let post = posts.find(post => post.postId === postId);
    // console.log(post);
    // if(post.likes.includes(userId)){
    //     //unlike
    //     fetch('/api/posts/unlike', {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             postId: postId,
    //             userId: userId
    //         })
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Failed to unlike post');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         console.log("Post unliked successfully:", data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
    // }
    // else {
    //     //like
    //     fetch('/api/posts/like', {
    //         method: 'PATCH',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             postId: postId,
    //             userId: userId
    //         })
    //     })
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Failed to like post');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         console.log("Post liked successfully:", data);
    //     })
    //     .catch(error => {
    //         console.error('Error:', error);
    //     });
    // }
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