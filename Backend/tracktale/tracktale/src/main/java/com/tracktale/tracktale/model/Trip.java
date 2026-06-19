package com.tracktale.tracktale.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TripStatus status = TripStatus.PLANNED;

    /**
     * Serialized JSON array of [lng, lat] coordinate pairs representing the travel route.
     * Example: [[80.7718, 7.8731], [80.7800, 7.8900]]
     */
    @Column(columnDefinition = "LONGTEXT")
    private String routeData;

    /**
     * Serialized JSON array of waypoint pin objects.
     * Each object: { lat, lng, note, name, imageUrl, timestamp }
     */
    @Column(columnDefinition = "LONGTEXT")
    private String waypointsData;

    /**
     * Province where the trail takes place (e.g. "Uva Province").
     */
    @Column(length = 100)
    private String province;

    /**
     * User-entered duration string (e.g. "2 days", "Half day").
     */
    @Column(length = 50)
    private String duration;

    /**
     * Comma-separated category tags (e.g. "Hiking,Scenic,Culture").
     */
    @Column(columnDefinition = "TEXT")
    private String tags;

    /**
     * The owning user — serialized as a nested object but strips the
     * back-reference (trips list) to prevent infinite recursion.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"trips", "hibernateLazyInitializer", "handler"})
    private User user;
}
