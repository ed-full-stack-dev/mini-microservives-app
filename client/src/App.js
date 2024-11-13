import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [postTitle, setPostTitle] = useState('');
  const [posts, setPosts] = useState({});

  const handleFormSubmissions = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/posts', { title: postTitle });
      setPostTitle('');
      // fetchPosts(); // Refresh posts after submission
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:4000/posts');
      setPosts(res.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const renderedPosts = () => {
    return Object.values(posts).map((post) => {
      return <PostCard key={post.id} {...post} />;
    });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className='main-section'>
      <PostCreate
        postTitle={postTitle}
        handleFormSubmissions={handleFormSubmissions}
        setPostTitle={setPostTitle}
      />
      <div className='posts-section'>{renderedPosts()}</div>
    </section>
  );
}

export default App;

function PostCard(post) {
  return (
    <div className='post-card'>
      <h3>{post.title}</h3>
      <CommentPostList postId={post.id} />
      <CreateComment postId={post.id} />
    </div>
  );
}

function CommentPostList({ postId }) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`);
        setComments(res.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }

    fetchComments();
  }, [postId]);
  return (
    <div>
      <h1>Comments</h1>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  );
}

function CreateComment({ postId }) {
  const [comment, setComment] = useState('');
  const handleCommentSubmission = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
        content: comment,
      });
      setComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  }

  return (
    <div>
      <form onSubmit={handleCommentSubmission} >
        <label>Create Comment</label>
        <input type='text' value={comment} onChange={(e) => setComment(e.target.value)} />
        <button className='button'>Submit</button>
      </form>
    </div>
  );
}

function PostCreate({ postTitle, handleFormSubmissions, setPostTitle }) {
  return (
    <div className='create-post-section'>
      <form onSubmit={handleFormSubmissions}>
        <h1>Create Post</h1>
        <h4>Title</h4>
        <input
          name='postTitle'
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          type='text'
        />
        <button className='button'>Submit</button>
      </form>
    </div>
  );
}