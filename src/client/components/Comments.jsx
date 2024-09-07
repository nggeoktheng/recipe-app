import { useState, useEffect } from "react";

const Comments = ({ recipeId, isAuthed }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        fetchComments();
    }, [recipeId]);

    const fetchComments = async () => {
        const res = await fetch(`/recipe/${recipeId}/comments`);
        const data = await res.json();
        if (data.success) {
            setComments(data.comments);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const res = await fetch(`/recipe/${recipeId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: newComment }),
        });

        const data = await res.json();
        if (data.success) {
            setComments(prevComments => [{
                id: data.comment.id,
                comment: newComment,
                created_at: data.comment.created_at,
                username: "You"
            }, ...prevComments]);
            setNewComment("");
        }
    };

    return (
        <div className="mt-10 mb-10">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Comments</h3>
            {isAuthed && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add a comment..."
                    />
                    <button type="submit" className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                        Post Comment
                    </button>
                </form>
            )}
            <div className="space-y-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="p-4 bg-gray-100 rounded shadow-sm">
                        <p className="text-gray-800">{comment.comment}</p>
                        <p className="text-sm text-gray-600">
                        By {comment.username} on {new Date(comment.created_at).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comments;