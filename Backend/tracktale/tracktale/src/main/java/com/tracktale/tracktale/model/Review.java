package com.tracktale.tracktale.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Star rating from 1 to 5. */
    @Column(nullable = false)
    private int rating;

    /** The user's review comment. */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String comment;

    /** Timestamp when the review was created. */
    @Column(nullable = false)
    private LocalDateTime createdAt;

    /** Admin reply text — null until admin responds. */
    @Column(columnDefinition = "TEXT")
    private String adminReply;

    /** Timestamp when the admin replied. */
    private LocalDateTime adminRepliedAt;

    /** The user who wrote the review. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"trips", "password", "hibernateLazyInitializer", "handler"})
    private User user;

    /** The trip/trail being reviewed. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    @JsonIgnoreProperties({"routeData", "waypointsData", "hibernateLazyInitializer", "handler"})
    private Trip trip;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
