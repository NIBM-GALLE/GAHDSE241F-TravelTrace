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
     * Example: [[103.8198, 1.3521], [103.8300, 1.3600]]
     */
    @Column(columnDefinition = "LONGTEXT")
    private String routeData;

    /**
     * Serialized JSON array of waypoint pin objects.
     * Each object may contain: { lat, lng, note, imageUrl, timestamp }
     * Example: [{"lat":1.35,"lng":103.82,"note":"Hotel","imageUrl":"https://..."}]
     */
    @Column(columnDefinition = "LONGTEXT")
    private String waypointsData;

    /**
     * The owning user — serialized as a nested object but strips the
     * back-reference (trips list) to prevent infinite recursion.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"trips", "hibernateLazyInitializer", "handler"})
    private User user;
}
