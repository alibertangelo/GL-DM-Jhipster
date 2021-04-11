package fr.polytech.info4.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link fr.polytech.info4.domain.DeliveryMan} entity.
 */
public class DeliveryManDTO implements Serializable {

    private Long id;

    @NotNull
    @Pattern(regexp = "[0-9]*")
    private String phone;

    @NotNull
    @Size(min = 2)
    @Pattern(regexp = "[a-z]*")
    private String name;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DeliveryManDTO)) {
            return false;
        }

        DeliveryManDTO deliveryManDTO = (DeliveryManDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, deliveryManDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DeliveryManDTO{" +
            "id=" + getId() +
            ", phone='" + getPhone() + "'" +
            ", name='" + getName() + "'" +
            "}";
    }
}
