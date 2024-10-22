import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Adjust the path if necessary
import { CircularProgress, Typography, Box, Card, CardContent } from '@mui/material';

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Output
      </Typography>
      {blogPosts.length === 0 ? (
        <Typography variant="body1">No blog posts found.</Typography>
      ) : (
        blogPosts.map((post) => (
          <Card key={post.id} variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {post.title || 'Untitled'}
              </Typography>
              <Typography variant="body2" paragraph>
                {post.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                By: {post.persona} on {new Date(post.created_at).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default BlogPosts;
