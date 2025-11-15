import express from "express"
// Auth imports
import { signup, login, verifyEmail, confirmEmail, sendPasswordResetEmail, resetPassword } from "../controllers/authController.js"
// User imports
import { profile, updateProfile, uploadProfilePicture, getProfilePicture } from "../controllers/userController.js"
// Post imports
import { getPosts, createPost, updatePost, deletePost, upvotePost, addComment, getComments, deleteComment } from "../controllers/postController.js"
// Quote imports
import { getRandomQuote } from "../controllers/quoteController.js"
// Companion imports
import { becomeCompanion, getCompanions } from "../controllers/companionController.js"
// Report imports
import { getReports, createReport } from "../controllers/reportController.js"
// Question imports
import { getQuestions } from "../controllers/questionController.js"
import { authenticateToken } from "../config/middlewares.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/profile", authenticateToken, profile)
router.put("/profile", authenticateToken, updateProfile)

router.get('/posts', getPosts)
router.post('/posts', authenticateToken, createPost);
router.put('/posts/:id', authenticateToken, updatePost);
router.delete('/posts/:id', authenticateToken, deletePost);
router.post('/posts/:id/upvote', authenticateToken, upvotePost);
router.post('/posts/:id/comments', authenticateToken, addComment);
router.get('/posts/:id/comments', getComments);
router.delete('/posts/:postId/comments/:commentId', authenticateToken, deleteComment);


router.get('/reports', authenticateToken, getReports);
router.post('/reports', authenticateToken, createReport);

router.post('/companion',authenticateToken,becomeCompanion)
router.get('/companions',getCompanions)

router.post('/verify-email', authenticateToken, verifyEmail);
router.get('/confirm-email', confirmEmail )
router.post('/reset-password', sendPasswordResetEmail)
router.post('/confirm-reset-password', resetPassword)

router.get('/questions',authenticateToken, getQuestions)

router.post('/upload-profile-picture', authenticateToken, uploadProfilePicture);
router.get('/profile-picture', authenticateToken, getProfilePicture);

router.get('/quote', getRandomQuote);

export default router