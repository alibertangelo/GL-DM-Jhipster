package fr.polytech.info4.service.impl;

import fr.polytech.info4.domain.DeliveryMan;
import fr.polytech.info4.repository.DeliveryManRepository;
import fr.polytech.info4.service.DeliveryManService;
import fr.polytech.info4.service.dto.DeliveryManDTO;
import fr.polytech.info4.service.mapper.DeliveryManMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link DeliveryMan}.
 */
@Service
@Transactional
public class DeliveryManServiceImpl implements DeliveryManService {

    private final Logger log = LoggerFactory.getLogger(DeliveryManServiceImpl.class);

    private final DeliveryManRepository deliveryManRepository;

    private final DeliveryManMapper deliveryManMapper;

    public DeliveryManServiceImpl(DeliveryManRepository deliveryManRepository, DeliveryManMapper deliveryManMapper) {
        this.deliveryManRepository = deliveryManRepository;
        this.deliveryManMapper = deliveryManMapper;
    }

    @Override
    public DeliveryManDTO save(DeliveryManDTO deliveryManDTO) {
        log.debug("Request to save DeliveryMan : {}", deliveryManDTO);
        DeliveryMan deliveryMan = deliveryManMapper.toEntity(deliveryManDTO);
        deliveryMan = deliveryManRepository.save(deliveryMan);
        return deliveryManMapper.toDto(deliveryMan);
    }

    @Override
    public Optional<DeliveryManDTO> partialUpdate(DeliveryManDTO deliveryManDTO) {
        log.debug("Request to partially update DeliveryMan : {}", deliveryManDTO);

        return deliveryManRepository
            .findById(deliveryManDTO.getId())
            .map(
                existingDeliveryMan -> {
                    deliveryManMapper.partialUpdate(existingDeliveryMan, deliveryManDTO);
                    return existingDeliveryMan;
                }
            )
            .map(deliveryManRepository::save)
            .map(deliveryManMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryManDTO> findAll() {
        log.debug("Request to get all DeliveryMen");
        return deliveryManRepository.findAll().stream().map(deliveryManMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DeliveryManDTO> findOne(Long id) {
        log.debug("Request to get DeliveryMan : {}", id);
        return deliveryManRepository.findById(id).map(deliveryManMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete DeliveryMan : {}", id);
        deliveryManRepository.deleteById(id);
    }
}
