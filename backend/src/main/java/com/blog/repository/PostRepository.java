package com.blog.repository;

import com.blog.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p WHERE " +
           "(:q IS NULL OR p.title LIKE %:q% OR p.summary LIKE %:q% OR p.content LIKE %:q%) AND " +
           "(:category IS NULL OR p.category = :category) " +
           "ORDER BY p.createdAt DESC")
    Page<Post> findPosts(@Param("q") String q, @Param("category") String category, Pageable pageable);

    @Query("SELECT DISTINCT p.category FROM Post p WHERE p.category IS NOT NULL ORDER BY p.category")
    List<String> findAllCategories();

    @Query("SELECT FUNCTION('YEAR', p.createdAt), FUNCTION('MONTH', p.createdAt), COUNT(p) " +
           "FROM Post p GROUP BY FUNCTION('YEAR', p.createdAt), FUNCTION('MONTH', p.createdAt) " +
           "ORDER BY FUNCTION('YEAR', p.createdAt) DESC, FUNCTION('MONTH', p.createdAt) DESC")
    List<Object[]> findArchivesRaw();
}
