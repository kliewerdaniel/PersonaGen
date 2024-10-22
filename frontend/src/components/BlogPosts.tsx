import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';  // Adjust the path if necessary
interface BlogPost {
  id: number;
  persona: string;
  title: string;
  content: string;
  created_at: string;
}

const BlogPosts: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get('blog-posts/');
        setBlogPosts(response.data);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div>
      <h2>Blog Posts</h2>
      {blogPosts.length === 0 ? (
        <p>No blog posts found.</p>
      ) : (
        <ul>
          {blogPosts.map((post) => (
            <li key={post.id}>
              <h3>{post.title || 'Untitled'}</h3>
              <p>{post.content}</p>
              <small>
                By: {post.persona} on{' '}
                {new Date(post.created_at).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlogPosts;
