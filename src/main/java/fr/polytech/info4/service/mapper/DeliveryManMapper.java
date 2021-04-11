package fr.polytech.info4.service.mapper;

import fr.polytech.info4.domain.*;
import fr.polytech.info4.service.dto.DeliveryManDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link DeliveryMan} and its DTO {@link DeliveryManDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface DeliveryManMapper extends EntityMapper<DeliveryManDTO, DeliveryMan> {
    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    DeliveryManDTO toDtoId(DeliveryMan deliveryMan);
}
