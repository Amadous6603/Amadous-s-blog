package com.blog.service;

import com.blog.model.Post;
import com.blog.repository.PostRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Page<Post> getPosts(int page, int size, String q, String category) {
        Pageable pageable = PageRequest.of(page, size);
        return postRepository.findPosts(
            q == null || q.isBlank() ? null : q,
            category == null || category.isBlank() ? null : category,
            pageable
        );
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public List<String> getAllCategories() {
        return postRepository.findAllCategories();
    }

    public List<Map<String, Object>> getArchives() {
        return postRepository.findArchivesRaw().stream()
            .map(row -> Map.of(
                "year", row[0],
                "month", row[1],
                "count", row[2]
            ))
            .toList();
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post updatePost(Long id, Post postDetails) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + id));
        post.setTitle(postDetails.getTitle());
        post.setSummary(postDetails.getSummary());
        post.setContent(postDetails.getContent());
        post.setAuthor(postDetails.getAuthor());
        post.setCategory(postDetails.getCategory());
        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
