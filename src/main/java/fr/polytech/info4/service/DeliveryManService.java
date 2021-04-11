package fr.polytech.info4.service;

import fr.polytech.info4.service.dto.DeliveryManDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link fr.polytech.info4.domain.DeliveryMan}.
 */
public interface DeliveryManService {
    /**
     * Save a deliveryMan.
     *
     * @param deliveryManDTO the entity to save.
     * @return the persisted entity.
     */
    DeliveryManDTO save(DeliveryManDTO deliveryManDTO);

    /**
     * Partially updates a deliveryMan.
     *
     * @param deliveryManDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DeliveryManDTO> partialUpdate(DeliveryManDTO deliveryManDTO);

    /**
     * Get all the deliveryMen.
     *
     * @return the list of entities.
     */
    List<DeliveryManDTO> findAll();

    /**
     * Get the "id" deliveryMan.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DeliveryManDTO> findOne(Long id);

    /**
     * Delete the "id" deliveryMan.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
