package fr.polytech.info4.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Restaurant.
 */
@Entity
@Table(name = "restaurant")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Restaurant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "restaurant_id", nullable = false, unique = true)
    private Integer restaurantId;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "mark")
    private Integer mark;

    @OneToMany(mappedBy = "restaurant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "restaurant" }, allowSetters = true)
    private Set<Product> products = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Restaurant id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getRestaurantId() {
        return this.restaurantId;
    }

    public Restaurant restaurantId(Integer restaurantId) {
        this.restaurantId = restaurantId;
        return this;
    }

    public void setRestaurantId(Integer restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getTitle() {
        return this.title;
    }

    public Restaurant title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return this.location;
    }

    public Restaurant location(String location) {
        this.location = location;
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getMark() {
        return this.mark;
    }

    public Restaurant mark(Integer mark) {
        this.mark = mark;
        return this;
    }

    public void setMark(Integer mark) {
        this.mark = mark;
    }

    public Set<Product> getProducts() {
        return this.products;
    }

    public Restaurant products(Set<Product> products) {
        this.setProducts(products);
        return this;
    }

    public Restaurant addProduct(Product product) {
        this.products.add(product);
        product.setRestaurant(this);
        return this;
    }

    public Restaurant removeProduct(Product product) {
        this.products.remove(product);
        product.setRestaurant(null);
        return this;
    }

    public void setProducts(Set<Product> products) {
        if (this.products != null) {
            this.products.forEach(i -> i.setRestaurant(null));
        }
        if (products != null) {
            products.forEach(i -> i.setRestaurant(this));
        }
        this.products = products;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Restaurant)) {
            return false;
        }
        return id != null && id.equals(((Restaurant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Restaurant{" +
            "id=" + getId() +
            ", restaurantId=" + getRestaurantId() +
            ", title='" + getTitle() + "'" +
            ", location='" + getLocation() + "'" +
            ", mark=" + getMark() +
            "}";
    }
}
