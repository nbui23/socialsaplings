import express from 'express';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, getDoc, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCxuxa5bFTXVYF_NRH9HrRV_mebUzQ05OM",
    authDomain: "socialsaplings.firebaseapp.com",
    projectId: "socialsaplings",
    storageBucket: "socialsaplings.appspot.com",
    messagingSenderId: "387358176449",
    appId: "1:387358176449:web:170965d7d094b37c445040",
    measurementId: "G-WB4L946TCH"
};
const app = initializeApp(firebaseConfig);

const router = express.Router();
const db = getFirestore(app);

/*
API Calls (api/posts):

get all posts -> "/"

post method -> "/createPost"

patch method -> "/addComment"

patch -> "/like"

patch -> "/unlike"

delete -> "/deletePost"

put method -> "editPost"

implement later tbh (delete comment?? / delete post)
*/

router.get('/', async (req, res) => {
    //Get from db "posts" collection
    try {
        const postsCollection = collection(db, 'posts');
        const postsDocs = await getDocs(postsCollection);


        const postsList = postsDocs.docs.map(doc => ({ postId: doc.id, ...doc.data() }));
        res.json(postsList);
    } catch (error) {
        console.error("Error fetching posts: ", error);
        res.status(500).send(error);
    }
});

// router.get('/:id', async (req, res) => {
//     //Get a post by id
//     try {
//         const { postId } = req.params.id;
//         const postsCollection = collection(db, 'posts');
//         const postDoc = await getDoc(doc(postsCollection, postId));
//         if (postDoc.exists()) {
//             res.json(postDoc.data());
//         } else {
//             res.status(404).json({ error: 'Post not found' });
//         }
//     } catch (error) {
//         console.error("Error fetching post: ", error);
//         res.status(500).send(error);
//     }
// });

router.post("/createPost", async (req, res) => {
    //Create a new post
    try {
        const newPost = req.body;
        const postsCollection = collection(db, 'posts');
        await addDoc(postsCollection, newPost);
        res.json({
            success: true,
            message: 'Post created successfully.'
        });
    } catch (error) {
        console.error("Error creating post: ", error);
        res.status(500).send(error);
    }
});

router.patch("/addComment", async (req, res) => {
    //Add a comment to a post
    try {
        //send over the req body in this format:
        // {
        //     postId: "postId",
        //     comment: {
        //         user: "userId",
        //         comment: "comment"
        //     }
        //}

        const { postId, comment } = req.body;

        const postsCollection = collection(db, 'posts');
        const postDoc = await getDoc(doc(postsCollection, postId));

        const post = postDoc.data();
        post.comments.push(comment);
        await setDoc(postDoc.ref, post);
        res.json({
            success: true,
            message: 'Comment added successfully.'
        });
    } catch (error) {
        console.error("Error adding comment: ", error);
        res.status(500).send(error);
    }
});

router.patch("/like", async (req, res) => {
    //Like a post
    try {
        const { postId, userId } = req.body;
        const postsCollection = collection(db, 'posts');
        const postDoc = await getDoc(doc(postsCollection, postId));
        const post = postDoc.data();
        post.likes.push(userId);
        await setDoc(doc(postsCollection, postId), post);
        res.json({
            success: true,
            message: 'Post liked successfully.'
        });
    } catch (error) {
        console.error("Error liking post: ", error);
        res.status(500).send(error);
    }
});

router.patch("/unlike", async (req, res) => {
    //Unlike a post
    try {
        const { postId, userId } = req.body;
        const postsCollection = collection(db, 'posts');
        const postDoc = await getDoc(doc(postsCollection, postId));
        const post = postDoc.data();
        post.likes = post.likes.filter(id => id !== userId);
        await setDoc(doc(postsCollection, postId), post);
        res.json({
            success: true,
            message: 'Post unliked successfully.'
        });
    } catch (error) {
        console.error("Error unliking post: ", error);
        res.status(500).send(error);
    }
});

router.put("/editPost", async (req, res) => {
    //Edit a post
    try {
        const { postId, newPost } = req.body;
        const postsCollection = collection(db, 'posts');
        await setDoc(doc(postsCollection, postId), newPost);
        res.json({
            success: true,
            message: 'Post edited successfully.'
        });
    } catch (error) {
        console.error("Error editing post: ", error);
        res.status(500).send(error);
    }
});

router.delete("/deletePost", async (req, res) => {
    //Delete a post
    try {
        const { postId, userId } = req.body;
        const postsCollection = collection(db, 'posts');
        const post = await getDoc(doc(postsCollection, postId));
        if (post.data().user !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this post.'
            });
        } else {
            await deleteDoc(doc(postsCollection, postId));
            res.json({
                success: true,
                message: 'Post deleted successfully.'
            });
        }
    } catch (error) {
        console.error("Error deleting post: ", error);
        res.status(500).send(error);
    }
});

export { router as postsRouter };